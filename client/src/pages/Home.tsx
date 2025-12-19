import { Link } from 'wouter';
import { stats, featuredItems } from '../lib/data';
import StatsCard from '../components/StatsCard';

import { ButtonViolet3D, ButtonDarkSpec } from '../components/ui/v6-buttons';
import { CleanCard } from '../components/ui/v6-card';

const Home = () => {
  return (
    <div className="min-h-screen w-full relative z-10 pb-32 pt-12 px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex flex-col justify-center items-start relative mb-24">
        <div className="hero-glow"></div>



        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-[var(--text-primary)] mb-8 leading-none reveal reveal-delay-1">
          APRAMEYA<br />
          <span className="text-[var(--text-secondary)]">AI & Autonomous Club</span>
        </h1>

        <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-10 reveal reveal-delay-2">
          Exploring the Future of Self-Driving Technology.
        </p>

        <div className="flex gap-4 reveal reveal-delay-3">
          <Link href="/projects">
            <ButtonViolet3D className="px-8 py-4 text-sm inline-block">
              Explore Projects
            </ButtonViolet3D>
          </Link>

          <Link href="/signup">
            <ButtonDarkSpec className="px-8 py-4 text-sm rounded-xl inline-flex items-center">
              <span className="relative z-10">Join Us</span>
            </ButtonDarkSpec>
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-6 h-6 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] flex items-center justify-center font-mono">01</span>
          <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest">Driving Innovation Forward</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <Link key={item.id} href={item.link} className="block h-full">
              <CleanCard className="group h-full flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden border-b border-[var(--border-color)]">
                  <div className="shimmer pointer-events-none"></div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] pulse-core mr-2"></div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">{item.category}</span>
                  </div>
                  <h3 className="font-medium text-xl mb-2 text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed flex-grow">
                    {item.description}
                  </p>
                  <div className="inline-flex items-center text-[hsl(var(--accent))] text-xs font-mono uppercase tracking-wider group-hover:underline transition-all mt-auto">
                    Learn more
                    <svg className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </div>
                </div>
              </CleanCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-6 h-6 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] flex items-center justify-center font-mono">02</span>
          <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest">System Telemetry</h2>
        </div>
        <StatsCard stats={stats} />
      </section>
    </div>
  );
};

export default Home;
