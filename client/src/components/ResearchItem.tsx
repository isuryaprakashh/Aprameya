import React, { useState } from 'react';
import { ResearchItem as ResearchItemType } from '@/lib/types';
import { Detect } from '@/components/ui/detect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Copy, Check } from 'lucide-react';

interface ResearchItemProps {
  item: ResearchItemType;
  onReadMore?: () => void;
}

export const ResearchItem: React.FC<ResearchItemProps> = ({ item, onReadMore }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const bibtex = `@article{aprameya_${item._id || item.id || 'pub'},
  title = {${item.title}},
  author = {${item.authors || 'Aprameya ASC'}},
  journal = {${item.venue || item.category || 'Aprameya Research'}},
  year = {${item.year || item.date || '2025'}}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const yearMatch = item.date?.match(/\d{4}/);
  const displayYear = item.year || (yearMatch ? yearMatch[0] : '2025');

  return (
    <Detect label="paper" className="w-full">
      <div className="w-full bg-ink border border-hairline p-5 md:p-6 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-[11px]">
              {item.category || 'Autonomous Systems'}
            </Badge>
            <span className="font-mono text-xs text-mute">
              {item.venue ? `${item.venue} · ` : ''}{displayYear}
            </span>
          </div>

          <h3 className="text-base md:text-lg font-medium text-paper leading-snug">
            {item.title}
          </h3>

          <p className="text-[13px] text-mute mt-1.5 line-clamp-1">
            {item.authors || 'Aprameya Research Division, Autonomous Systems Club'}
          </p>

          {item.description && (
            <p className="text-[13px] text-text-2 mt-2 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0">
          {item.pdfUrl ? (
            <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <FileText className="size-3.5" />
                <span>PDF</span>
              </Button>
            </a>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onReadMore}
              className="gap-1.5 text-xs"
            >
              <FileText className="size-3.5" />
              <span>Abstract</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCite}
            className="gap-1.5 text-xs text-mute hover:text-paper"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-ok" />
                <span className="text-ok">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Cite</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Detect>
  );
};

export default ResearchItem;
