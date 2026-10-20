import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-hairline rounded-[var(--r-3)] bg-transparent max-w-md mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mb-4 text-mute">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h4 className="font-sans font-semibold text-[17px] text-paper mb-1">
        {title}
      </h4>
      <p className="text-[14px] text-text-2 mb-6 max-w-xs leading-relaxed">
        {description}
      </p>
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
