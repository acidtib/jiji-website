import React from 'react';
import { Server, DollarSign, ShieldCheck } from 'lucide-react';
import { TOP_FEATURE_CARDS } from '../data/content';

export const ServerRolloutSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server':
        return <Server className="w-5 h-5 text-lime-400" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-lime-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-lime-400" />;
      default:
        return <Server className="w-5 h-5 text-lime-400" />;
    }
  };

  return (
    <section id="why-jiji" className="py-20 bg-[#070907] border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <div className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest mb-2">
            // WHY JIJI
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold uppercase text-white tracking-tight leading-tight">
            DEPLOY ON YOUR SERVERS. <br className="hidden sm:inline" />
            <span className="text-lime-400">ROLL OUT SAFELY.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
            Turn the Linux servers you already control into one repeatable deployment target, with health-gated rollouts, automatic HTTPS, private networking, and service discovery built in.
          </p>
        </div>

        {/* 3 Green-Bordered Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOP_FEATURE_CARDS.map((card) => (
            <div
              key={card.id}
              className="group relative bg-[#0a0d0a] border border-zinc-800 hover:border-lime-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-lime-950/30"
            >
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-lime-500/50 group-hover:bg-lime-950/30 transition">
                  {getIcon(card.iconName)}
                </div>
                {card.badge && (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-zinc-900 text-lime-400 border border-zinc-800 tracking-wider">
                    {card.badge}
                  </span>
                )}
              </div>

              {/* Card Title */}
              <h3 className="font-mono text-base font-bold text-white mb-2 uppercase group-hover:text-lime-300 transition">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

