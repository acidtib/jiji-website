import React from 'react';
import Link from 'next/link';
import { GitBranch, Network, Key, Database, Activity, Layers, Terminal, Code2 } from 'lucide-react';
import { DEEP_DIVE_FEATURES } from '../data/content';

export const FeatureGrid: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-lime-400" />;
      case 'Network':
        return <Network className="w-5 h-5 text-lime-400" />;
      case 'Key':
        return <Key className="w-5 h-5 text-lime-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-lime-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-lime-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-lime-400" />;
      default:
        return <GitBranch className="w-5 h-5 text-lime-400" />;
    }
  };

  const sampleYamlConfig = `project: myapp

servers:
  web1:
    host: server1.example.com
  web2:
    host: server2.example.com

services:
  api:
    build:
      context: .
    servers: [web1, web2]
    proxy:
      port: 3000
      hosts: [api.example.com]
      ssl: true`;

  const sampleRolloutOutput = `$ jiji deploy --build             PRODUCTION

01 Build image myapp-api:8f31c2a         8.4s ✓
02 Push image registry.example.com/myapp  3.1s ✓
03 Start candidates ROLLOUT ACROSS 2 SERVERS  1.7s ✓

HEALTH-GATED ROLLOUT                   2 / 2 healthy
  web1                     HEALTHY
  server1.example.com
  traffic switched         542ms      916ms

  web2                     HEALTHY
  server2.example.com
  traffic switched         542ms      916ms

✓ myapp-api deployed successfully         14.9s
  2 servers · zero failed · previous containers removed`;

  return (
    <section id="tools" className="py-20 bg-[#060806] border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 5: From Config to Healthy Containers */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest mb-2">
            // SIMPLE CONFIGURATION
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-white tracking-tight">
            FROM CONFIG TO <span className="text-lime-400">HEALTHY CONTAINERS</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-300 font-sans">
            Describe your deployment once. Jiji handles the rollout from image to healthy traffic across your servers.
          </p>
        </div>

        {/* Side-by-Side Config & Terminal Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20 font-mono text-xs">
          {/* Left: YAML Config */}
          <div className="lg:col-span-5 bg-[#0a0d0a] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-zinc-400">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-lime-400" />
                <span className="font-bold text-white">CONFIG: .jiji/deploy.yml</span>
              </div>
              <span className="text-[10px] text-zinc-500">YAML</span>
            </div>
            <pre className="p-4 text-zinc-300 leading-relaxed overflow-x-auto text-[11px]">
              {sampleYamlConfig}
            </pre>
          </div>

          {/* Right: Rollout Command Output */}
          <div className="lg:col-span-7 bg-[#070a07] border border-zinc-800 rounded-xl overflow-hidden shadow-xl green-border-glow">
            <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-lime-400" />
                <span className="font-bold text-white">OUTPUT: DEPLOY COMPLETE</span>
              </div>
              <span className="text-[10px] bg-lime-950 text-lime-400 border border-lime-800 px-2 py-0.5 rounded font-bold">HEALTHY</span>
            </div>
            <pre className="p-4 text-lime-300 leading-relaxed overflow-x-auto text-[11px]">
              {sampleRolloutOutput}
            </pre>
          </div>
        </div>

        {/* Section 6: Production Tools Ready to Use */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest mb-2">
            // TOOLING SURFACE
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-white tracking-tight">
            PRODUCTION TOOLS, <span className="text-lime-400">READY TO USE</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-300 font-sans">
            Deploy and operate applications across your servers from one CLI, with networking, HTTPS, health checks, logs, and scheduled jobs built in.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEEP_DIVE_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="group bg-[#0a0d0a] border border-zinc-800 hover:border-lime-500/50 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-lime-950/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-lime-950/40 group-hover:border-lime-500/40 transition">
                    {getIcon(feature.iconName)}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-zinc-900 text-lime-400 border border-zinc-800">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="font-mono text-base font-bold text-white mb-2 uppercase group-hover:text-lime-300 transition">
                  {feature.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div>
            <div className="text-white font-bold text-sm mb-1 uppercase">
              THERE IS MORE UNDER THE HOOD
            </div>
            <div className="text-zinc-400 font-sans">
              Explore networking, scheduled jobs, encrypted network backups, logs, and the complete CLI command surface.
            </div>
          </div>
          <Link
            href="/docs/reference/features"
            className="bg-lime-400 hover:bg-lime-300 text-black font-bold px-5 py-2.5 rounded transition shrink-0 cursor-pointer"
          >
            Browse all features
          </Link>
        </div>
      </div>
    </section>
  );
};
