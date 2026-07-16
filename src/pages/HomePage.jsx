import { ArrowRight, Building2, FileCheck2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { FileUploadCard } from '../components/common/FileUploadCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { requestMetadata, submitGuaranteeForReview } from '../services/bgReviewApi';

const supportedCrlExtension = /\.(pdf|tif|tiff)$/i;

export function HomePage({ onReviewReady }) {
  const [bgFile, setBgFile] = useState(null);
  const [crlFile, setCrlFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!bgFile) return setError('Please upload the Bank Guarantee document.');
    if (!crlFile) return setError('Please upload the CRL reference document.');
    if (!supportedCrlExtension.test(crlFile.name)) return setError('The CRL document must be a PDF, TIF, or TIFF file.');
    setLoading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('bg_file', bgFile);
      formData.append('crl_file', crlFile);
      formData.append('requestId', requestMetadata.requestId);
      formData.append('bgreferencenumber', requestMetadata.bgreferencenumber);
      formData.append('requestingapp', requestMetadata.requestingapp);
      formData.append('subproducttype', requestMetadata.subproducttype);
      formData.append('winame', requestMetadata.winame);
      onReviewReady(await submitGuaranteeForReview(formData));
    }
    catch (submissionError) { setError(submissionError instanceof Error ? submissionError.message : 'The review could not be started.'); }
    finally { setLoading(false); }
  };

  return <main className="min-h-screen bg-slate-100">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4"><span className="rounded-xl bg-navy-900 p-2.5 text-white"><Building2 className="h-5 w-5" /></span><div><h1 className="text-base font-bold text-slate-900">Guarantee Review Desk</h1><p className="text-xs text-slate-400">Bank Guarantee document intelligence</p></div><span className="ml-auto hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex"><ShieldCheck className="h-4 w-4" />Secure review workspace</span></div></header>
    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
      <div className="self-center"><span className="inline-flex rounded-full bg-navy-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy-700">New review</span><h2 className="mt-5 max-w-xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Review guarantee language with confidence.</h2><p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Upload the original Bank Guarantee and its CRL reference. The source files remain separate from the editable review HTML, so users can always return to the original document context.</p><div className="mt-8 space-y-3"><Benefit text="Compare extracted BG and CRL entities" /><Benefit text="Locate onerous clauses inside the editable document" /><Benefit text="Export review-ready DOCX files with alternate-clause comments" /></div></div>
      <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-panel sm:p-7"><div className="mb-6"><h3 className="text-xl font-bold text-slate-900">Upload documents</h3><p className="mt-1 text-sm text-slate-500">Files are submitted together when you start the review.</p></div><div className="grid gap-5 sm:grid-cols-2"><FileUploadCard label="Bank Guarantee" description="DOC, DOCX, PDF, HTML or TXT" accept=".doc,.docx,.pdf,.html,.htm,.txt" file={bgFile} onChange={setBgFile} required /><FileUploadCard label="CRL reference" description="PDF, TIF or TIFF" accept=".pdf,.tif,.tiff" file={crlFile} onChange={setCrlFile} required /></div>{error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}<button disabled={loading} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 text-sm font-bold text-white shadow-sm hover:bg-navy-800 disabled:opacity-60">{loading ? <LoadingSpinner /> : <FileCheck2 className="h-5 w-5" />}{loading ? 'Preparing review...' : 'Start document review'}{!loading && <ArrowRight className="h-4 w-4" />}</button></form>
    </section>
  </main>;
}
function Benefit({ text }) { return <div className="flex items-center gap-3 text-sm font-medium text-slate-700"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-700"><FileCheck2 className="h-3.5 w-3.5" /></span>{text}</div>; }
