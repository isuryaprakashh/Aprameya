import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  filename,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-6 rounded border border-hairline bg-surface-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-hairline bg-surface-1">
        <span className="font-mono text-xs text-mute lowercase">
          {filename || language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 px-2 text-xs text-mute hover:text-paper gap-1"
        >
          {copied ? (
            <>
              <Check className="size-3 text-ok" />
              <span className="text-ok text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] font-mono text-paper leading-relaxed selection:bg-surface-3">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
