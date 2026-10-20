import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/lib/types';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/CodeBlock';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogDetails() {
  const [, params] = useRoute('/blogs/:id');
  const id = params?.id;
  const { toast } = useToast();
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Track scroll for sticky 2px red reading-progress bar pinned under header
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadingProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: blog, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blogs/${id}`],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/blogs/${id}`);
      if (!res.ok) {
        return null;
      }
      return res.json();
    },
    enabled: !!id,
    staleTime: 60000,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: 'Link copied', description: 'Article link copied to clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-ink text-paper pt-28 pb-24 px-6 max-w-[800px] mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="aspect-[16/10] w-full" />
        <Skeleton className="h-24 w-full" />
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-medium mb-3">Article not found</h1>
        <p className="text-sm text-mute mb-6">The article you are looking for may have moved or been archived.</p>
        <Link href="/blogs">
          <Button variant="secondary">Back to articles</Button>
        </Link>
      </main>
    );
  }

  const sampleSnippet = `# NVIDIA TensorRT Calibration Pipeline
import tensorrt as trt
import pycuda.driver as cuda

TRT_LOGGER = trt.Logger(trt.Logger.WARNING)
builder = trt.Builder(TRT_LOGGER)
config = builder.create_builder_config()
config.set_flag(trt.BuilderFlag.INT8)
config.int8_calibrator = PointCloudEntropyCalibrator(calib_cache="orincache.bin")`;

  return (
    <>
      {/* 2px red reading progress bar pinned directly beneath header (§8.7) */}
      <div className="fixed top-16 left-0 right-0 h-[2px] z-40 bg-transparent">
        <div
          className="h-full bg-signal transition-all duration-75"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="min-h-screen bg-ink text-paper pt-28 pb-24 px-6">
        <article className="max-w-[760px] mx-auto">
          {/* Back link */}
          <Link href="/blogs" className="inline-flex items-center gap-2 text-xs text-mute hover:text-paper transition-colors mb-8">
            <ArrowLeft className="size-3.5" />
            <span>All articles</span>
          </Link>

          {/* Header Metadata */}
          <header className="mb-10 pb-8 border-b border-hairline">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                {blog.category || 'Engineering'}
              </Badge>
              <span className="font-mono text-xs text-mute">
                {blog.date} · {blog.read_time || '5 min read'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-paper leading-[1.15] mb-6">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-surface-2 border border-hairline flex items-center justify-center font-mono text-xs text-paper">
                  {(blog.author || 'A').charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-paper">{blog.author || 'Aprameya Engineering'}</p>
                  <p className="text-xs text-mute">Autonomous Systems Club</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-1.5 text-xs text-mute hover:text-paper"
              >
                {copied ? <Check className="size-3.5 text-ok" /> : <Share2 className="size-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </Button>
            </div>
          </header>

          {/* Hero Image */}
          {blog.image && (
            <figure className="mb-10">
              <div className="aspect-[16/10] w-full overflow-hidden border border-hairline">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="mt-2 text-xs text-mute text-center font-sans">
                Sensor testing rig installed on the Aprameya testbed vehicle.
              </figcaption>
            </figure>
          )}

          {/* Prose Content (66ch max, font-size 18px line-height 1.7 per §8.7) */}
          <div className="prose prose-invert max-w-[66ch] mx-auto text-text-2 text-[17px] leading-[1.75] space-y-6">
            {blog.excerpt && (
              <p className="text-lg text-paper font-medium leading-relaxed border-l-2 border-signal pl-4 my-6">
                {blog.excerpt}
              </p>
            )}

            {blog.content ? (
              <div className="whitespace-pre-line">{blog.content}</div>
            ) : (
              <p>Full article manuscript under active compilation.</p>
            )}

            <CodeBlock code={sampleSnippet} language="python" filename="tensorrt_calibration.py" />
          </div>

          {/* Footer Navigation */}
          <div className="mt-16 pt-8 border-t border-hairline flex items-center justify-between">
            <Link href="/blogs">
              <Button variant="secondary" size="sm">
                Back to all articles
              </Button>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
