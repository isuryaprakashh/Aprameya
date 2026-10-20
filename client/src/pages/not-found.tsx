import { Link } from 'wouter';
import ChamferedButton from '@/components/ui/ChamferedButton';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] w-full flex items-center justify-center px-6 py-16 bg-bg text-text">
      <div className="w-full max-w-md text-center border border-border bg-surface p-8 sm:p-10 rounded-lg">
        {/* Large mono 404 in --text-3 (Section 4.13) */}
        <div className="font-mono text-5xl sm:text-6xl text-text-3 font-medium mb-3">
          404
        </div>

        <h1 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text mb-2">
          Page not found.
        </h1>

        <p className="text-sm text-text-2 leading-relaxed mb-8">
          The requested route or laboratory resource does not exist.
        </p>

        <div className="flex justify-center">
          <Link href="/">
            <ChamferedButton variant="primary" size="md">
              Back to home
            </ChamferedButton>
          </Link>
        </div>
      </div>
    </main>
  );
}
