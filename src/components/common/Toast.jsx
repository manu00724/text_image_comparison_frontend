import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';
export function ToastRegion({ toasts, onDismiss }) {
    const icons = { success: CheckCircle2, error: CircleAlert, info: Info };
    return _jsx("div", { className: "fixed right-5 top-5 z-[100] flex w-[min(380px,calc(100vw-40px))] flex-col gap-2", "aria-live": "polite", children: toasts.map((toast) => { const Icon = icons[toast.kind]; return _jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-panel", children: [_jsx(Icon, { className: `h-5 w-5 shrink-0 ${toast.kind === 'success' ? 'text-emerald-600' : toast.kind === 'error' ? 'text-red-600' : 'text-blue-600'}` }), _jsx("span", { className: "flex-1 font-medium", children: toast.message }), _jsx("button", { onClick: () => onDismiss(toast.id), "aria-label": "Dismiss notification", children: _jsx(X, { className: "h-4 w-4 text-slate-400" }) })] }, toast.id); }) });
}
