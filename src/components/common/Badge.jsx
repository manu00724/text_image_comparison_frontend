import { jsx as _jsx } from "react/jsx-runtime";
export function Badge({ children, tone = 'slate' }) {
    const tones = { slate: 'bg-slate-100 text-slate-700', blue: 'bg-blue-50 text-blue-700 ring-blue-200', red: 'bg-red-50 text-red-700 ring-red-200', green: 'bg-emerald-50 text-emerald-700 ring-emerald-200', amber: 'bg-amber-50 text-amber-800 ring-amber-200' };
    return _jsx("span", { className: `inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${tones[tone]}`, children: children });
}
