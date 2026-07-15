const SELECTOR = 'mark[data-bg-highlight="true"]';
const BLOCKED_VALUES = new Set(['', 'YES', 'NO', 'NA']);
export function isHighlightable(value) {
    return !BLOCKED_VALUES.has((value ?? '').trim().toUpperCase());
}
function clearFromRoot(root) {
    root.querySelectorAll(SELECTOR).forEach((mark) => {
        const parent = mark.parentNode;
        if (!parent)
            return;
        parent.replaceChild(document.createTextNode(mark.textContent ?? ''), mark);
        parent.normalize();
    });
}
export function clearGeneratedHighlights(input) {
    if (typeof input === 'string') {
        const doc = new DOMParser().parseFromString(`<div id="bg-root">${input}</div>`, 'text/html');
        const root = doc.getElementById('bg-root');
        clearFromRoot(root);
        return root.innerHTML;
    }
    clearFromRoot(input);
}
function escaped(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
export function countMatches(root, searchText) {
    if (!isHighlightable(searchText))
        return 0;
    const regex = new RegExp(escaped(searchText.trim()), 'gi');
    let count = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            return parent && !['SCRIPT', 'STYLE'].includes(parent.tagName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
    });
    let node;
    while ((node = walker.nextNode()))
        count += node.textContent?.match(regex)?.length ?? 0;
    return count;
}
export function highlightAllMatches(root, searchText) {
    clearGeneratedHighlights(root);
    if (!isHighlightable(searchText))
        return 0;
    const regex = new RegExp(escaped(searchText.trim()), 'gi');
    const textNodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            return parent && !['SCRIPT', 'STYLE', 'MARK'].includes(parent.tagName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
    });
    let node;
    while ((node = walker.nextNode()))
        textNodes.push(node);
    let total = 0;
    textNodes.forEach((textNode) => {
        const text = textNode.nodeValue ?? '';
        regex.lastIndex = 0;
        if (!regex.test(text))
            return;
        regex.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let cursor = 0;
        for (const match of text.matchAll(regex)) {
            const index = match.index ?? 0;
            fragment.append(document.createTextNode(text.slice(cursor, index)));
            const mark = document.createElement('mark');
            mark.dataset.bgHighlight = 'true';
            mark.textContent = match[0];
            fragment.append(mark);
            cursor = index + match[0].length;
            total += 1;
        }
        fragment.append(document.createTextNode(text.slice(cursor)));
        textNode.replaceWith(fragment);
    });
    return total;
}
export function scrollToFirstHighlight(root) {
    root.querySelector(SELECTOR)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
