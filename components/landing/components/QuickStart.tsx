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
        <div className="bg-[#0a0d0a] border border-zinc-800 rounded-2xl p-6 sm:p-10 md:p-14 font-mono shadow-2xl green-border-glow text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-white tracking-tight leading-tight mb-4">
              YOUR NEXT DEPLOY <br className="hidden sm:inline" />
              <span className="text-lime-400">CAN BE BORING.</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed mb-8">
              Go from a fresh Linux server to a healthy HTTPS deployment with one configuration file and a repeatable, health-gated rollout.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
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
          </div>
        </div>
      </div>
    </section>
  );
};
