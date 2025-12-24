import { Link } from 'wouter';
import { featuredItems, upcomingEvents } from '../lib/data';


import { ButtonViolet3D, ButtonDarkSpec } from '../components/ui/v6-buttons';
import { CleanCard } from '../components/ui/v6-card';
import { Trophy, ExternalLink, Award } from 'lucide-react';

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

      {/* Recent Achievement Section */}
      <section className="mb-24">
        <div className="flex items-center gap-5 mb-12">
          <span className="w-12 h-12 rounded-full bg-[hsl(var(--accent))] text-[var(--bg-body)] text-xs flex items-center justify-center font-bold tracking-wider shadow-[0_0_20px_-5px_hsl(var(--accent))]">NEW</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">Recent Achievement</h2>
        </div>

        <CleanCard className="p-8 md:p-12 relative overflow-hidden group border-[hsl(var(--accent))]/40 shadow-[0_0_50px_-10px_hsl(var(--accent))]/10 hover:shadow-[0_0_50px_-10px_hsl(var(--accent))]/30 transition-all duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Trophy className="w-64 h-64 text-[hsl(var(--accent))]" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 border border-[hsl(var(--accent))] px-4 py-2 bg-[hsl(var(--accent))] rounded-full">
                <Award className="w-4 h-4 text-[var(--bg-body)]" />
                <span className="text-sm font-bold text-[var(--bg-body)] tracking-wide">3rd Place - National Event</span>
              </div>

              <h3 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[var(--text-primary)] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                  Urban Vision Hackathon 2025
                </span>
              </h3>

              <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                Team Aprameya secured 3rd place at the prestigious Urban Vision Hackathon organized by IISc Bengaluru.
                Developing advanced AI models for urban mobility, our team competed against top institutions across India
                to create solutions for real-world traffic challenges.
              </p>

              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-text-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))]"></span>
                    Winning Team
                  </h4>
                  <ul className="grid grid-cols-1 gap-2 text-[var(--text-secondary)]">
                    <li>Singavarapu Sai Revanth <span className="text-xs opacity-60">(Team Lead)</span></li>
                    <li>Akula Venkata Praveen <span className="text-xs opacity-60">(AI/ML Developer)</span></li>
                    <li>Atmakuri Komal Sai Raj <span className="text-xs opacity-60">(Researcher)</span></li>
                    <li>Kamsani Yashwanth Chowdary <span className="text-xs opacity-60">(Tester)</span></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[var(--text-text-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))]"></span>
                    Mentors
                  </h4>
                  <ul className="text-[var(--text-secondary)] space-y-1">
                    <li>Prof. Hari Kiran Vege <span className="text-xs opacity-60">(Additional Dean – Academics)</span></li>
                    <li>Mr. Srikanth Annamareddy <span className="text-xs opacity-60">(Professor of Practice)</span></li>
                  </ul>
                </div>
              </div>

              <a href="https://www.apnnews.com/klef-team-aprameya-among-top-winners-in-indias-premier-ai-hackathon/" target="_blank" rel="noopener noreferrer">
                <ButtonViolet3D className="px-6 py-3 text-sm inline-flex items-center gap-2">
                  Read Article <ExternalLink className="w-4 h-4" />
                </ButtonViolet3D>
              </a>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-2xl group-hover:shadow-[hsl(var(--accent))]/20 transition-all duration-500">
              <img
                src="/assets/UVH.jpg"
                alt="Team Aprameya at IISc Hackathon"
                className="w-full h-full object-cover aspect-video hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-xl w-full">
                  <p className="text-white font-bold text-lg">Urban Vision Hackathon 2025</p>
                  <p className="text-white/80 text-sm">IISc Bengaluru</p>
                </div>
              </div>
            </div>
          </div>
        </CleanCard>
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

      {/* Upcoming Events Section */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-6 h-6 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] flex items-center justify-center font-mono">02</span>
          <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest">Upcoming Events</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <CleanCard key={event.id} className="p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="flex items-start justify-between mb-6">
                <div className="text-center border border-[var(--border-color)] rounded-xl p-3 min-w-[70px] bg-[var(--bg-body)] group-hover:border-[hsl(var(--accent))] transition-colors shadow-sm">
                  <span className="block text-xs text-[var(--text-secondary)] uppercase font-bold tracking-wider mb-1">{event.month}</span>
                  <span className="block text-2xl font-bold text-[var(--text-primary)]">{event.day}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-[10px] font-bold uppercase tracking-wide">
                  Event
                </div>
              </div>
              <h3 className="font-bold text-lg mb-3 text-[var(--text-primary)] line-clamp-2 group-hover:text-[hsl(var(--accent))] transition-colors pr-4">{event.title}</h3>
              <div className="flex items-center text-sm text-[var(--text-secondary)] pt-4 border-t border-[var(--border-color)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] mr-2"></span>
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </CleanCard>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-6 h-6 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] flex items-center justify-center font-mono">03</span>
          <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest">System Telemetry</h2>
        </div>

        {/* Synced with About Page */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-color)] border border-[var(--border-color)] w-full">
          <div className="bg-[var(--card-bg)] p-6 md:p-8 hover:bg-[var(--bg-body)] transition-colors">
            <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">2019</div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">Founded</div>
          </div>
          <div className="bg-[var(--card-bg)] p-6 md:p-8 hover:bg-[var(--bg-body)] transition-colors">
            <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">50+</div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">Members</div>
          </div>
          <div className="bg-[var(--card-bg)] p-6 md:p-8 hover:bg-[var(--bg-body)] transition-colors">
            <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">15+</div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">Projects</div>
          </div>
          <div className="bg-[var(--card-bg)] p-6 md:p-8 hover:bg-[var(--bg-body)] transition-colors">
            <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">10+</div>
            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">Awards</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
