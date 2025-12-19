
import React, { useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

const ToastItem: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onRemove: () => void }> = ({ message, type, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 5000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const baseClasses = 'relative w-full max-w-sm p-4 rounded-lg shadow-lg flex items-center space-x-4 transition-all transform';
  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span>{message}</span>
      <button onClick={onRemove} className="absolute top-1 right-1 p-1 text-lg leading-none">&times;</button>
    </div>
  );
};


const Toast: React.FC = () => {
    const { toasts, removeToast } = useToast();
  
    if (!toasts.length) return null;
  
    return (
      <div className="fixed bottom-5 right-5 z-50 space-y-3">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
    );
  };
  
  export default Toast;
