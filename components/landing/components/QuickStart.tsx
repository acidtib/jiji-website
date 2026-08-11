import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Copy, Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './icons';

interface QuickStartSectionProps {
  onShowToast?: (msg: string) => void;
}

export const QuickStart: React.FC<QuickStartSectionProps> = ({ onShowToast }) => {
  const [copied, setCopied] = useState(false);
  const cmd = "curl -fsSL https://get.jiji.run/install.sh | sh";

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    if (onShowToast) onShowToast("Copied CLI install command!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quickstart" className="py-20 bg-[#070907] border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0a0d0a] border border-zinc-800 rounded-2xl p-6 sm:p-10 font-mono shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 green-border-glow">
          {/* Left Hero Callout */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest mb-3">
                // READY WHEN YOU ARE
              </div>
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-white tracking-tight leading-tight mb-4">
                YOUR NEXT DEPLOY <br className="hidden sm:inline" />
                <span className="text-lime-400">CAN BE BORING.</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed mb-8">
                Go from a fresh Linux server to a healthy HTTPS deployment with one configuration file and a repeatable, health-gated rollout.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/docs/getting-started/quick-start"
                  className="bg-lime-400 hover:bg-lime-300 text-black font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer text-xs"
                >
                  <span>Start the quick guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://github.com/acidtib/jiji"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition text-xs font-bold"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>View source on GitHub</span>
                </a>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60">
              </div>
            </div>
          </div>

          {/* Right 3 Steps Box */}
          <div className="lg:col-span-6 bg-zinc-950 p-6 rounded-xl border border-zinc-800/90 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs text-lime-400 font-bold uppercase tracking-wider">
                PATH TO PRODUCTION: 3 STEPS
              </span>
              <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">CLI WORKFLOW</span>
            </div>

            <div className="space-y-5 text-xs">
              {/* Step 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">01 INSTALL THE CLI</span>
                  <span className="text-zinc-500 text-[10px]">One binary on machine or CI</span>
                </div>
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between text-lime-300 font-mono text-[11px]">
                  <code>$ {cmd}</code>
                  <button onClick={handleCopy} className="text-zinc-400 hover:text-white transition">
                    {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">02 DESCRIBE YOUR APP</span>
                  <span className="text-zinc-500 text-[10px]">.jiji/deploy.yml</span>
                </div>
                <p className="text-zinc-400 font-sans text-xs">
                  Add servers, services, domain hosts, and health probe paths.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">03 SHIP IT</span>
                  <span className="text-zinc-500 text-[10px]">Health-gated rollout</span>
                </div>
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-lime-400 font-mono text-[11px]">
                  $ jiji deploy
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Ready for documentation?</span>
              <Link href="/docs" className="text-lime-400 hover:underline cursor-pointer font-bold">
                Browse all documentation →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
