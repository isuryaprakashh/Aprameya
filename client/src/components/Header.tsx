import { Link } from "wouter";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-40 bg-black/90 backdrop-blur-sm border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white animate-pulse"></div>
                <span className="font-bold text-sm tracking-tighter">APRAMEYA.AI</span>
            </div>
            <nav className="hidden md:flex gap-8 text-xs tracking-widest text-gray-400">
                <Link href="/mission" className="hover:text-white transition-colors">[ MISSION ]</Link>
                <Link href="/research" className="hover:text-white transition-colors">[ RESEARCH ]</Link>
                <Link href="/join" className="hover:text-white transition-colors">[ JOIN ]</Link>
            </nav>
            <button className="border border-white px-3 py-1 text-[10px] hover-invert font-bold uppercase">
                Status: Online
            </button>
        </div>
    </header>
  );
}
