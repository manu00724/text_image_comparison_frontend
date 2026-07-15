import { CommentRangeEnd, CommentRangeStart, CommentReference, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';

const alternativeFor = (clause) => clause.alternative_clause || clause.alternate_clause || '';
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function inlineRuns(node, inherited = {}) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ? [new TextRun({ text: node.textContent, ...inherited })] : [];
  if (node.nodeType !== Node.ELEMENT_NODE) return [];
  if (node.tagName === 'BR') return [new TextRun({ text: '', break: 1 })];
  const style = { ...inherited };
  if (['B', 'STRONG'].includes(node.tagName)) style.bold = true;
  if (['I', 'EM'].includes(node.tagName)) style.italics = true;
  if (node.tagName === 'U') style.underline = {};
  return Array.from(node.childNodes).flatMap((child) => inlineRuns(child, style));
}

function paragraphOptions(element) {
  if (element.tagName === 'H1') return { heading: HeadingLevel.HEADING_1 };
  if (element.tagName === 'H2') return { heading: HeadingLevel.HEADING_2 };
  if (['H3', 'H4', 'H5', 'H6'].includes(element.tagName)) return { heading: HeadingLevel.HEADING_3 };
  if (element.tagName === 'LI') return { bullet: { level: 0 } };
  return { spacing: { after: 120, line: 300 } };
}

function commentedRuns(text, clauses, comments, nextId) {
  const matches = [];
  clauses.forEach((clause) => {
    const source = (clause.onerous_clause || '').trim();
    const alternative = alternativeFor(clause).trim();
    if (!source || !alternative) return;
    for (const match of text.matchAll(new RegExp(escapeRegExp(source), 'gi'))) matches.push({ start: match.index, end: match.index + match[0].length, text: match[0], alternative });
  });
  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const accepted = matches.filter((match, index) => !matches.slice(0, index).some((other) => match.start < other.end));
  if (!accepted.length) return { runs: null, nextId };
  const runs = [];
  let cursor = 0;
  accepted.forEach((match) => {
    if (match.start > cursor) runs.push(new TextRun(text.slice(cursor, match.start)));
    const id = nextId++;
    comments.push({ id, author: 'BG Review Desk', initials: 'BG', date: new Date(), children: [new Paragraph({ children: [new TextRun({ text: 'Suggested alternate clause', bold: true })] }), new Paragraph(match.alternative)] });
    runs.push(new CommentRangeStart(id), new TextRun({ text: match.text, highlight: 'yellow' }), new CommentRangeEnd(id), new CommentReference(id));
    cursor = match.end;
  });
  if (cursor < text.length) runs.push(new TextRun(text.slice(cursor)));
  return { runs, nextId };
}

function createDocument(html, clauses) {
  const parsed = new DOMParser().parseFromString(`<main>${html}</main>`, 'text/html');
  const root = parsed.querySelector('main');
  const comments = [];
  const children = [];
  let nextId = 0;
  root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,blockquote,tr').forEach((element) => {
    if (element.parentElement?.closest('li,blockquote,tr') && !['LI', 'BLOCKQUOTE', 'TR'].includes(element.tagName)) return;
    const text = element.tagName === 'TR' ? Array.from(element.querySelectorAll('th,td')).map((cell) => cell.textContent.trim()).join('\t') : element.textContent || '';
    const result = commentedRuns(text, clauses, comments, nextId);
    nextId = result.nextId;
    children.push(new Paragraph({ ...paragraphOptions(element), children: result.runs || Array.from(element.childNodes).flatMap((node) => inlineRuns(node)) }));
  });
  if (!children.length) children.push(new Paragraph({ children: [new TextRun(parsed.body.textContent || '')] }));
  return { docxDocument: new Document({ creator: 'BG Review Desk', title: 'Bank Guarantee Review', comments: { children: comments }, sections: [{ properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } }, children }] }), commentCount: comments.length };
}

export async function createDocxBlob(html, clauses = []) {
  const { docxDocument, commentCount } = createDocument(html, clauses);
  return { blob: await Packer.toBlob(docxDocument), commentCount };
}

export async function downloadDocxWithClauseComments(html, clauses = [], filename = 'bg-review-with-comments.docx') {
  const { blob, commentCount } = await createDocxBlob(html, clauses);
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return commentCount;
}
