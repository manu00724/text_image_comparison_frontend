import { useCallback, useState } from 'react';
export function useToast() {
    const [toasts, setToasts] = useState([]);
    const showToast = useCallback((message, kind = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((items) => [...items, { id, message, kind }]);
        window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3500);
    }, []);
    const dismissToast = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), []);
    return { toasts, showToast, dismissToast };
}
