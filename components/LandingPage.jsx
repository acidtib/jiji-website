"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Box,
  Check,
  CheckCircle2,
  Clock3,
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
  { name: "web1", provider: "AWS", ip: "198.18.17.27", blades: [
    { name: "web", ip: "100.81.208.4", dns: "myapp-web.jiji" },
  ] },
  { name: "web2", provider: "Hetzner", ip: "198.18.17.28", blades: [
    { name: "web", ip: "100.81.216.4", dns: "myapp-web.jiji" },
  ] },
  { name: "app1", provider: "DigitalOcean", ip: "198.18.17.25", blades: [
    { name: "api", ip: "100.81.192.4", dns: "myapp-api.jiji" },
    { name: "worker", ip: "100.81.192.5", dns: "myapp-worker.jiji" },
  ] },
  { name: "data1", provider: "Bare Metal", ip: "198.18.17.26", blades: [
    { name: "postgres", ip: "100.81.200.4", dns: "myapp-postgres.jiji" },
    { name: "redis", ip: "100.81.200.5", dns: "myapp-redis.jiji" },
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
  { icon: ShieldCheck, category: "INGRESS", title: "Auto SSL/TLS", description: "Issue and renew HTTPS certificates automatically through jiji-proxy." },
  { icon: Activity, category: "ROLLOUT", title: "Fail-safe health checks", description: "Discard failed candidates while the healthy version keeps serving traffic." },
  { icon: KeyRound, category: "SECURITY", title: "Secrets management", description: "Load secrets from environment files without logging them or placing them in command strings." },
  { icon: HardDrive, category: "IMAGES", title: "Any registry", description: "Use standard OCI registries or tunnel a local registry over SSH." },
  { icon: ScrollText, category: "VISIBILITY", title: "Audit trail", description: "Inspect timed deployment history and stream application logs in real time." },
  { icon: Clock3, category: "AUTOMATION", title: "Scheduled jobs", description: "Run service commands on a cron schedule in isolated containers with durable status and logs." },
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
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center" aria-label="Jiji home">
              <Image
                src="/jiji_logo.svg"
                alt="Jiji"
                width={981}
                height={295}
                className="h-7 w-auto transition-opacity group-hover:opacity-80"
              />
            </Link>
            <span className="border-l border-border pl-2 font-mono text-[8px] uppercase tracking-wider text-muted-foreground sm:pl-3 sm:text-[9px]">
              {JIJI_VERSION}
            </span>
          </div>

          <div className="flex items-center gap-0.5">
            <NavLink href="#why-jiji" className="hidden lg:inline-flex">Why Jiji</NavLink>
            <NavLink href="#how-it-works" className="hidden lg:inline-flex">Architecture</NavLink>
            <NavLink href="/docs">Docs</NavLink>
            <div className="mx-2 hidden h-4 w-px bg-border sm:block" />
            <Link
              href="https://discord.gg/BMdKJzkknE"
              target="_blank"
              aria-label="Jiji Discord community"
              className="hidden items-center gap-2 px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:text-primary md:flex"
            >
              <DiscordIcon className="h-4 w-4" />
              <span className="hidden xl:inline">Discord</span>
            </Link>
            <Link
              href="https://github.com/acidtib/jiji"
              target="_blank"
              aria-label="Jiji on GitHub"
              className="flex items-center gap-2 px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="h-4 w-4" />
              <span className="hidden xl:inline">GitHub</span>
            </Link>
            <Button asChild size="sm" className="ml-2 hidden rounded-sm sm:inline-flex">
              <Link href="/docs/getting-started/quick-start">
                Quick start
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main id="main-content" className="relative" tabIndex="-1">
        {/* Hero */}
        <section className="pb-10 pt-12 md:pb-14 md:pt-16 lg:pt-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-14">
            <div>
              <h1 className="max-w-4xl text-balance font-display text-5xl font-bold uppercase leading-[0.88] tracking-tight sm:text-6xl md:text-7xl">
                Deploy containers across
                <br />
                <span className="text-primary">Linux servers you control.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-xl">
                Deploy Docker or Podman workloads with health-gated rollouts,
                automatic HTTPS, private WireGuard networking, and service discovery.
                <span className="text-foreground"> The CLI coordinates each deploy over SSH, while per-project agents maintain the distributed network and service state.</span>
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 w-full rounded-sm px-6 sm:w-auto">
                  <Link href="/docs/getting-started/quick-start">
                    <Terminal className="mr-2 h-4 w-4" />
                    Deploy your first app
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-11 w-full rounded-sm px-6 sm:w-auto">
                  <Link href="https://github.com/acidtib/jiji" target="_blank">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </Link>
                </Button>
              </div>

              <div className="mt-7">
                <InstallCommand />
              </div>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Cross-provider</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> SSH-driven</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> MIT Licensed</span>
              </div>
            </div>

            <HeroDeployBrief />
          </div>
        </section>

        {/* Mesh network visual -- the proof, right under the claim */}
        <section className="pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <NetworkMesh />
          </div>
        </section>

        {/* What you get */}
        <section id="why-jiji" className="scroll-mt-20 border-t border-border py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="01 / WHY JIJI"
              title="Deploy on your servers. Roll out safely."
              description="Turn ordinary Linux servers into a repeatable deployment target with health checks, automatic HTTPS, private networking, and service discovery built in."
            />

            <div className="grid md:grid-cols-3 gap-3">
              <BenefitModule
                number="01"
                icon={Server}
                title="Bring your Linux servers"
                description="Deploy to supported Linux cloud VMs, bare metal, home labs, or across providers using SSH and root or sudo access."
                proof="AWS · Hetzner · DigitalOcean · OVHcloud"
              />
              <BenefitModule
                number="02"
                icon={Zap}
                title="Keep costs predictable"
                description="Pay infrastructure providers directly and scale on your terms. Your deployment workflow stays the same as servers and traffic grow."
                proof="Direct billing · Open source · Same workflow"
              />
              <BenefitModule
                number="03"
                icon={Lock}
                title="Private by default"
                description="Jiji connects servers with an encrypted WireGuard network and private DNS. Service-to-service and proxy-to-backend traffic uses the mesh."
                proof="Encrypted mesh · Private DNS · Minimal exposure"
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
                    <Line>      <YamlKey>port</YamlKey>: <Val>3000</Val></Line>
                    <Line>      <YamlKey>hosts</YamlKey>: <Val>[api.example.com]</Val></Line>
                    <Line>      <YamlKey>ssl</YamlKey>: <Val>true</Val></Line>
                  </code>
                </pre>
              </div>

              <div className="module-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
                  <span className="tag-chip bg-primary/15 text-primary text-[10px] px-2 py-0.5">OUTPUT</span>
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-primary">
                    <span className="status-dot bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.7)]" />
                    DEPLOY COMPLETE
                  </span>
                </div>
                <DeploymentOutput />
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
              description="Match your deployment approach to the size of your application, infrastructure, and operations team."
            />

            <div className="grid md:grid-cols-3 gap-3">
              <FitModule
                rank="01"
                badge="RECOMMENDED"
                title="Choose Jiji"
                description="You want repeatable production deployments across Linux servers, with networking and safe rollouts handled for you."
                points={["SSH-driven deployments", "Multi-server networking", "Health-gated rollouts"]}
                featured
              />
              <FitModule
                rank="02"
                badge="ONE HOST"
                title="Choose Compose"
                description="Your application lives on one host and you are comfortable handling deployments, routing, and recovery yourself."
                points={["Familiar Compose specification", "Excellent local workflow", "Single-host simplicity"]}
              />
              <FitModule
                rank="03"
                badge="FULLY MANAGED"
                title="Choose a platform"
                description="You want infrastructure, deployment, and operational tooling bundled into a managed service."
                points={["Managed infrastructure", "Integrated web dashboard", "Provider-supported operations"]}
              />
            </div>
          </div>
        </section>

        {/* Highlights -- a handful of what matters, not all ~60 features at once */}
        <section className="py-16 md:py-20 border-y border-border bg-card/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="04 / CAPABILITIES"
              title="Production tools, ready to use"
              description="Deploy, secure, observe, and operate applications across servers from one CLI."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {HIGHLIGHT_FEATURES.map((feature, index) => (
                <CapabilityModule key={feature.title} number={index + 1} {...feature} />
              ))}
            </div>

            <div className="flex flex-col items-start justify-between gap-4 border border-border bg-background/50 px-5 py-4 sm:flex-row sm:items-center">
              <div>
                <div className="font-display text-lg font-bold uppercase tracking-tight">There is more under the hood</div>
                <p className="mt-1 text-sm text-muted-foreground">Explore networking, lifecycle hooks, backups, logs, and the complete command surface.</p>
              </div>
              <Button variant="outline" asChild className="shrink-0 rounded-sm">
                <Link href="/docs/reference/features">
                  Browse all features
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 md:py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="05 / ARCHITECTURE"
              title="From local intent to running services"
              description="Jiji turns one deployment file into coordinated changes across your servers, then verifies the result before traffic moves."
            />

            <ArchitectureMap />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 border-y border-border bg-card/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="06 / QUESTIONS"
              title="What teams ask before deploying"
              description="Clear answers about where Jiji runs, how failed rollouts are handled, and which infrastructure it supports."
            />

            <div className="grid gap-3 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="module-card flex flex-col">
                <div className="border-b border-border bg-muted/40 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground">
                  Operating model at a glance
                </div>
                <div className="divide-y divide-border">
                  <QuestionFact label="EXECUTION" value="Local CLI or CI" icon={Terminal} />
                  <QuestionFact label="CONNECTIVITY" value="SSH + WireGuard" icon={Network} />
                  <QuestionFact label="RUNTIME" value="Docker or Podman" icon={Box} />
                  <QuestionFact label="INGRESS" value="jiji-proxy" icon={Globe} />
                </div>
                <div className="mt-auto border-t border-border p-5">
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    Need implementation details or help with an existing deployment?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild className="rounded-sm">
                      <Link href="/docs">
                        <BookOpen className="mr-2 h-3.5 w-3.5" />
                        Read the docs
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="rounded-sm">
                      <Link href="/docs/guides/troubleshooting">
                        Troubleshooting
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <FaqItem
                  number="01"
                  category="ARCHITECTURE"
                  question="Where does Jiji run?"
                  answer="The Jiji CLI runs on your machine or CI runner. It connects over SSH to the selected servers and any hosts that own affected state, applies the deployment, and exits. A per-project jiji-agent remains on each server to maintain networking, DNS, and service state, while jiji-proxy handles configured ingress."
                  defaultOpen
                />
                <FaqItem
                  number="02"
                  category="ROLLBACKS"
                  question="What happens if a rollout fails?"
                  answer="A candidate must pass its configured health checks before receiving traffic. If it fails, Jiji removes the candidate and keeps the healthy version serving requests."
                />
                <FaqItem
                  number="03"
                  category="INFRASTRUCTURE"
                  question="Can one project span providers?"
                  answer="Yes. A project can use servers from multiple cloud providers, your own hardware, or both. Jiji connects them through a private per-project WireGuard network."
                />
                <FaqItem
                  number="04"
                  category="REGISTRIES"
                  question="Which container registries can I use?"
                  answer="Jiji works with standard OCI registries, including the registry you already use. It can also tunnel a local registry over SSH when you do not need a hosted registry."
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="module-card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-3">
                <span className="tag-chip bg-primary/15 px-2.5 py-1 text-[11px] text-primary">
                  07 / START
                </span>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-primary" /> Linux server</span>
                  <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-primary" /> SSH access</span>
                  <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-primary" /> One config file</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="flex flex-col justify-between border-b border-border p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
                  <div>
                    <div className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                      Ready when you are
                    </div>
                    <h2 className="max-w-2xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                      Your next deploy can be boring
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                      Go from a fresh Linux server to a healthy HTTPS deployment with one
                      configuration file and a repeatable, health-gated rollout.
                    </p>
                  </div>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button size="lg" asChild className="h-12 rounded-sm px-7">
                      <Link href="/docs/getting-started/quick-start">
                        Start the quick guide
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="h-12 rounded-sm px-6">
                      <Link href="https://github.com/acidtib/jiji" target="_blank">
                        <Github className="mr-2 h-4 w-4" />
                        View source
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="bg-background/40 p-7 sm:p-10 lg:p-12">
                  <div className="mb-7 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">Path to production</span>
                    <span className="font-mono text-[10px] text-muted-foreground">3 steps</span>
                  </div>
                  <div className="divide-y divide-border border-y border-border">
                    <StartStep
                      number="01"
                      title="Install the CLI"
                      detail="One binary on your machine or CI runner."
                      command="curl -fsSL get.jiji.run/install.sh | sh"
                    />
                    <StartStep
                      number="02"
                      title="Describe your app"
                      detail="Add servers, services, domains, and health checks."
                      command=".jiji/deploy.yml"
                      prompt={false}
                    />
                    <StartStep
                      number="03"
                      title="Ship it"
                      detail="Jiji builds, verifies, and safely switches traffic."
                      command="jiji deploy --build"
                    />
                  </div>
                  <Link
                    href="/docs"
                    className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Browse all documentation
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid gap-10 py-10 lg:grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr] lg:py-16">
            <div className="max-w-sm">
              <Image
                src="/jiji_logo.svg"
                alt="Jiji"
                width={981}
                height={295}
                className="h-7 w-auto"
              />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Production container deployments across Linux servers you control.
                Built for small teams that want a clear, repeatable path to production.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-wider">
                <span className="tag-chip bg-primary/15 px-2 py-1 text-primary">{JIJI_VERSION}</span>
                <span className="flex items-center gap-1.5 px-1 text-primary">
                  <span className="status-dot bg-primary" />
                  Open source
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:contents">
              <FooterColumn
                title="Get started"
                links={[
                  { label: "Quick start", href: "/docs/getting-started/quick-start" },
                  { label: "Installation", href: "/docs/getting-started/installation" },
                  { label: "Deployment guide", href: "/docs/guides/deployment" },
                  { label: "CI/CD", href: "/docs/guides/ci-cd" },
                ]}
              />
              <FooterColumn
                title="Reference"
                links={[
                  { label: "Configuration", href: "/docs/reference/configuration" },
                  { label: "Commands", href: "/docs/reference/commands" },
                  { label: "Networking", href: "/docs/reference/network" },
                  { label: "All features", href: "/docs/reference/features" },
                ]}
              />
              <FooterColumn
                title="Project"
                className="col-span-2 sm:col-span-1 lg:col-span-1"
                compact
                links={[
                  { label: "GitHub", href: "https://github.com/acidtib/jiji", external: true },
                  { label: "Releases", href: "https://github.com/acidtib/jiji/releases", external: true },
                  { label: "Discord", href: "https://discord.gg/BMdKJzkknE", external: true },
                  { label: "MIT license", href: "https://github.com/acidtib/jiji/blob/main/LICENSE", external: true },
                ]}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 border-t border-border py-5 text-center font-mono text-[10px] text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
            <span>Jiji Container Orchestration</span>
            <div className="flex items-center gap-4">
              <a href="/llms.txt" className="transition-colors hover:text-primary">llms.txt</a>
              <Link href="/docs" className="transition-colors hover:text-primary">Documentation</Link>
            </div>
            <span>
              Built in Colorado with Love
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
      className={`px-2.5 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      {children}
    </Link>
  );
}

function FooterLink({ href, children, external = false }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      {children}
      {external && <ExternalLink className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-70" />}
    </Link>
  );
}

function FooterColumn({ title, links, className = "", compact = false }) {
  return (
    <div className={className}>
      <h2 className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground">{title}</h2>
      <div className={compact ? "grid grid-cols-2 items-start gap-x-6 gap-y-3 sm:flex sm:flex-col" : "flex flex-col items-start gap-3"}>
        {links.map((link) => (
          <FooterLink key={link.href} href={link.href} external={link.external}>
            {link.label}
          </FooterLink>
        ))}
      </div>
    </div>
  );
}

function HeroDeployBrief() {
  const steps = [
    { icon: FileCode, label: "CONFIGURE", title: "Describe the app", detail: "Services, servers, domains, and health checks" },
    { icon: KeyRound, label: "CONNECT", title: "Reach selected hosts", detail: "Bounded parallel execution over SSH" },
    { icon: RefreshCw, label: "ROLLOUT", title: "Start candidates", detail: "Verify health before changing traffic" },
    { icon: Globe, label: "ROUTE", title: "Serve HTTPS", detail: "Switch traffic through jiji-proxy" },
  ];

  return (
    <div className="module-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-foreground">Deployment model</span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] text-primary">
          <span className="status-dot bg-primary" />
          READY
        </span>
      </div>
      <div className="relative p-5 sm:p-6">
        <div className="absolute bottom-8 left-[42px] top-8 border-l border-dashed border-primary/30 sm:left-[46px]" />
        <div className="relative space-y-3">
          {steps.map(({ icon: Icon, label, title, detail }, index) => (
            <div key={label} className="grid grid-cols-[38px_minmax(0,1fr)] gap-3 border border-border bg-background/90 p-3">
              <div className="flex h-9 w-9 items-center justify-center border border-primary/25 bg-primary/[0.08]">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[8px] font-bold tracking-[0.14em] text-primary">{label}</span>
                  <span className="font-mono text-[8px] text-muted-foreground">{String(index + 1).padStart(2, "0")} / 04</span>
                </div>
                <div className="mt-1 font-display text-base font-bold uppercase leading-none">{title}</div>
                <div className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-border bg-primary/[0.06] px-4 py-3 font-mono text-[10px]">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span className="text-foreground">Config to production</span>
        <span className="ml-auto text-primary">ONE COMMAND</span>
      </div>
    </div>
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
          type="button"
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
        <span className="sr-only" aria-live="polite">
          {copyError ? "Copy failed. Select and copy the command manually." : copied ? "Install command copied." : ""}
        </span>
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

function NetworkMesh() {
  const containerRef = useRef(null);
  const trafficSvgRef = useRef(null);
  const rackRefs = useRef(new Map());
  const [traffic, setTraffic] = useState([]);
  const [activeEvent, setActiveEvent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      setTraffic(
        MESH_TRAFFIC_EDGES.map(([from, to], index) => {
          const fromEl = rackRefs.current.get(from[0]);
          const toEl = rackRefs.current.get(to[0]);
          if (!fromEl || !toEl) return null;
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          const start = {
            x: (fromRect.left + fromRect.right) / 2 - containerRect.left,
            y: fromRect.bottom - containerRect.top,
          };
          const end = {
            x: (toRect.left + toRect.right) / 2 - containerRect.left,
            y: toRect.bottom - containerRect.top,
          };
          const laneY = Math.max(start.y, end.y) + 12 + index * 7;
          return {
            path: `M ${start.x} ${start.y} V ${laneY} H ${end.x} V ${end.y}`,
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
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      if (mediaQuery.matches) setIsPaused(true);
    };

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);
    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    const svg = trafficSvgRef.current;
    if (!svg) return;
    if (isPaused) svg.pauseAnimations?.();
    else svg.unpauseAnimations?.();
  }, [isPaused, traffic]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveEvent((current) => (current + 1) % MESH_EVENTS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="module-card overflow-hidden mesh-console" data-paused={isPaused}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="tag-chip bg-primary/15 px-2 py-1 text-[10px] text-primary">LIVE NETWORK</span>
          <span className="font-display text-sm font-bold uppercase tracking-tight">Production mesh</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-[10px] text-primary">
            <span className="status-dot bg-primary animate-node-pulse shadow-[0_0_8px_hsl(var(--primary)/0.65)]" />
            ALL SYSTEMS HEALTHY
          </div>
          <button
            type="button"
            className="border border-border px-2 py-1 font-mono text-[9px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            aria-pressed={isPaused}
            onClick={() => setIsPaused((current) => !current)}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
        <div ref={containerRef} className="relative overflow-hidden border-b border-border px-4 py-7 md:px-6 md:py-9 lg:border-b-0 lg:border-r">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="relative mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary">Service topology</div>
              <div className="mt-1 font-display text-xl font-bold uppercase tracking-tight">Four hosts, one private network</div>
            </div>
            <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground">
              <span>6 SERVICES</span>
              <span className="text-border">/</span>
              <span>4 ROUTES</span>
            </div>
          </div>

          <svg ref={trafficSvgRef} aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block">
            {traffic.map((edge, i) => (
              <g key={`traffic-${i}`}>
                <path
                  d={edge.path}
                  fill="none"
                  stroke="hsl(var(--primary) / 0.45)"
                  strokeWidth="1.25"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  className={`animate-line-draw delay-${(i + 1) * 100}`}
                />
                <path
                  d={edge.path}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="3 21"
                  className="animate-flow-dash"
                  style={{ animationDelay: `${1 + i * 0.3}s` }}
                />
                <circle r="2.5" fill="hsl(var(--primary))" className="mesh-packet">
                  <animateMotion path={edge.path} dur={`${1.7 + i * 0.15}s`} begin={`${i * 0.32}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;1;0" dur={`${1.7 + i * 0.15}s`} begin={`${i * 0.32}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
          </svg>

          <div className="relative grid grid-cols-2 gap-3 pb-12 md:grid-cols-4">
            {RACKS.map((rack, rackIndex) => (
              <Rack
                key={rack.name}
                rack={rack}
                rackRef={(el) => rackRefs.current.set(rackIndex, el)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-background/40">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-foreground">Live traffic</span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] text-primary">
              <Activity className="h-3 w-3" />
              STREAMING
            </span>
          </div>
          <div className="grid flex-1 divide-y divide-border/70">
            {MESH_EVENTS.map((event, index) => (
              <div
                key={`${event.source}-${event.target}`}
                className={`relative flex flex-col justify-center px-4 py-4 font-mono transition-colors duration-300 ${
                  activeEvent === index ? "bg-primary/[0.08]" : ""
                }`}
              >
                <span className={`absolute bottom-0 left-0 top-0 w-0.5 ${activeEvent === index ? "bg-primary" : "bg-transparent"}`} />
                <div className="flex items-center justify-between gap-3 text-[9px]">
                  <span className="truncate text-foreground">{event.source}</span>
                  <span className={activeEvent === index ? "text-primary" : "text-muted-foreground"}>{event.result}</span>
                </div>
                <div className="my-2 flex items-center gap-2 text-[9px] text-muted-foreground">
                  <span className="text-primary/80">{event.action}</span>
                  <span className="h-px flex-1 bg-border" />
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
                <div className="truncate text-right text-[9px] text-muted-foreground">{event.target}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
        <MeshMetric icon={Shield} label="MESH" value="WireGuard" note="Encrypted by default" />
        <MeshMetric icon={Globe} label="DNS" value=".jiji" note="Resolve by name" />
        <MeshMetric icon={RefreshCw} label="DEPLOY" value="Zero downtime" note="Health-gated rollout" />
        <MeshMetric icon={FileCode} label="CONFIG" value="One file" note="One command" />
      </div>
    </div>
  );
}

// A server as a rack: a bordered card with a header (name/provider/ip) and its services
// stacked inside as blades, the way a physical server holds blade units. Each blade shows
// its own private address and the .jiji name other services actually reach it by.
function Rack({ rack, rackRef }) {
  return (
    <div ref={rackRef} className="relative flex min-h-[230px] flex-col border border-border bg-background/90 transition-colors duration-300 hover:border-primary/50">
      <div className="border-b border-border bg-muted/50 px-3 py-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <div className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-muted-foreground">SERVER</div>
            <div className="mt-1 font-display text-lg font-bold uppercase leading-none text-foreground">{rack.name}</div>
          </div>
          <span className="mt-0.5 status-dot bg-primary animate-node-pulse" />
        </div>
        <div className="font-mono text-[9px] text-primary">{rack.provider}</div>
        <div className="mt-0.5 font-mono text-[8px] text-muted-foreground">wg0 {rack.ip}</div>
      </div>
      <div className="flex flex-1 flex-col">
        {rack.blades.map((blade) => (
          <div
            key={blade.name}
            className="group flex flex-1 items-start gap-2 border-t border-border px-3 py-3 first:border-t-0 transition-colors duration-300 hover:bg-primary/[0.06]"
          >
            <Box className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[10px] font-bold text-foreground">
                {blade.name}
                <span className="text-[8px] font-normal text-primary">HEALTHY</span>
              </div>
              <div className="mt-1 truncate font-mono text-[8px] text-primary">
                {blade.dns}
              </div>
              <div className="mt-0.5 whitespace-nowrap font-mono text-[8px] text-muted-foreground">
                {blade.ip}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border bg-muted/20 px-3 py-2 font-mono text-[8px]">
        <span className="text-muted-foreground">{rack.blades.length} {rack.blades.length === 1 ? "service" : "services"}</span>
        <span className="text-primary">CONNECTED</span>
      </div>
    </div>
  );
}

function MeshMetric({ icon: Icon, label, value, note }) {
  return (
    <div className="border-b border-r border-border px-4 py-4 even:border-r-0 md:border-b-0 md:even:border-r md:last:border-r-0">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] font-bold tracking-[0.14em] text-muted-foreground">{label}</span>
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="font-display text-lg font-bold uppercase leading-none">{value}</div>
      <div className="mt-1.5 text-[11px] text-muted-foreground">{note}</div>
    </div>
  );
}

function BenefitModule({ number, icon: Icon, title, description, proof }) {
  return (
    <div className="module-card group flex min-h-[310px] flex-col p-6 transition-colors hover:border-primary/40">
      <div className="mb-10 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center border border-primary/25 bg-primary/[0.08]">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{number} / 03</span>
      </div>
      <h3 className="font-display text-2xl font-bold uppercase leading-none tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-auto border-t border-border pt-4 font-mono text-[10px] leading-relaxed text-primary">
        {proof}
      </div>
    </div>
  );
}

function FitModule({ rank, badge, title, description, points, featured = false }) {
  return (
    <div className={`module-card flex min-h-[330px] flex-col overflow-hidden ${featured ? "border-primary/45 bg-primary/[0.04]" : ""}`}>
      <div className={`h-1 w-full ${featured ? "bg-primary" : "bg-border"}`} />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-8 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] text-muted-foreground">{rank} / 03</span>
          <span className={`tag-chip px-2 py-1 text-[9px] ${featured ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
            {badge}
          </span>
        </div>
        <h3 className="font-display text-2xl font-bold uppercase leading-none tracking-tight">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-auto pt-7">
          <div className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Best when you need</div>
          <div className="space-y-2.5">
            {points.map((point) => (
              <div key={point} className="flex items-start gap-2 text-sm">
                <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${featured ? "text-primary" : "text-muted-foreground"}`} />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CapabilityModule({ number, category, icon: Icon, title, description }) {
  return (
    <div className="module-card group flex min-h-[230px] flex-col p-6 transition-colors hover:border-primary/40">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center border border-primary/25 bg-primary/[0.08] transition-colors group-hover:bg-primary/15">
          <Icon className="h-[18px] w-[18px] text-primary" />
        </div>
        <div className="text-right font-mono">
          <div className="text-[9px] font-bold tracking-wider text-primary">{category}</div>
          <div className="mt-1 text-[9px] text-muted-foreground">{String(number).padStart(2, "0")} / 06</div>
        </div>
      </div>
      <h3 className="font-display text-xl font-bold uppercase leading-none tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function QuestionFact({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex h-9 w-9 items-center justify-center bg-primary/[0.08]">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <div className="font-mono text-[8px] font-bold tracking-[0.14em] text-muted-foreground">{label}</div>
        <div className="mt-1 font-display text-base font-bold uppercase leading-none">{value}</div>
      </div>
    </div>
  );
}

function FaqItem({ number, category, question, answer, defaultOpen = false }) {
  return (
    <details name="landing-faq" open={defaultOpen} className="group module-card overflow-hidden open:border-primary/35 open:bg-primary/[0.03]">
      <summary className="grid cursor-pointer list-none grid-cols-[28px_minmax(0,1fr)_24px] items-center gap-3 px-5 py-5 marker:content-none">
        <span className="font-mono text-[10px] text-primary">{number}</span>
        <span>
          <span className="mb-1.5 block font-mono text-[8px] font-bold tracking-[0.14em] text-muted-foreground">{category}</span>
          <span className="block font-display text-lg font-bold uppercase leading-tight tracking-tight">{question}</span>
        </span>
        <span className="flex h-6 w-6 items-center justify-center border border-border font-mono text-lg font-normal leading-none text-primary transition-all group-open:rotate-45 group-open:border-primary/40" aria-hidden="true">+</span>
      </summary>
      <div className="grid grid-cols-[28px_minmax(0,1fr)_24px] gap-3 border-t border-border px-5 py-4">
        <span />
        <p className="text-sm leading-relaxed text-muted-foreground">{answer}</p>
        <span />
      </div>
    </details>
  );
}

function StartStep({ number, title, detail, command, prompt = true }) {
  return (
    <div className="grid grid-cols-[30px_minmax(0,1fr)] gap-3 py-5">
      <span className="font-mono text-[10px] text-primary">{number}</span>
      <div className="min-w-0">
        <div className="font-display text-base font-bold uppercase tracking-tight">{title}</div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
        <code className="mt-3 block overflow-x-auto whitespace-nowrap border-l border-primary/60 bg-primary/[0.06] px-3 py-2 font-mono text-[11px] text-foreground">
          <span className="mr-2 text-primary">{prompt ? "$" : "›"}</span>
          {command}
        </code>
      </div>
    </div>
  );
}

function ArchitectureMap() {
  const serverLayers = [
    {
      icon: Globe,
      label: "INGRESS",
      title: "jiji-proxy",
      detail: "HTTPS termination and traffic switching",
    },
    {
      icon: Box,
      label: "WORKLOAD",
      title: "Docker or Podman",
      detail: "Health-checked application containers",
    },
    {
      icon: Network,
      label: "PRIVATE NETWORK",
      title: "WireGuard + .jiji DNS",
      detail: "Encrypted service-to-service connectivity",
    },
  ];

  return (
    <div className="module-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground">
          Deployment path
        </span>
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          <span>Local</span>
          <ArrowRight className="h-3 w-3 text-primary" />
          <span>Remote</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.85fr_0.65fr_1.2fr]">
        <div className="flex flex-col justify-center border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="mb-6 flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/[0.08]">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary">ORCHESTRATOR</span>
          <h3 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight">Jiji CLI</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Reads the desired state, builds an execution plan, and coordinates each deployment step.
          </p>
          <div className="mt-6 border-l border-primary/60 bg-primary/[0.06] px-3 py-2.5 font-mono text-[11px]">
            <span className="mr-2 text-primary">$</span>
            jiji deploy --build
          </div>
          <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <FileCode className="h-3.5 w-3.5 text-primary" />
            .jiji/deploy.yml
          </div>
        </div>

        <div className="relative flex min-h-40 flex-col items-center justify-center border-b border-border bg-background/50 px-5 py-8 lg:border-b-0 lg:border-r">
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-primary/35 bg-card">
            <KeyRound className="h-5 w-5 text-primary" />
          </div>
          <div className="relative z-10 mt-3 bg-card px-2 text-center">
            <div className="font-mono text-[10px] font-bold text-foreground">SSH</div>
            <div className="mt-1 font-mono text-[9px] text-muted-foreground">parallel execution</div>
          </div>
          <ArrowRight className="absolute right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-primary lg:block" />
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-primary">TARGET SERVER</span>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight">Runtime stack</h3>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-primary">
              <span className="status-dot bg-primary" />
              HEALTHY
            </div>
          </div>

          <div className="border border-border">
            {serverLayers.map(({ icon: Icon, label, title, detail }) => (
              <div key={title} className="grid grid-cols-[38px_minmax(0,1fr)] gap-3 border-b border-border p-4 last:border-b-0">
                <div className="flex h-9 w-9 items-center justify-center bg-muted">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[8px] font-bold tracking-[0.14em] text-muted-foreground">{label}</div>
                  <div className="mt-1 font-display text-base font-bold uppercase leading-none">{title}</div>
                  <div className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid border-t border-border bg-muted/20 sm:grid-cols-3 lg:grid-cols-[0.85fr_0.65fr_1.2fr]">
        <ArchitecturePhase number="01" title="Plan" detail="Resolve config and dependencies" />
        <ArchitecturePhase number="02" title="Apply" detail="Build, push, and start candidates" />
        <ArchitecturePhase number="03" title="Verify" detail="Check health and switch traffic" />
      </div>
    </div>
  );
}

function ArchitecturePhase({ number, title, detail }) {
  return (
    <div className="flex gap-3 border-b border-border px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <span className="font-mono text-[10px] text-primary">{number}</span>
      <div>
        <div className="font-display text-sm font-bold uppercase tracking-tight">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
      </div>
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

function DeploymentOutput() {
  const phases = [
    { label: "Build image", detail: "myapp-api:8f31c2a", duration: "8.4s" },
    { label: "Push image", detail: "registry.example.com/myapp", duration: "3.1s" },
    { label: "Start candidates", detail: "Rolling across 2 servers", duration: "1.7s" },
  ];

  const servers = [
    { name: "web1", host: "server1.example.com", duration: "842ms" },
    { name: "web2", host: "server2.example.com", duration: "916ms" },
  ];

  return (
    <div className="flex min-h-[374px] flex-col p-5 font-mono text-xs">
      <div className="mb-5 flex items-center gap-2 border-b border-border pb-4 text-sm">
        <span className="text-primary">$</span>
        <span className="text-foreground">jiji deploy --build</span>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">production</span>
      </div>

      <div className="space-y-3">
        {phases.map((phase, index) => (
          <div key={phase.label} className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-2">
            <span className="text-[10px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <span className="text-foreground">{phase.label}</span>
              <span className="ml-2 hidden truncate text-muted-foreground sm:inline">{phase.detail}</span>
            </div>
            <span className="flex items-center gap-2 text-muted-foreground">
              {phase.duration}
              <Check className="h-3.5 w-3.5 text-primary" />
            </span>
          </div>
        ))}
      </div>

      <div className="my-5 border-t border-dashed border-border" />

      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Health-gated rollout</span>
        <span className="text-[10px] text-muted-foreground">2 / 2 healthy</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {servers.map((server) => (
          <div key={server.name} className="border border-primary/25 bg-primary/[0.06] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <Box className="h-3.5 w-3.5 text-primary" />
                {server.name}
              </span>
              <span className="tag-chip bg-primary/15 px-1.5 py-1 text-[9px] text-primary">HEALTHY</span>
            </div>
            <div className="truncate text-[10px] text-muted-foreground">{server.host}</div>
            <div className="mt-2 flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">traffic switched</span>
              <span className="text-primary">{server.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 border-l-2 border-primary bg-primary/[0.08] px-3 py-2.5">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0">
          <div className="text-foreground">myapp-api deployed successfully</div>
          <div className="mt-0.5 text-[10px] text-muted-foreground">2 servers · zero failed · previous containers removed</div>
        </div>
        <span className="ml-auto text-primary">14.9s</span>
      </div>
    </div>
  );
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
