import React, { useState } from 'react';
import { ChevronDown, Code, Terminal, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/content';
import { FaqItem } from '../types';

export const FaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  const categories = ['All', 'Architecture', 'Rollbacks', 'Infrastructure', 'Registries', 'Open Source'];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    return activeCategory === 'All' || item.category === activeCategory;
  });

  return (
    <section id="faq" className="py-20 bg-[#060806] border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest mb-2">
            // FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-white tracking-tight">
            WHAT TEAMS ASK <span className="text-lime-400">BEFORE DEPLOYING</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 font-sans">
            Deep dive into architecture, rollbacks, registries, and multi-server setup.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-lime-400 text-black font-bold border-lime-400'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 font-mono text-sm">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 bg-zinc-900/40 rounded-xl border border-zinc-800">
              No matching questions found in this category.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-[#0a0d0a] border-lime-500/50 green-border-glow'
                      : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <HelpCircle className={`w-4 h-4 shrink-0 ${isOpen ? 'text-lime-400' : 'text-zinc-500'}`} />
                      <span className={`font-bold text-sm sm:text-base ${isOpen ? 'text-lime-300' : 'text-white'}`}>
                        {faq.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block text-[10px] text-zinc-500 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                        {faq.category}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-lime-400' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm font-sans text-zinc-300 space-y-3 border-t border-zinc-800/60 leading-relaxed animate-in fade-in duration-150">
                      <p>{faq.answer}</p>

                      {faq.codeSnippet && (
                        <div className="mt-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-lime-300 overflow-x-auto">
                          <div className="text-[10px] text-zinc-500 mb-1 font-bold">EXAMPLE SNIPPET:</div>
                          <pre>{faq.codeSnippet}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
