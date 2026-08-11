import Link from 'next/link'

export function SiteFooterContent() {
  return (
    <div className="w-full bg-[#050705] border-t border-zinc-800/80 pt-16 pb-12 font-mono text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/jiji_logo.svg"
                alt="JIJI Logo"
                className="h-7 w-auto object-contain"
              />
              <span className="font-extrabold tracking-widest text-xl text-white">JIJI</span>
            </div>

            <p className="text-zinc-400 font-sans text-xs leading-relaxed max-w-sm">
              Deploy your apps across the Linux servers you control, with health-gated rollouts, automatic HTTPS, and private networking built in.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-lime-400">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
              <span>Open Source & MIT Licensed</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-xs">
              Get started
            </div>
            <ul className="space-y-2 text-zinc-400 font-sans text-xs">
              <li>
                <Link href="/docs/getting-started/quick-start" className="hover:text-lime-400 transition cursor-pointer">
                  Quick Start
                </Link>
              </li>
              <li>
                <a href="/docs/getting-started/installation" className="hover:text-lime-400 transition">
                  Installation
                </a>
              </li>
              <li>
                <a href="/docs/guides/deployment" className="hover:text-lime-400 transition">
                  Deployment
                </a>
              </li>
              <li>
                <a href="/docs/guides/ci-cd" className="hover:text-lime-400 transition">
                  CI/CD
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-xs">
              Reference
            </div>
            <ul className="space-y-2 text-zinc-400 font-sans text-xs">
              <li><a href="/docs/reference/configuration" className="hover:text-lime-400 transition">Configuration</a></li>
              <li><a href="/docs/reference/commands" className="hover:text-lime-400 transition">Commands</a></li>
              <li><a href="/docs/reference/network" className="hover:text-lime-400 transition">Networking</a></li>
              <li><a href="/docs/reference/features" className="hover:text-lime-400 transition">All features</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-xs">
              Project
            </div>
            <ul className="space-y-2 text-zinc-400 font-sans text-xs">
              <li>
                <a href="https://github.com/acidtib/jiji/releases" target="_blank" rel="noreferrer" className="hover:text-lime-400 transition">
                  Releases
                </a>
              </li>
              <li>
                <a href="https://discord.gg/BMdKJzkknE" target="_blank" rel="noreferrer" className="hover:text-lime-400 transition">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            Built in Colorado with Love
          </div>
          <div className="flex items-center gap-4">
            <a href="/llms.txt" className="text-lime-400 font-bold hover:underline">
              llms.txt
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
