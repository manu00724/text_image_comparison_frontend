import { sampleResponse } from '../data/sampleResponse';

export const requestMetadata = { requestingapp: 'BG_PORTAL', producttype: 'BANK_GUARANTEE', subproducttype: 'FINANCIAL_GUARANTEE', winame: 'WI202507140001', requestId: 'REQ202507140001', bgreferencenumber: 'BG202507140001', requestdatetime: new Date().toISOString(), sessionID: 'SESSION123456' };
const API_URL = import.meta.env.VITE_BG_REVIEW_API_URL;

const fileToDataUrl = (file) => new Promise((resolve, reject) => { if (!file) return resolve(''); const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error(`Could not read ${file.name}`)); reader.readAsDataURL(file); });
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
const textToHtml = (text) => text.split(/\r?\n/).map((line) => line.trim() ? `<p>${escapeHtml(line)}</p>` : '<p><br></p>').join('');

export async function submitGuaranteeForReview({ bgFile, crlFile }) {
  const [bgFileData, crlFileData] = await Promise.all([fileToDataUrl(bgFile), fileToDataUrl(crlFile)]);
  const packet = { ...requestMetadata, requestdatetime: new Date().toISOString(), bg_file: bgFileData, crl_file: crlFileData };
  if (API_URL) {
    const response = await fetch(`${API_URL}/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(packet) });
    if (!response.ok) throw new Error(`Document review failed (${response.status})`);
    return response.json();
  }
  await new Promise((resolve) => setTimeout(resolve, 700));
  let bgTextHtml = sampleResponse.bgTextHtml;
  if (['text/plain', 'text/html'].includes(bgFile.type) || /\.(txt|html?|htm)$/i.test(bgFile.name)) {
    const sourceText = await bgFile.text();
    bgTextHtml = bgFile.type === 'text/plain' || bgFile.name.toLowerCase().endsWith('.txt') ? textToHtml(sourceText) : sourceText;
  }
  return { ...sampleResponse, bgTextHtml, crl_image: crlFileData || sampleResponse.crl_image, sourceFiles: { bgName: bgFile.name, crlName: crlFile?.name || '', bgFileData } };
}

export async function revalidateGuarantee(current) {
  const packet = { ...requestMetadata, requestdatetime: new Date().toISOString(), bg_file: '', crl_file: '', bgTextHtml: current.bgTextHtml };
  if (!API_URL) { await new Promise((resolve) => setTimeout(resolve, 900)); return current; }
  const response = await fetch(`${API_URL}/revalidate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(packet) });
  if (!response.ok) throw new Error(`Revalidation failed (${response.status})`);
  return response.json();
}
