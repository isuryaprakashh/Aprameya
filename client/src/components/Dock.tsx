import { Home, Layers, Cpu } from 'lucide-react';
import { Link } from 'wouter';

const Dock = () => {
    return (
        <nav className="dock-container glass-panel">
            <Link href="/" className="dock-item">
                <Home className="w-5 h-5" />
                <span className="dock-tooltip">Home</span>
            </Link>
            <Link href="/projects" className="dock-item">
                <Layers className="w-5 h-5" />
                <span className="dock-tooltip">Components</span>
            </Link>
            <Link href="/dashboard" className="dock-item">
                <Cpu className="w-5 h-5" />
                <span className="dock-tooltip">System</span>
            </Link>
            <div className="w-[1px] h-6 bg-gray-500/20 mx-1"></div>
            <Link href="/design" className="dock-item">
                <Layers className="w-5 h-5" />
                <span className="dock-tooltip">Design</span>
            </Link>
        </nav>
    );
};

export default Dock;
