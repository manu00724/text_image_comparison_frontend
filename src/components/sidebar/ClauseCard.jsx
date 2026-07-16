import { FileText, MessageSquareText, Search } from 'lucide-react';
import { Badge } from '../common/Badge';

const getAlternativeClause = (clause) => clause.alternative_clause || clause.alternate_clause || '';

export function ClauseCard({ clause, onSelect }) {
  const alternative = getAlternativeClause(clause);
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex flex-wrap gap-1.5"><Badge tone="amber">{clause.onerous_class}</Badge><Badge tone="red">{clause.classification}</Badge><Badge tone="blue">{Number(clause.similarity || 0).toFixed(3)} match</Badge></div>
    <button onClick={() => onSelect(clause.onerous_clause)} className="group flex w-full items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-left text-sm font-semibold leading-6 text-slate-800 transition hover:border-amber-300 hover:bg-amber-50 hover:text-navy-700">
      <Search className="mt-1 h-4 w-4 shrink-0 text-amber-600" /><span className="min-w-0 flex-1 underline decoration-amber-300 underline-offset-2">{clause.onerous_clause}</span>
    </button>
    <div className="mt-3 flex items-start justify-between gap-3"><h3 className="text-xs font-bold text-slate-700">{clause.onerous_name}</h3>{alternative && <div className="group/tooltip relative shrink-0"><button type="button" aria-label={`Show alternate clause for ${clause.onerous_name}`} className="rounded-lg border border-indigo-200 bg-indigo-50 p-1.5 text-indigo-700 hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-400"><MessageSquareText className="h-4 w-4" /></button><div role="tooltip" className="pointer-events-none absolute right-0 top-9 z-30 hidden w-72 rounded-xl border border-slate-200 bg-slate-950 p-3 text-left text-xs font-normal leading-5 text-white shadow-2xl group-hover/tooltip:block group-focus-within/tooltip:block"><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300">Alternate clause</p>{alternative}</div></div>}</div>
    <dl className="mt-3 space-y-2 text-xs leading-5"><Detail label="Description" value={clause.description} /><Detail label="Reason" value={clause.reason} /><Detail label="Decision" value={clause.decision_reason} /></dl>
    {clause.trigger_keyword && <button onClick={() => onSelect(clause.trigger_keyword)} className="mt-3 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100">Trigger: {clause.trigger_keyword}</button>}
    {clause.nwc_flag && <p className="mt-2 text-xs text-slate-500">NWC: {clause.nwc_flag}</p>}
    {clause.filename && <p className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-400"><FileText className="h-3.5 w-3.5" />{clause.filename}</p>}
  </article>;
}
function formatDetail(value) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string') {
    try { return JSON.stringify(value, null, 2); }
    catch { return String(value); }
  }
  const fenced = value.trim().match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const candidate = fenced ? fenced[1] : value;
  try {
    const parsed = JSON.parse(candidate);
    return typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
  } catch { return value; }
}
function Detail({ label, value }) { const formatted = formatDetail(value); return formatted ? <div><dt className="font-semibold text-slate-500">{label}</dt><dd className="whitespace-pre-wrap break-words text-slate-600">{formatted}</dd></div> : null; }
