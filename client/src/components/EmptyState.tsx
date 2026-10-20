import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-border rounded-lg bg-surface/50 max-w-md mx-auto my-8">
      <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center mb-4 text-text-3">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="font-body font-semibold text-base text-text mb-1">
        {title}
      </h4>
      <p className="text-sm text-text-2 mb-6 max-w-xs leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="h-9 px-4 rounded-md border border-border-strong text-text hover:bg-surface-2 transition-colors duration-fast text-xs font-body font-medium cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
