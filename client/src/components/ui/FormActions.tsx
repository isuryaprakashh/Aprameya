import React from 'react';
import { Button } from './button';
import { FaSave } from 'react-icons/fa';

export interface FormActionsProps {
  onCancel: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Standard bottom action buttons (Cancel & Save Changes) for editor forms, dialogs, and settings panels.
 */
export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSave,
  isSaving = false,
  saveLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-end gap-3 ${className}`}>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSaving || disabled}
        className="text-xs h-9 px-4 rounded-[var(--r-md)] border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
      >
        {cancelLabel}
      </Button>
      {onSave && (
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving || disabled}
          className="bg-[var(--red)] text-white hover:bg-[var(--red-hover)] text-xs h-9 px-5 rounded-[var(--r-md)] font-medium shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <FaSave className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : saveLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default FormActions;
