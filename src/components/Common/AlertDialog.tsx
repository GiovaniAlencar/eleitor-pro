import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'success';
}

export default function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}: AlertDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          border: 'border-red-100',
          button: 'bg-red-600 hover:bg-red-700',
          icon: 'text-red-600'
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-100',
          button: 'bg-green-600 hover:bg-green-700',
          icon: 'text-green-600'
        };
      default:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-100',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          icon: 'text-yellow-600'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-md transform overflow-hidden rounded-2xl ${styles.bg} ${styles.border} p-6 text-left align-middle shadow-xl transition-all`}>
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mt-2">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium text-white ${styles.button} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}