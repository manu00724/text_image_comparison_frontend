import { CheckCircle2, FileText, Image, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';

export function FileUploadCard({ label, description, accept, file, onChange, required, kind = 'document' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const Icon = kind === 'image' ? Image : FileText;
  const selectFile = (candidate) => { if (candidate) onChange(candidate); };

  return <div>
    <div className="mb-2 flex items-center justify-between"><label className="text-sm font-bold text-slate-800">{label}{required && <span className="ml-1 text-red-500">*</span>}</label>{file && <button type="button" onClick={() => onChange(null)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500" aria-label={`Remove ${label}`}><X className="h-4 w-4" /></button>}</div>
    <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files[0]); }} className={`flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition ${dragging ? 'border-navy-600 bg-navy-50' : file ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:border-navy-300 hover:bg-navy-50/40'}`}>
      {file ? <><span className="rounded-xl bg-emerald-100 p-3 text-emerald-700"><CheckCircle2 className="h-6 w-6" /></span><span className="mt-3 max-w-full truncate text-sm font-bold text-slate-800">{file.name}</span><span className="mt-1 text-xs text-slate-500">{formatBytes(file.size)}</span></> : <><span className="rounded-xl bg-white p-3 text-navy-700 shadow-sm"><Icon className="h-6 w-6" /></span><span className="mt-3 text-sm font-bold text-slate-700">Drop file here or browse</span><span className="mt-1 text-xs leading-5 text-slate-400">{description}</span><UploadCloud className="mt-3 h-4 w-4 text-slate-400" /></>}
    </button>
    <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
  </div>;
}

function formatBytes(bytes) { if (!bytes) return '0 KB'; const units = ['B', 'KB', 'MB', 'GB']; const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1); return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`; }
