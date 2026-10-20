import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaUpload } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/lib/imageUtils';

export interface ImageUploadFieldProps {
  label: string;
  id: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  id,
  value,
  onChange,
  className = '',
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 800, 0.85);
      onChange(compressed);
      toast({ title: 'Image Uploaded', description: 'Photo loaded and ready to save.' });
    } catch (err: any) {
      toast({
        title: 'Upload Error',
        description: err.message || 'Failed to process image.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label htmlFor={id} className="text-xs font-mono text-[var(--text-3)] uppercase tracking-wider block">
        {label}
      </Label>
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {value ? (
          <div className="relative w-24 h-20 rounded-[var(--r-md)] overflow-hidden border border-[var(--border)] bg-black/40 shrink-0 group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[var(--red-text)] text-xs font-semibold"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="w-24 h-20 rounded-[var(--r-md)] border border-dashed border-[var(--border)] flex items-center justify-center text-[10px] font-mono text-[var(--text-3)] shrink-0 text-center px-1">
            No Image
          </div>
        )}
        <div className="flex-1 space-y-2 w-full">
          <input
            type="file"
            ref={fileRef}
            onChange={handleFile}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            className="text-xs h-8 border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--text-2)] hover:text-[var(--text)] rounded-[var(--r-sm)] gap-1.5"
          >
            <FaUpload className="w-3 h-3 text-[var(--red)]" /> Upload from Computer
          </Button>
          <Input
            id={id}
            placeholder="Or paste image URL (https://...)"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="bg-[var(--surface-2)] border-[var(--border)] text-xs rounded-[var(--r-sm)] text-[var(--text)]"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploadField;
