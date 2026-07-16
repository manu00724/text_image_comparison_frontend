export const requestMetadata = {
  requestId: 'REQ202507140001',
  bgreferencenumber: 'BG202507140001',
  requestingapp: 'BG_PORTAL',
  subproducttype: 'FINANCIAL_GUARANTEE',
  winame: 'WI202507140001'
};

const API_URL = (import.meta.env.VITE_BG_REVIEW_API_URL || 'http://localhost:8000/gen-ai-backend/bg/api/v1').replace(/\/+$/, '');
const REQUIRED_REVIEW_FIELDS = ['bg_file', 'crl_file', 'requestId', 'bgreferencenumber', 'requestingapp', 'subproducttype', 'winame'];

function parseBody(text) {
  if (!text) return null;
  try { return JSON.parse(text); }
  catch { return text; }
}

function missingFieldsFrom(body) {
  if (!Array.isArray(body?.detail)) return [];
  return body.detail
    .filter((item) => item?.type === 'missing' || /required/i.test(item?.msg || ''))
    .map((item) => item?.loc?.at(-1))
    .filter(Boolean);
}

function detailMessageFrom(detail) {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => `${item?.loc?.join('.') || 'request'}: ${item?.msg || item?.type || 'validation error'}`)
      .join('; ');
  }
  if (!detail) return '';
  try { return JSON.stringify(detail); }
  catch { return String(detail); }
}

async function readResponse(response, operation) {
  const body = parseBody(await response.text());
  if (response.ok) return body;

  const detail = body?.detail;
  const missingFields = missingFieldsFrom(body);
  const detailMessage = detailMessageFrom(detail);
  const missingMessage = missingFields.length ? ` Missing fields: ${missingFields.join(', ')}.` : '';
  const error = new Error(`${operation} failed (HTTP ${response.status}).${missingMessage}${detailMessage ? ` ${detailMessage}` : ''}`);
  error.name = 'BgReviewApiError';
  error.status = response.status;
  error.body = body;
  error.detail = detail;
  error.missingFields = missingFields;
  console.error(`${operation} backend error`, {
    status: response.status,
    body,
    detail,
    missingFields
  });
  throw error;
}

export async function submitGuaranteeForReview(formData) {
  if (!(formData instanceof FormData)) throw new TypeError('Document review requires a FormData request.');
  const missingFields = REQUIRED_REVIEW_FIELDS.filter((field) => !formData.get(field));
  if (missingFields.length) throw new Error(`Document review is missing required fields: ${missingFields.join(', ')}.`);

  const response = await fetch(`${API_URL}/doc_check/`, {
    method: 'POST',
    body: formData
  });
  return readResponse(response, 'Document review');
}

export async function revalidateGuarantee(bgTextHtml) {
  const response = await fetch(`${API_URL}/revalidate/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bgTextHtml })
  });
  return readResponse(response, 'Revalidation');
}
