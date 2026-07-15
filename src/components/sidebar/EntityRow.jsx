import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { isHighlightable } from '../../utils/highlightHtml';
export function EntityRow({ label, value, matched, onSelect }) {
    const clickable = isHighlightable(value);
    return _jsxs("div", { className: `grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-3 border-b border-slate-100 px-4 py-3 last:border-0 ${matched ? '' : 'bg-red-50/60'}`, children: [_jsxs("div", { className: "flex items-start gap-2 text-xs font-medium leading-5 text-slate-500", children: [matched ? _jsx(CheckCircle2, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" }) : _jsx(AlertCircle, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" }), _jsx("span", { children: label })] }), _jsx("button", { disabled: !clickable, onClick: () => clickable && onSelect(value), className: `break-words text-right text-xs font-semibold leading-5 ${clickable ? 'text-navy-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-700' : 'cursor-default text-slate-400'}`, children: value || '—' })] });
}
