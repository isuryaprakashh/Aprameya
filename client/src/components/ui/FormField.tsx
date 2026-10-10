
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
    label: string;
    id: string;
    type?: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isTextArea?: boolean;
    rows?: number;
    className?: string; // Allow custom styling
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    id,
    type = "text",
    value,
    onChange,
    isTextArea = false,
    rows = 4,
    className
}) => (
    <div className={`mb-4 ${className || ''}`}>
        <label htmlFor={id} className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">
            {label}
        </label>
        {isTextArea ? (
            <Textarea
                id={id}
                value={value}
                rows={rows}
                onChange={onChange}
                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[hsl(var(--accent))]/50"
            />
        ) : (
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[hsl(var(--accent))]/50"
            />
        )}
    </div>
);
