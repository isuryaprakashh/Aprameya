import { Link } from "wouter";

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-40 bg-[var(--bg-body)]/90 backdrop-blur-sm border-b border-[var(--border-color)]">
            <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[hsl(var(--accent))] animate-pulse"></div>
                    <span className="font-bold text-sm tracking-tighter text-[var(--text-primary)]">APRAMEYA.AI</span>
                </div>
                <nav className="hidden md:flex gap-8 text-xs tracking-widest text-[var(--text-secondary)]">
                    <Link href="/mission" className="hover:text-[var(--text-primary)] transition-colors">[ MISSION ]</Link>
                    <Link href="/research" className="hover:text-[var(--text-primary)] transition-colors">[ RESEARCH ]</Link>
                    <Link href="/join" className="hover:text-[var(--text-primary)] transition-colors">[ JOIN ]</Link>
                </nav>
                <button className="border border-[hsl(var(--accent))] px-3 py-1 text-[10px] hover-invert font-bold uppercase text-[var(--text-primary)]">
                    Status: Online
                </button>
            </div>
        </header>
    );
}
