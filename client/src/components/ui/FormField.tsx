
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
        <label htmlFor={id} className="text-xs font-mono text-[var(--text-3)] mb-2 block uppercase tracking-wider">
            {label}
        </label>
        {isTextArea ? (
            <Textarea
                id={id}
                value={value}
                rows={rows}
                onChange={onChange}
                className="bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
            />
        ) : (
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className="bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
            />
        )}
    </div>
);
