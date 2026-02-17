import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FlashPayload } from '@/types/contracts';

type ToastTone = 'success' | 'error';

interface ToastItem {
    id: string;
    message: string;
    tone: ToastTone;
}

interface ToastStackProps {
    flash?: FlashPayload;
}

export default function ToastStack({ flash }: ToastStackProps) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const timersRef = useRef<Map<string, number>>(new Map());

    const key = useMemo(
        () => `${flash?.success ?? ''}|${flash?.error ?? ''}`,
        [flash?.success, flash?.error],
    );

    useEffect(() => {
        if (flash?.success) {
            enqueueToast(flash.success, 'success');
        }

        if (flash?.error) {
            enqueueToast(flash.error, 'error');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    useEffect(() => {
        const timers = timersRef.current;

        return () => {
            timers.forEach((timerId) => window.clearTimeout(timerId));
            timers.clear();
        };
    }, []);

    const enqueueToast = (message: string, tone: ToastTone) => {
        const id = `${Date.now()}-${Math.random()}`;

        setToasts((currentToasts) => [...currentToasts, { id, message, tone }]);

        const timerId = window.setTimeout(() => {
            dismissToast(id);
        }, 4200);

        timersRef.current.set(id, timerId);
    };

    const dismissToast = (id: string) => {
        const timerId = timersRef.current.get(id);
        if (timerId) {
            window.clearTimeout(timerId);
            timersRef.current.delete(id);
        }

        setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id),
        );
    };

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="dashboard-toast-stack" aria-live="polite" aria-atomic="true">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`dashboard-toast dashboard-toast-${toast.tone}`}
                    role="status"
                >
                    {toast.tone === 'success' ? (
                        <CheckCircle2 size={17} aria-hidden="true" />
                    ) : (
                        <AlertTriangle size={17} aria-hidden="true" />
                    )}
                    <p>{toast.message}</p>
                    <button
                        type="button"
                        onClick={() => dismissToast(toast.id)}
                        className="dashboard-toast-close"
                        aria-label="Dismiss notification"
                    >
                        <X size={14} aria-hidden="true" />
                    </button>
                </div>
            ))}
        </div>
    );
}
