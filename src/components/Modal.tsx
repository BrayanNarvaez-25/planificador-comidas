import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  confirmDisabled?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hideFooter?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  confirmDisabled = false,
  maxWidth = 'lg',
  hideFooter = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-[580px]',
    xl: 'sm:max-w-[620px]',
    '2xl': 'sm:max-w-[640px]',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        // Close when clicking directly on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`w-full ${maxWidthClasses[maxWidth]} my-auto bg-white rounded-2xl sm:rounded-3xl border border-neutral-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh] transition-all transform duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-100 shrink-0">
          <h2 id="modal-title" className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with internal scroll */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1 text-xs sm:text-sm text-neutral-600">
          {children}
        </div>

        {/* Footer actions: fixed at the bottom */}
        {!hideFooter && (
          <div className="sticky bottom-0 z-10 shrink-0 flex items-center justify-end gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white sm:bg-neutral-50/90 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 text-xs sm:text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-colors focus-visible:outline-2 focus-visible:outline-neutral-900 flex items-center justify-center"
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={confirmDisabled}
                className={`flex-1 sm:flex-initial min-h-[44px] px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                  confirmVariant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 focus-visible:outline-rose-600'
                    : 'bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-600'
                }`}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
