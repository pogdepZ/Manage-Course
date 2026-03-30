import { useToast } from '../stores/toastStore';

export default function ToastViewport() {
  const { toasts } = useToast();

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <p>{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
