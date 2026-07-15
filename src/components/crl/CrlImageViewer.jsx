import { Minus, PanelRightClose, Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export function CrlImageViewer({ image, open, onClose }) {
  const [zoom, setZoom] = useState(1);
  if (!open || !image) return null;
  const source = image.startsWith('data:') ? image : `data:image/png;base64,${image}`;
  return <><button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={onClose} aria-label="Close CRL panel" /><aside className="fixed inset-y-0 right-0 z-40 flex w-[min(420px,94vw)] flex-col border-l border-slate-200 bg-white shadow-2xl lg:sticky lg:top-5 lg:z-0 lg:h-[calc(100vh-130px)] lg:w-[360px] lg:shrink-0 lg:rounded-xl lg:border lg:shadow-panel" aria-label="CRL image panel">
    <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3"><div><h2 className="text-sm font-bold text-slate-900">CRL reference</h2><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Zoom {Math.round(zoom * 100)}%</p></div><div className="flex gap-1"><Control label="Zoom out" onClick={() => setZoom((v) => Math.max(.5, v - .25))}><Minus /></Control><Control label="Zoom in" onClick={() => setZoom((v) => Math.min(3, v + .25))}><Plus /></Control><Control label="Reset zoom" onClick={() => setZoom(1)}><RotateCcw /></Control><Control label="Close CRL panel" onClick={onClose}><PanelRightClose /></Control></div></div>
    <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-4 text-center"><img src={source} alt="CRL document" className="mx-auto max-w-none origin-top rounded border border-slate-200 bg-white shadow-sm" style={{ width: `${zoom * 100}%` }} /></div>
  </aside></>;
}
function Control({ label, onClick, children }) { return <button onClick={onClick} aria-label={label} title={label} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 [&>svg]:h-4 [&>svg]:w-4">{children}</button>; }
