import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  warningNote?: string | null;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  warningNote,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = true,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmVariant={isDestructive ? 'danger' : 'primary'}
      maxWidth="md"
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-2.5 rounded-xl shrink-0 ${
            isDestructive ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          {isDestructive ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div className="space-y-2">
          <p className="text-neutral-800 text-sm leading-relaxed">{message}</p>
          {warningNote && (
            <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-lg text-amber-900 text-xs leading-normal">
              {warningNote}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
