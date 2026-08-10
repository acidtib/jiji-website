import React from 'react';
import Link from 'next/link';
import { ArrowRight, Copy, Check, Terminal } from 'lucide-react';
import { GithubIcon } from './icons';

interface HeroProps {
  onShowToast: (msg: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShowToast }) => {
  const [copied, setCopied] = React.useState(false);
  const installCmd = "curl -fsSL https://get.jiji.run/install.sh | sh";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    onShowToast("Copied CLI install command to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-20 sm:pt-28 md:pt-36 pb-20 sm:pb-28 md:pb-36 overflow-hidden bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="font-heading uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-snug sm:leading-tight mb-5">
          Your apps. Your infrastructure.
          <br />
          <span className="text-lime-400 font-extrabold">
            Anywhere.
          </span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl mx-auto font-sans leading-[1.8] mb-8">
          Jiji makes it simple to deploy and run applications across the machines you control. Cloud, bare metal, or your own hardware. Docker or Podman. One workflow to deploy, connect, and manage your apps without locking your infrastructure to a platform.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            href="/docs/getting-started/quick-start"
            className="w-full sm:w-auto bg-lime-400 hover:bg-lime-300 text-zinc-950 font-mono text-sm font-bold px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 transition green-glow cursor-pointer active:scale-95"
          >
            <span>Deploy your first app</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="https://github.com/acidtib/jiji"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 hover:border-zinc-700 font-mono text-sm font-semibold px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <GithubIcon className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>

        {/* Installation Bar */}
        <div className="max-w-xl mx-auto bg-zinc-950/90 border border-zinc-800 rounded-xl p-3 sm:p-4 font-mono text-xs text-left shadow-2xl flex items-center justify-between gap-3 green-border-glow">
          <div className="flex items-center gap-3 overflow-x-auto text-lime-400 py-1">
            <Terminal className="w-4 h-4 text-zinc-500 shrink-0" />
            <span className="text-zinc-500 font-bold select-none">$</span>
            <code className="text-zinc-100 font-semibold whitespace-nowrap">{installCmd}</code>
          </div>
          <button
            onClick={handleCopy}
            className="hidden sm:flex bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-2 rounded border border-zinc-800 items-center justify-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500">
          <a
            href="https://get.jiji.run/install.sh"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted underline-offset-4 hover:text-lime-400 transition"
          >
            view script
          </a>
        </div>
      </div>
    </section>
  );
};
