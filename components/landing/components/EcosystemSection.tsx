import React from 'react';
import { Layers, Zap, Server, Check } from 'lucide-react';

export const EcosystemSection: React.FC = () => {
  return (
    <section id="ecosystem" className="py-20 bg-[#070907] border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest mb-2">
            // ORCHESTRATION ARCHETYPES
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold uppercase text-white tracking-tight">
            WHERE <span className="text-lime-400">JIJI FITS</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-300 font-sans">
            Match your deployment approach to the size of your application, infrastructure, and operations team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Card 1: Docker Compose */}
          <div className="bg-[#0a0d0a] border border-zinc-800 rounded-xl p-6 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  SINGLE NODE
                </span>
                <span className="text-zinc-500">DOCKER COMPOSE</span>
              </div>
              <h3 className="text-base font-bold text-white mb-3 uppercase">
                DOCKER COMPOSE
              </h3>
              <p className="text-zinc-400 font-sans text-xs sm:text-sm leading-relaxed mb-6">
                Great for single-server setups, but it does not provide Jiji's multi-server coordination, health-gated rollout workflow, or built-in private mesh networking.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-zinc-800 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2"><span>✗</span> <span>Designed around a single Docker host</span></div>
              <div className="flex items-center gap-2"><span>✗</span> <span>No built-in health-gated rollout workflow</span></div>
            </div>
          </div>

          {/* Card 2: JIJI (Highlighted Sweet Spot) */}
          <div className="bg-[#0c120c] border-2 border-lime-500/80 rounded-xl p-6 transition flex flex-col justify-between relative shadow-xl shadow-lime-950/40 green-border-glow">
            <div className="absolute -top-3 right-6 bg-lime-400 text-black text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
              THE SWEET SPOT
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-lime-950 text-lime-400 border border-lime-800">
                  SMALL TO MEDIUM FLEETS
                </span>
                <span className="text-lime-400 font-bold">JIJI CLI</span>
              </div>
              <h3 className="text-base font-bold text-white mb-3 uppercase flex items-center gap-2">
                <span>JIJI ORCHESTRATOR</span>
                <Zap className="w-4 h-4 text-lime-400" />
              </h3>
              <p className="text-zinc-200 font-sans text-xs sm:text-sm leading-relaxed mb-6">
                Multi-server coordination, private networking, and health-gated routing without standing up a separate control-plane cluster.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-lime-900/60 text-[11px] text-lime-300">
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lime-400" /> <span>Private networking between every server</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lime-400" /> <span>Health-gated rollouts</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lime-400" /> <span>No PaaS to pay for</span></div>
            </div>
          </div>

          {/* Card 3: Kubernetes */}
          <div className="bg-[#0a0d0a] border border-zinc-800 rounded-xl p-6 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  FULL ORCHESTRATION
                </span>
                <span className="text-zinc-500">K8S</span>
              </div>
              <h3 className="text-base font-bold text-white mb-3 uppercase">
                KUBERNETES
              </h3>
              <p className="text-zinc-400 font-sans text-xs sm:text-sm leading-relaxed mb-6">
                Powerful and flexible, but it brings substantially more infrastructure, operational machinery, and a steeper learning curve.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-zinc-800 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2"><span>!</span> <span>More operational complexity</span></div>
              <div className="flex items-center gap-2"><span>!</span> <span>More infrastructure to manage</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
