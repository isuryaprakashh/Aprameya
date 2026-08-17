import { teamMembers } from '../lib/data';

const OperativeRoster = () => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                    <div
                        key={member.id}
                        className="rounded-xl border border-emerald-500/15 bg-[#0B130E] overflow-hidden hover:border-emerald-400/35 hover:bg-[#0E1A13] transition-all duration-300 shadow-lg shadow-black/20 group flex flex-col"
                    >
                        <div className="relative h-64 overflow-hidden bg-black">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B130E] via-transparent to-transparent pointer-events-none" />
                            <span className="absolute top-3 left-3 text-[10px] font-sans font-semibold uppercase tracking-wider text-emerald-400 bg-black/80 backdrop-blur-md border border-emerald-500/20 px-2 py-0.5 rounded">
                                {member.year}
                            </span>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-display font-bold text-base text-white mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-xs text-emerald-400 font-mono mb-3">
                                    {member.role}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-emerald-500/10 text-[11px] text-[#94A3B8]">
                                <span>{member.department}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OperativeRoster;