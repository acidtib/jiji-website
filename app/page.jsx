"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  FileCode,
  Globe,
  HardDrive,
  KeyRound,
  Lock,
  Network,
  RefreshCw,
  ScrollText,
  Server,
  Shield,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Set by CI at build time (see .github/workflows/deploy.yml) to the latest jiji release tag.
// Falls back to "dev" for local builds where the env var isn't set.
const JIJI_VERSION = process.env.NEXT_PUBLIC_JIJI_VERSION || "dev";

// Servers as racks, services as blades stacked inside them -- a small but real topology.
// Two "web" replicas on different providers both call "api"; "worker" processes the same
// queue; both talk to "postgres" and "redis" on a separate data server. Each blade gets its
// own address on the private container network, plus the .jiji DNS name other services
// actually reach it by -- both replicas of "web" share one aggregate name, distinct IPs.
const RACKS = [
  { name: "web1", provider: "AWS", ip: "10.210.0.1", blades: [
    { name: "web", ip: "10.210.0.5", dns: "myapp-web.jiji" },
  ] },
  { name: "web2", provider: "Hetzner", ip: "10.210.1.1", blades: [
    { name: "web", ip: "10.210.1.5", dns: "myapp-web.jiji" },
  ] },
  { name: "app1", provider: "DigitalOcean", ip: "10.210.2.1", blades: [
    { name: "api", ip: "10.210.2.5", dns: "myapp-api.jiji" },
    { name: "worker", ip: "10.210.2.6", dns: "myapp-worker.jiji" },
  ] },
  { name: "data1", provider: "Bare Metal", ip: "10.210.3.1", blades: [
    { name: "postgres", ip: "10.210.3.5", dns: "myapp-postgres.jiji" },
    { name: "redis", ip: "10.210.3.6", dns: "myapp-redis.jiji" },
  ] },
];

// [rackIndex, bladeIndex] -> [rackIndex, bladeIndex], the actual service calls -- rendered as
// bright, animated, directional lines between the specific blades, not server-to-server.
// Every blade still gets exactly one line -- api pairs with postgres (both the top blade in
// their rack), worker pairs with redis (both the bottom blade), so the two cross-rack lines
// run parallel instead of fanning out and crossing each other.
const MESH_TRAFFIC_EDGES = [
  [[0, 0], [2, 0]], // web1:web -> app1:api
  [[1, 0], [2, 0]], // web2:web -> app1:api
  [[2, 0], [3, 0]], // app1:api -> data1:postgres
  [[2, 1], [3, 1]], // app1:worker -> data1:redis
];

const MESH_EVENTS = [
  { source: "web1/web", action: "GET /health", target: "app1/api", result: "200 · 12ms" },
  { source: "web2/web", action: "GET /v1/jobs", target: "app1/api", result: "200 · 18ms" },
  { source: "app1/api", action: "SELECT", target: "data1/postgres", result: "ok · 4ms" },
  { source: "app1/worker", action: "BRPOP queue", target: "data1/redis", result: "ok · 2ms" },
];

// A curated subset of the ~60 features documented in full at
// /docs/reference/features -- what actually matters when deciding whether
// to use Jiji, not everything it does.
const HIGHLIGHT_FEATURES = [
  { icon: ShieldCheck, title: "Auto SSL/TLS", description: "Automatic HTTPS certificates via kamal-proxy. Zero config." },
  { icon: Activity, title: "Fail-Safe Health Checks", description: "A failed candidate is discarded; the previous version is never touched." },
  { icon: KeyRound, title: "Secrets Management", description: "Reference secrets from .env files securely. Never logged, never in a command string." },
  { icon: HardDrive, title: "Any Registry", description: "GHCR, Docker Hub, ECR, GCP Artifact Registry, or a zero-config local registry over SSH tunnel." },
  { icon: ScrollText, title: "Audit Trail", description: "Complete deployment history, timed and filterable, plus real-time log streaming." },
  { icon: Terminal, title: "Remote Execution", description: "Run commands across servers in parallel, or drop into an interactive shell." },
];

function Github({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function DirectionContract() {
  return (
    <span
      aria-hidden="true"
      style={{ display: "none" }}
      dangerouslySetInnerHTML={{
        __html:
          "<!--\n" +
          "THESIS: This isn't a themed metaphor, it's your servers as a dashboard -- real names, IPs, and status packed into a dense, no-wasted-pixel grid the moment the page loads, refusing both the neon-glow-devtool default and any borrowed narrative that translates \"servers\" into someone else's story.\n" +
          "OWN-WORLD: Near-black ground; off-white ink; one utility accent (brand green for status/CTAs, rust red reserved for failure); hairline-ruled dense modules edge to edge, small corner tag chips, sharp corners; Big Shoulders Display condensed-bold for headlines; Archivo for dense body/label copy; Courier Prime reserved for literal code/config content only.\n" +
          "STORY: A visitor's first five seconds show real servers, live-looking status, and the actual deploy mechanism (health-gated, fail-safe) inside a rigorous dense grid -- reading immediately as infrastructure tooling, not a themed metaphor.\n" +
          "FIRST VIEWPORT: Three-column dashboard -- left rail lists real servers with live status dots, center column holds the condensed-bold headline plus install command, right rail holds community/doc links; a four-tile stat strip below states WireGuard mesh, DNS, zero-downtime, and one-file config as plain facts.\n" +
          "FORM: Fused challenger, Japanese Contemporary High-Density Site (source: japanese-high-density-web), adapted to a dark ground per the locked dark-theme constraint; chosen over assigned direction Spec-Sheet Catalog after user re-roll eliminated the earlier ATC Flight Strips direction; seed keys 150ed428, 92b9d813.\n" +
          "-->",
      }}
    />
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark noise-overlay relative">
      <DirectionContract />

      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" aria-label="Jiji home">
            <Image
              src="/jiji_logo.svg"
              alt="Jiji"
              width={72}
              height={28}
              className="h-7 w-auto transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="flex items-center gap-1">
            <NavLink href="#why-jiji" className="hidden md:inline-flex">Why Jiji</NavLink>
            <NavLink href="#how-it-works" className="hidden md:inline-flex">How it works</NavLink>
            <NavLink href="/docs">
              Docs
            </NavLink>
            <div className="w-px h-4 bg-border mx-2 hidden sm:block" />
            <Link
              href="https://discord.gg/BMdKJzkknE"
              target="_blank"
              aria-label="Jiji Discord community"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <DiscordIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Discord</span>
            </Link>
            <Link
              href="https://github.com/acidtib/jiji"
              target="_blank"
              aria-label="Jiji on GitHub"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
            <Button asChild size="sm" className="ml-1 hidden sm:inline-flex rounded-sm">
              <Link href="/docs/getting-started/quick-start">
                Quick start
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Hero: the headline stands alone, the mesh visual carries the proof */}
        <section className="pt-14 pb-10 md:pt-20 md:pb-14">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
                <span className="tag-chip bg-primary/15 text-primary text-[11px] px-2 py-1">
                  {JIJI_VERSION}
                </span>
                <span className="tag-chip bg-muted text-muted-foreground text-[11px] px-2 py-1">
                  MIT
                </span>
                <span className="tag-chip bg-muted text-muted-foreground text-[11px] px-2 py-1">
                  OPEN SOURCE
                </span>
              </div>

              <h1 className="font-display font-bold uppercase text-5xl md:text-7xl lg:text-8xl leading-[0.88] tracking-tight mb-6 text-balance">
                Deploy containers anywhere.
              </h1>

              <p className="text-base md:text-xl text-muted-foreground leading-relaxed mb-7 max-w-2xl text-balance">
                Jiji deploys containerized apps across any Linux servers over SSH—with
                zero-downtime rollouts, automatic HTTPS, and a private WireGuard network
                built in. <span className="text-foreground">No agents. No hosted platform. No cluster to babysit.</span>
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-7">
                <Button asChild className="h-11 px-6 rounded-sm">
                  <Link href="/docs/getting-started/quick-start">
                    <Terminal className="mr-2 w-4 h-4" />
                    Deploy your first app
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-11 px-6 rounded-sm">
                  <Link href="https://github.com/acidtib/jiji" target="_blank">
                    <Github className="mr-2 w-4 h-4" />
                    Explore on GitHub
                    <ExternalLink className="ml-2 w-3 h-3 opacity-50" />
                  </Link>
                </Button>
              </div>

              <InstallCommand />

              <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-6 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> SSH access is enough</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> Docker or Podman</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" /> Runs from laptop or CI</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mesh network visual -- the proof, right under the claim */}
        <section className="pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <NetworkMesh />

            <h2 className="sr-only">Network mesh status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <StatTile icon={Shield} label="MESH" value="WireGuard" note="Encrypted by default" />
              <StatTile icon={Globe} label="DNS" value=".jiji" note="Resolve by name" />
              <StatTile icon={RefreshCw} label="DEPLOY" value="Zero-downtime" note="Health-gated rollout" />
              <StatTile icon={FileCode} label="CONFIG" value="1 file" note="One command" />
            </div>
          </div>
        </section>

        {/* What you get */}
        <section id="why-jiji" className="py-16 md:py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="01 / WHY JIJI"
              title="The production essentials, included"
              description="Keep the operational model you already understand—SSH, containers, and Linux—without assembling the deployment layer yourself."
            />

            <div className="grid md:grid-cols-3 gap-3">
              <BenefitModule
                icon={Server}
                title="Bring any server"
                description="Deploy to cloud VMs, bare metal, or a mix of providers. If you can reach it over SSH, Jiji can deploy to it."
              />
              <BenefitModule
                icon={Zap}
                title="Keep costs predictable"
                description="Pay your infrastructure provider directly. No per-request platform fee and no proprietary runtime between you and your app."
              />
              <BenefitModule
                icon={Lock}
                title="Private by default"
                description="WireGuard mesh VPN encrypts all traffic automatically. Your app never binds a host port directly, only kamal-proxy and WireGuard are exposed."
              />
            </div>
          </div>
        </section>

        {/* Config -> Output */}
        <section className="py-16 md:py-20 border-y border-border bg-card/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="02 / WORKFLOW"
              title="From config to healthy containers"
              description={
                <>
                  Describe the desired deployment once. Jiji builds, pushes, starts,
                  health-checks, and switches traffic with <code className="font-mono text-primary">jiji deploy</code>.
                </>
              }
            />

            <div className="grid lg:grid-cols-2 gap-3">
              <div className="module-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
                  <span className="tag-chip bg-muted text-muted-foreground text-[10px] px-2 py-0.5">CONFIG</span>
                  <span className="font-mono text-xs text-muted-foreground">.jiji/deploy.yml</span>
                </div>
                <pre className="p-5 text-sm overflow-x-auto leading-relaxed">
                  <code>
                    <Line><YamlKey>project</YamlKey>: <Val>myapp</Val></Line>
                    <Line />
                    <Line><YamlKey>servers</YamlKey>:</Line>
                    <Line>  <YamlKey>web1</YamlKey>:</Line>
                    <Line>    <YamlKey>host</YamlKey>: <Val>server1.example.com</Val></Line>
                    <Line>  <YamlKey>web2</YamlKey>:</Line>
                    <Line>    <YamlKey>host</YamlKey>: <Val>server2.example.com</Val></Line>
                    <Line />
                    <Line><YamlKey>services</YamlKey>:</Line>
                    <Line>  <YamlKey>api</YamlKey>:</Line>
                    <Line>    <YamlKey>build</YamlKey>:</Line>
                    <Line>      <YamlKey>context</YamlKey>: <Val>.</Val></Line>
                    <Line>    <YamlKey>servers</YamlKey>: <Val>[web1, web2]</Val></Line>
                    <Line>    <YamlKey>proxy</YamlKey>:</Line>
                    <Line>      <YamlKey>app_port</YamlKey>: <Val>3000</Val></Line>
                    <Line>      <YamlKey>host</YamlKey>: <Val>api.example.com</Val></Line>
                    <Line>      <YamlKey>ssl</YamlKey>: <Val>true</Val></Line>
                  </code>
                </pre>
              </div>

              <div className="module-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
                  <span className="tag-chip bg-primary/15 text-primary text-[10px] px-2 py-0.5">OUTPUT</span>
                  <span className="font-mono text-xs text-muted-foreground">live</span>
                </div>
                <pre className="p-5 text-sm overflow-x-auto leading-relaxed">
                  <TerminalLine prompt>jiji server setup</TerminalLine>
                  <TerminalLine>Initializing web1... <Success>done</Success></TerminalLine>
                  <TerminalLine>Initializing web2... <Success>done</Success></TerminalLine>
                  <TerminalLine />
                  <TerminalLine prompt>jiji deploy --build</TerminalLine>
                  <TerminalLine>Building api... <Success>done</Success></TerminalLine>
                  <TerminalLine>Pushing to registry... <Success>done</Success></TerminalLine>
                  <TerminalLine>Deploying to web1... <Success>healthy</Success></TerminalLine>
                  <TerminalLine>Deploying to web2... <Success>healthy</Success></TerminalLine>
                  <TerminalLine />
                  <TerminalLine><Success>&#10003;</Success> Deployed myapp-api to 2 servers</TerminalLine>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="03 / FIT"
              title="Choose the operating model you want"
              description="Jiji is deliberately a small deployment tool—not a hosted platform and not a self-managing cluster."
            />

            <div className="grid md:grid-cols-3 gap-3">
              <FitModule
                rank="01"
                title="Choose Jiji"
                description="You want repeatable production deploys on servers you control, without operating a control plane."
                points={["Imperative, SSH-driven deploys", "Multi-server networking", "Minimal moving parts"]}
              />
              <FitModule
                rank="02"
                title="Choose Compose"
                description="Your application lives on one host and you are comfortable handling deployments, routing, and recovery yourself."
                points={["Familiar Compose specification", "Excellent local workflow", "Single-host simplicity"]}
              />
              <FitModule
                rank="03"
                title="Choose a platform"
                description="You would rather outsource infrastructure operations and accept the platform’s pricing, runtime, and constraints."
                points={["Managed infrastructure", "Integrated web dashboard", "Less direct server ownership"]}
              />
            </div>
          </div>
        </section>

        {/* Highlights -- a handful of what matters, not all ~60 features at once */}
        <section className="py-16 md:py-20 border-y border-border bg-card/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="04 / CAPABILITIES"
              title="Built-in, not bolted on"
              description="The features that would otherwise take weeks to wire up yourself."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {HIGHLIGHT_FEATURES.map((feature) => (
                <BenefitModule key={feature.title} {...feature} />
              ))}
            </div>

            <Link
              href="/docs/reference/features"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Browse all ~60 features
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 md:py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="05 / ARCHITECTURE"
              title="A small, inspectable stack"
              description="No central scheduler or always-on Jiji service. The CLI computes the deployment and configures proven infrastructure components over SSH."
            />

            <div className="grid md:grid-cols-3 gap-3">
              <ArchModule
                rank="01"
                title="Jiji CLI"
                description="Runs on your machine. Reads config, connects via SSH, orchestrates everything."
                icon={Terminal}
              />
              <ArchModule
                rank="02"
                title="Network Stack"
                description="Per-project WireGuard mesh. Compiled .jiji DNS. Stable service VIPs."
                icon={Network}
              />
              <ArchModule
                rank="03"
                title="kamal-proxy"
                description="Shared HTTP/HTTPS routing across every project on a server, with SSL termination."
                icon={Globe}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 border-y border-border bg-card/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20">
            <SectionHeading
              kicker="06 / QUESTIONS"
              title="Know what you’re operating"
              description="Jiji keeps the system understandable, including where its responsibility ends."
            />
            <div className="divide-y divide-border border-y border-border">
              <FaqItem
                question="Does Jiji run a control plane on my servers?"
                answer="No. Jiji is a CLI that runs from your laptop or CI, computes the deployment, and pushes configuration to your servers over SSH. There is no Jiji daemon to keep alive."
              />
              <FaqItem
                question="What happens when a deployment fails?"
                answer="Candidates must pass their configured health checks before traffic switches. If a candidate fails, Jiji removes it and leaves the currently running version in place."
              />
              <FaqItem
                question="Can I use more than one cloud provider?"
                answer="Yes. Servers can live at different providers or on your own hardware. Jiji connects them with a per-project WireGuard network."
              />
              <FaqItem
                question="Is Jiji a managed platform?"
                answer="No. You own and pay for the servers, registry, and related services. Jiji automates deployment and networking while leaving the infrastructure under your control."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24">
          <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
            <span className="tag-chip bg-primary/15 text-primary text-[11px] px-2.5 py-1 mb-8 inline-block">
              07 / START
            </span>

            <div className="module-card overflow-hidden text-left max-w-md mx-auto mb-9">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
                <span className="tag-chip bg-primary/15 text-primary text-[10px] px-2 py-0.5">OUTPUT</span>
                <span className="font-mono text-xs text-muted-foreground">$ jiji deploy</span>
              </div>
              <pre className="p-5 text-sm overflow-x-auto leading-relaxed">
                <TerminalLine prompt>jiji deploy</TerminalLine>
                <TerminalLine>Deploying api to 2 servers...</TerminalLine>
                <TerminalLine>Deploying to web1... <Success>healthy</Success></TerminalLine>
                <TerminalLine>Deploying to web2... <Success>healthy</Success></TerminalLine>
                <TerminalLine />
                <TerminalLine><Success>&#10003;</Success> Deployed myapp-api to 2 servers</TerminalLine>
              </pre>
            </div>

            <h2 className="font-display font-bold uppercase text-3xl md:text-4xl tracking-tight mb-4">
              Your next deploy can be boring
            </h2>
            <p className="text-lg text-muted-foreground mb-9">
              Bring a Linux server and an SSH key. The quick start takes you from install to a healthy HTTPS deployment.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild className="h-11 px-7 rounded-sm">
                <Link href="/docs/getting-started/quick-start">
                  <Terminal className="mr-2 w-4 h-4" />
                  Quick Start
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-11 px-7 rounded-sm">
                <Link href="/docs">
                  <BookOpen className="mr-2 w-4 h-4" />
                  Documentation
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-11 px-7 rounded-sm">
                <Link href="https://github.com/acidtib/jiji" target="_blank">
                  <Github className="mr-2 w-4 h-4" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Image
                src="/jiji_logo.svg"
                alt="Jiji"
                width={56}
                height={22}
                className="h-5 w-auto opacity-70"
              />
              <span className="text-sm text-muted-foreground font-mono">
                open source container orchestration
              </span>
            </div>
            <div className="flex items-center gap-6">
              <FooterLink href="/docs">Docs</FooterLink>
              <FooterLink href="/docs/getting-started/quick-start">
                Quick Start
              </FooterLink>
              <Link
                href="https://discord.gg/BMdKJzkknE"
                target="_blank"
                aria-label="Jiji Discord community"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <DiscordIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com/acidtib/jiji"
                target="_blank"
                aria-label="Jiji on GitHub"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
            <Link href="https://github.com/acidtib/jiji/blob/main/LICENSE" target="_blank" className="font-mono hover:text-primary transition-colors">MIT License</Link>
            <span className="font-mono text-xs">
              Built in Colorado with love
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Components

function SectionHeading({ kicker, title, description }) {
  return (
    <div className="mb-8">
      <span className="tag-chip bg-primary/15 text-primary text-[11px] px-2.5 py-1 mb-4 inline-block">
        {kicker}
      </span>
      <h2 className="font-display font-bold uppercase text-2xl md:text-3xl tracking-tight mb-3">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl">{description}</p>
      )}
    </div>
  );
}

function NavLink({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}

function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const command = "curl -fsSL https://get.jiji.run/install.sh | sh";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="flex min-w-0 items-center gap-3 bg-background border border-border pl-4 pr-2 py-2.5 rounded-sm font-mono text-sm w-full hover:border-primary/40 transition-colors">
        <span className="text-primary">$</span>
        <code className="min-w-0 flex-1 truncate text-left text-xs sm:text-sm">{command}</code>
        <button
          onClick={handleCopy}
          className="p-2 rounded-sm text-muted-foreground hover:text-primary hover:bg-white/5 transition-all flex-shrink-0"
          title="Copy to clipboard"
          aria-label="Copy install command to clipboard"
        >
          {copyError
            ? <span className="text-held text-[10px] px-0.5 whitespace-nowrap">select &amp; copy</span>
            : copied
              ? <Check className="w-4 h-4 text-cleared" />
              : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <p className="mt-2.5 font-mono text-xs text-muted-foreground">
        <a href="https://get.jiji.run/install.sh" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary">
          view script -{'>'}
        </a>
        {" · "}source on{" "}
        <a href="https://github.com/acidtib/jiji" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary">
          GitHub
        </a>
      </p>
    </div>
  );
}

// Picks which edge of a rect a connector leaves from/arrives at, favoring whichever axis
// (horizontal or vertical) actually separates the two rects, so lines meet blade edges
// squarely instead of cutting across their labels at an angle.
// The point on `rect`'s boundary facing `otherRect` -- same rule for both ends of a line
// (whichever side faces the other rect), so callers don't need a from/to distinction.
function connectorPoint(rect, otherRect, containerRect) {
  const dx = (otherRect.left + otherRect.right) / 2 - (rect.left + rect.right) / 2;
  const dy = (otherRect.top + otherRect.bottom) / 2 - (rect.top + rect.bottom) / 2;
  const horizontal = Math.abs(dx) >= Math.abs(dy);
  if (horizontal) {
    const x = dx >= 0 ? rect.right : rect.left;
    return { x: x - containerRect.left, y: (rect.top + rect.bottom) / 2 - containerRect.top };
  }
  const y = dy >= 0 ? rect.bottom : rect.top;
  return { x: (rect.left + rect.right) / 2 - containerRect.left, y: y - containerRect.top };
}

function NetworkMesh() {
  const containerRef = useRef(null);
  const bladeRefs = useRef(new Map());
  const [traffic, setTraffic] = useState([]);
  const [activeEvent, setActiveEvent] = useState(0);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      setTraffic(
        MESH_TRAFFIC_EDGES.map(([from, to]) => {
          const fromEl = bladeRefs.current.get(`${from[0]}-${from[1]}`);
          const toEl = bladeRefs.current.get(`${to[0]}-${to[1]}`);
          if (!fromEl || !toEl) return null;
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          return {
            ...connectorPoint(fromRect, toRect, containerRect),
            to: connectorPoint(toRect, fromRect, containerRect),
          };
        }).filter(Boolean)
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEvent((current) => (current + 1) % MESH_EVENTS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="module-card overflow-hidden mesh-console">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <span className="tag-chip bg-primary/15 text-primary text-[10px] px-2 py-0.5">LIVE DEMO</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-primary">
            <span className="status-dot bg-primary animate-node-pulse" />
            MESH HEALTHY
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
          <span>4 hosts</span>
          <span className="text-border">/</span>
          <span>6 services</span>
          <span className="text-border">/</span>
          <span>4 active routes</span>
        </div>
      </div>

      <div ref={containerRef} className="relative px-4 md:px-10 py-10 md:py-14 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Pixel coordinates measured from real DOM rects (see the effect above), not guessed
            percentages -- holds up regardless of how many blades a rack ends up with. Only the
            services that actually call each other get a line -- not a full server-to-server mesh,
            which just looked like noise. */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {traffic.map((edge, i) => (
            <g key={`traffic-${i}`}>
              <line
                x1={edge.x}
                y1={edge.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke="hsl(var(--primary) / 0.55)"
                strokeWidth="1.25"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                className={`animate-line-draw delay-${(i + 1) * 100}`}
              />
              <line
                x1={edge.x}
                y1={edge.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="3 21"
                className="animate-flow-dash"
                style={{ animationDelay: `${1 + i * 0.3}s` }}
              />
              <circle r="2.5" fill="hsl(var(--primary))" className="mesh-packet">
                <animate
                  attributeName="cx"
                  values={`${edge.x};${edge.to.x}`}
                  dur={`${1.7 + i * 0.15}s`}
                  begin={`${i * 0.32}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${edge.y};${edge.to.y}`}
                  dur={`${1.7 + i * 0.15}s`}
                  begin={`${i * 0.32}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur={`${1.7 + i * 0.15}s`}
                  begin={`${i * 0.32}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </svg>

        <div className="relative grid grid-cols-2 gap-4 md:gap-16">
          {RACKS.map((rack, rackIndex) => (
            <Rack
              key={rack.name}
              rack={rack}
              bladeRef={(bladeIndex, el) => bladeRefs.current.set(`${rackIndex}-${bladeIndex}`, el)}
            />
          ))}
        </div>

        <div className="relative mt-8 md:mt-10 border border-border bg-background/90">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Recent mesh activity
            </span>
            <span className="font-mono text-[9px] text-primary">streaming</span>
          </div>
          <div className="divide-y divide-border/60">
            {MESH_EVENTS.map((event, index) => (
              <div
                key={`${event.source}-${event.target}`}
                className={`grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 px-3 py-2 font-mono text-[9px] md:text-[10px] transition-colors duration-300 ${
                  activeEvent === index ? "bg-primary/10 text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="truncate">{event.source}</span>
                <span className="hidden sm:block text-primary/80">{event.action}</span>
                <span className="hidden sm:block truncate">&rarr; {event.target}</span>
                <span className={activeEvent === index ? "text-primary" : ""}>{event.result}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// A server as a rack: a bordered card with a header (name/provider/ip) and its services
// stacked inside as blades, the way a physical server holds blade units. Each blade shows
// its own private address and the .jiji name other services actually reach it by.
function Rack({ rack, bladeRef }) {
  return (
    <div className="relative border border-border bg-background/70 transition-colors duration-300 hover:border-primary/40">
      <div className="px-2.5 md:px-3 py-2 border-b border-border bg-muted/40">
        <div className="flex items-center justify-between gap-2">
          <div className="font-mono text-[11px] md:text-xs font-bold text-foreground">{rack.name}</div>
          <span className="font-mono text-[8px] uppercase tracking-wide text-primary">connected</span>
        </div>
        <div className="font-mono text-[9px] text-muted-foreground whitespace-nowrap">
          {rack.provider} &middot; wg0 {rack.ip}
        </div>
      </div>
      <div>
        {rack.blades.map((blade, bladeIndex) => (
          <div
            key={blade.name}
            ref={(el) => bladeRef(bladeIndex, el)}
            className="group flex items-start gap-2 px-2.5 md:px-3 py-2 border-t border-border first:border-t-0 transition-colors duration-300 hover:bg-primary/5"
          >
            <span className="status-dot bg-cleared animate-node-pulse flex-shrink-0 mt-1.5" />
            <div className="min-w-0">
              <div className="font-mono text-[10px] md:text-[11px] font-bold text-foreground">
                {blade.name} <span className="text-[8px] font-normal text-primary">healthy</span>
              </div>
              <div className="font-mono text-[9px] text-primary whitespace-nowrap truncate">
                {blade.dns}
              </div>
              <div className="font-mono text-[9px] text-muted-foreground whitespace-nowrap">
                {blade.ip}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, note }) {
  return (
    <div className="module-card px-4 py-3.5">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 text-primary" />
        <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground">{label}</span>
      </div>
      <div className="font-display font-bold uppercase text-lg leading-none mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{note}</div>
    </div>
  );
}

function BenefitModule({ icon: Icon, title, description }) {
  return (
    <div className="module-card p-6">
      <div className="w-10 h-10 rounded-sm bg-primary/15 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-display font-bold uppercase text-lg tracking-tight mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function FitModule({ rank, title, description, points }) {
  return (
    <div className="module-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="tag-chip bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5">{rank}</span>
        <h3 className="font-mono text-xs font-bold tracking-wide">{title.toUpperCase()}</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground mb-5">{description}</p>
      <div className="space-y-2.5">
        {points.map((point) => (
          <div key={point} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqItem({ question, answer }) {
  return (
    <details className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold uppercase tracking-tight marker:content-none">
        {question}
        <span className="font-mono text-xl font-normal text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
      </summary>
      <p className="pt-3 pr-10 text-sm leading-relaxed text-muted-foreground">{answer}</p>
    </details>
  );
}

function ArchModule({ rank, title, description, icon: Icon }) {
  return (
    <div className="module-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="w-11 h-11 rounded-sm bg-primary/15 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="tag-chip bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5">{rank}</span>
      </div>
      <h3 className="font-display font-bold uppercase text-lg tracking-tight mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </div>
  );
}

// Code syntax highlighting components
function Line({ children }) {
  return <div className="min-h-[1.5em]">{children}</div>;
}

function YamlKey({ children }) {
  return <span className="text-primary/90">{children}</span>;
}

function Val({ children }) {
  return <span className="text-foreground/80">{children}</span>;
}

function TerminalLine({ children, prompt }) {
  return (
    <div className="min-h-[1.5em]">
      {prompt && <span className="text-primary">$ </span>}
      {children}
    </div>
  );
}

function Success({ children }) {
  return <span className="text-cleared">{children}</span>;
}

function DiscordIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
