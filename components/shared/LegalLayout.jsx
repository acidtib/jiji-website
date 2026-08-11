import Link from 'next/link'
import { SiteFooterContent } from './SiteFooterContent'

export function LegalLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#070907] text-zinc-100 flex flex-col font-sans">
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#070907]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/jiji_logo.svg"
              alt="JIJI Logo"
              className="h-8 w-auto object-contain transition group-hover:scale-105"
            />
          </Link>
          <Link
            href="/"
            className="text-xs font-mono font-semibold text-zinc-400 hover:text-lime-400 transition"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="legal-content">
            {children}
          </div>
        </div>
      </main>

      <SiteFooterContent />
    </div>
  )
}
