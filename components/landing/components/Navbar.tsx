import React, { useState } from 'react';
import { Terminal, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { GithubIcon } from './icons';

const JIJI_VERSION = process.env.NEXT_PUBLIC_JIJI_VERSION || 'v0.dev';

interface NavbarProps {
  onShowToast: (msg: string) => void;
}

const DiscordIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  onShowToast
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#070907]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <img
              src="/jiji_logo.svg"
              alt="JIJI Logo"
              className="h-8 w-auto object-contain transition group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </a>
          <a
            href="https://github.com/acidtib/jiji/releases/latest"
            target="_blank"
            rel="noreferrer"
            title="Latest release"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-semibold bg-zinc-900 text-lime-400 border border-lime-500/30 shadow-sm shadow-lime-500/10 hover:border-lime-500/60 transition cursor-pointer"
          >
            <span>{JIJI_VERSION}</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider font-semibold text-zinc-400">
          <button
            onClick={() => scrollToSection('why-jiji')}
            className="hover:text-lime-400 transition cursor-pointer"
          >
            WHY JIJI
          </button>
          <button
            onClick={() => scrollToSection('topology')}
            className="hover:text-lime-400 transition cursor-pointer"
          >
            ARCHITECTURE
          </button>
          <button
            onClick={() => scrollToSection('ecosystem')}
            className="hover:text-lime-400 transition cursor-pointer"
          >
            WHERE IT FITS
          </button>
          <button
            onClick={() => scrollToSection('tools')}
            className="hover:text-lime-400 transition cursor-pointer"
          >
            TOOLS
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="hover:text-lime-400 transition cursor-pointer"
          >
            FAQ
          </button>
          <a
            href="/docs"
            className="hover:text-lime-400 transition cursor-pointer"
          >
            DOCS
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a
            href="https://discord.gg/BMdKJzkknE"
            target="_blank"
            rel="noreferrer"
            title="Discord Community"
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <DiscordIcon className="w-4 h-4" />
            <span>Discord</span>
          </a>
          <a
            href="https://github.com/acidtib/jiji"
            target="_blank"
            rel="noreferrer"
            title="GitHub Repository"
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-400 hover:text-white p-2 rounded bg-zinc-900 border border-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#0a0d0a] px-4 py-4 space-y-3 font-mono text-xs">
          <button
            onClick={() => scrollToSection('why-jiji')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-lime-400"
          >
            WHY JIJI
          </button>
          <button
            onClick={() => scrollToSection('topology')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-lime-400"
          >
            ARCHITECTURE & TOPOLOGY
          </button>
          <button
            onClick={() => scrollToSection('ecosystem')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-lime-400"
          >
            WHERE JIJI FITS
          </button>
          <button
            onClick={() => scrollToSection('tools')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-lime-400"
          >
            PRODUCTION TOOLS
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="block w-full text-left py-2 text-zinc-300 hover:text-lime-400"
          >
            FREQUENTLY ASKED QUESTIONS
          </button>
          <a
            href="/docs"
            className="block w-full text-left py-2 text-zinc-300 hover:text-lime-400"
          >
            DOCUMENTATION
          </a>
        </div>
      )}
    </header>
  );
};
