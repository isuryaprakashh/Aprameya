/**
 * AprameyaLoader — animated SVG stroke loader derived from the Aprameya emblem.
 * Path is a best-effort trace of the PNG logo. Hot-swap the `d` attribute
 * when the original SVG source is available. The component interface is stable.
 *
 * Usage: <AprameyaLoader size={32} />
 */
interface AprameyaLoaderProps {
  size?: number;
  className?: string;
}

export default function AprameyaLoader({ size = 32, className = '' }: AprameyaLoaderProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Loading"
      role="status"
    >
      {/* Stylized "A" / schematic mark — approximate path from PNG.
          Replace the `d` value below with the real path from the SVG source. */}
      <path
        d="M 50 10
           L 15 80
           L 28 80
           L 38 58
           L 62 58
           L 72 80
           L 85 80
           Z
           M 42 46 L 50 26 L 58 46 Z"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="logo-draw-path"
      />
    </svg>
  );
}
