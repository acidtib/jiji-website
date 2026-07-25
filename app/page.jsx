"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  Binary,
  BookOpen,
  Box,
  Check,
  ChevronRight,
  Clock,
  Cloud,
  Container,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  FileCode,
  FileText,
  Filter,
  FolderOpen,
  GitBranch,
  Globe,
  Hammer,
  HardDrive,
  Key,
  KeyRound,
  Layers,
  Link2,
  Lock,
  Network,
  Package,
  Pause,
  Play,
  Plug,
  RefreshCw,
  Route,
  ScrollText,
  Server,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Split,
  Terminal,
  Timer,
  Trash2,
  Users,
  Workflow,
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

// Every feature from the original flat grid, now organized as a manifest a
// visitor browses category by category instead of scrolling past all ~64 at once.
const FEATURE_MANIFEST = [
  {
    title: "Core",
    features: [
      { icon: Network, title: "Private Mesh Network", description: "WireGuard VPN between all servers. Encrypted by default." },
      { icon: Globe, title: "Automatic DNS", description: "Built-in .jiji DNS resolution. Access services by name." },
      { icon: RefreshCw, title: "Zero-Downtime", description: "Old version keeps serving until the new one passes its health check." },
      { icon: Container, title: "Runtime Agnostic", description: "Docker or Podman. Same config, your choice." },
      { icon: GitBranch, title: "Multi Server", description: "Independent services deploy concurrently. Each service rolls out to its servers one at a time, health-gated for safety." },
      { icon: Layers, title: "Multi Project", description: "Run multiple apps on one server. Perfect for small teams and hobby projects." },
    ],
  },
  {
    title: "Proxy & SSL",
    features: [
      { icon: Lock, title: "Auto SSL/TLS", description: "Automatic HTTPS certificates via kamal-proxy. Zero config." },
      { icon: Route, title: "Path-based Routing", description: "Route traffic based on URL path prefix to different services." },
      { icon: Sparkles, title: "Wildcard Domains", description: "Support for wildcard domain matching like *.example.com." },
      { icon: Split, title: "Multi-port Services", description: "Route multiple ports on single service to different domains." },
      { icon: Activity, title: "HTTP Health Checks", description: "Health checking via HTTP endpoints with configurable paths." },
      { icon: Terminal, title: "Command Health Checks", description: "Custom shell commands for health verification." },
      { icon: Clock, title: "Health Check Timing", description: "Configurable intervals, timeouts, and deploy timeouts." },
    ],
  },
  {
    title: "Build",
    features: [
      { icon: Workflow, title: "Multi-stage Builds", description: "Support Docker multi-stage builds with target specification." },
      { icon: FileCode, title: "Custom Dockerfile", description: "Specify non-standard Dockerfile path for builds." },
      { icon: Settings, title: "Build Arguments", description: "Pass build-time arguments (ARGs) to Docker." },
      { icon: Cloud, title: "Remote Builds", description: "Execute builds on remote SSH hosts for faster CI/CD." },
      { icon: Package, title: "Build Cache", description: "Control whether to use Docker layer cache for builds." },
    ],
  },
  {
    title: "Container Config",
    features: [
      { icon: Cpu, title: "Resource Limits", description: "CPU, memory, GPU limits. Device mapping support." },
      { icon: ShieldCheck, title: "Privileged Mode", description: "Run containers with extended privileges when needed." },
      { icon: Binary, title: "Linux Capabilities", description: "Add specific capabilities like SYS_ADMIN, NET_ADMIN." },
      { icon: Plug, title: "Device Mappings", description: "Mount host devices into containers (/dev/video0, /dev/snd)." },
      { icon: Database, title: "Named Volumes", description: "Use Docker named volumes instead of host paths." },
      { icon: FolderOpen, title: "File & Directory Mounts", description: "Mount files/directories with fine grained permissions." },
      { icon: Play, title: "Custom Commands", description: "Override container ENTRYPOINT/CMD as needed." },
      { icon: RefreshCw, title: "Restart Policy", description: "Configure restart behavior: unless-stopped, always, on-failure, no." },
      { icon: Settings, title: "Network Mode", description: "Set custom network modes (bridge, host, etc.)." },
    ],
  },
  {
    title: "Deployment",
    features: [
      { icon: Play, title: "Rolling Deployments", description: "Zero-downtime deployments with old container cleanup." },
      { icon: Pause, title: "Stop-First Mode", description: "For stateful services like SQLite - stop old before starting new." },
      { icon: Activity, title: "Fail-Safe Health Checks", description: "A failed candidate is discarded; the previous version is never touched." },
      { icon: Timer, title: "Image Retention", description: "Control how many images to keep per service." },
      { icon: Shield, title: "Deployment Locks", description: "Prevent concurrent deploys. Team safe operations." },
      { icon: Filter, title: "Service Filtering", description: "Deploy specific services by name patterns." },
    ],
  },
  {
    title: "SSH & Connections",
    features: [
      { icon: Link2, title: "SSH Jump Host", description: "Connect through bastion/intermediate hosts via SSH proxy." },
      { icon: Key, title: "Multiple SSH Keys", description: "Support multiple SSH keys for authentication." },
      { icon: KeyRound, title: "Key Passphrase", description: "Support encrypted SSH keys with passphrases." },
      { icon: FileText, title: "SSH Config Support", description: "Use system SSH config (~/.ssh/config)." },
      { icon: Users, title: "Bounded Concurrency", description: "Run SSH operations across many hosts without overwhelming any one connection limit." },
      { icon: Terminal, title: "Interactive SSH", description: "Shell access to servers via jiji server exec." },
    ],
  },
  {
    title: "Environment & Secrets",
    features: [
      { icon: KeyRound, title: "Secrets Management", description: "Reference secrets from .env files securely." },
      { icon: Share2, title: "Shared Environment", description: "Project level env vars inherited by all services." },
      { icon: FileText, title: "Multi-environment", description: "Load different configurations per environment." },
      { icon: Settings, title: "Custom Secrets Path", description: "Specify custom location for .env files." },
    ],
  },
  {
    title: "Network",
    features: [
      { icon: Settings, title: "Custom Network CIDR", description: "Configure management and container IP ranges per project." },
      { icon: Eye, title: "Network Plan Preview", description: "See interfaces, ports, and VIPs before touching a server." },
      { icon: Globe, title: "Per-Replica DNS Records", description: "Resolve every replica together, or reach one server directly." },
      { icon: Trash2, title: "Clean Teardown", description: "Remove a project's network, containers, and routes in one command." },
      { icon: Server, title: "Multi-Project Isolation", description: "Independent projects share a host with zero shared network state." },
    ],
  },
  {
    title: "Registry",
    features: [
      { icon: HardDrive, title: "Registry Support", description: "Local registry, GHCR, Docker Hub, ECR, GCP Artifact Registry, or any custom registry." },
      { icon: Key, title: "Registry Login", description: "Authenticate to remote container registries." },
      { icon: Settings, title: "Local Registry Tunneling", description: "Automatic SSH reverse tunnels let remote servers pull from your local build." },
    ],
  },
  {
    title: "Logging & Monitoring",
    features: [
      { icon: Eye, title: "Centralized Logs", description: "Fetch logs from services with filtering." },
      { icon: Filter, title: "Log Grep", description: "Filter logs by pattern with grep options." },
      { icon: Clock, title: "Time-based Filtering", description: "Show logs since timestamp or relative time." },
      { icon: Play, title: "Log Follow Mode", description: "Stream logs in real-time like tail -f." },
      { icon: ScrollText, title: "Audit Trail", description: "Complete deployment history with filtering." },
      { icon: Activity, title: "Deployment Timing", description: "Every audit entry records how long the operation took." },
    ],
  },
  {
    title: "Operations",
    features: [
      { icon: Terminal, title: "Remote Execution", description: "Run commands across servers in parallel or sequential, or drop into an interactive shell." },
      { icon: RefreshCw, title: "Service Restart", description: "Restart services without full redeployment." },
      { icon: Trash2, title: "Service Removal", description: "Clean removal with network unregistration." },
      { icon: Sparkles, title: "Image Pruning", description: "Automatic cleanup of old service images." },
      { icon: Server, title: "Server Teardown", description: "Clean server removal from cluster." },
      { icon: Hammer, title: "Auto-install Engine", description: "Install Docker/Podman automatically on servers." },
      { icon: Box, title: "Architecture Support", description: "Explicitly set server architecture (amd64/arm64)." },
    ],
  },
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
            <NavLink href="/docs">Docs</NavLink>
            <NavLink href="/docs/getting-started/quick-start" className="hidden sm:inline-flex">
              Getting Started
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
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Hero: the headline stands alone, the mesh visual carries the proof */}
        <section className="pt-14 pb-10 md:pt-20 md:pb-14">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
                <span className="tag-chip bg-primary/15 text-primary text-[11px] px-2 py-1">
                  {JIJI_VERSION}
                </span>
                <span className="tag-chip bg-muted text-muted-foreground text-[11px] px-2 py-1">
                  MIT
                </span>
                <span className="tag-chip bg-muted text-muted-foreground text-[11px] px-2 py-1">
                  LINUX / MACOS
                </span>
              </div>

              <h1 className="font-display font-bold uppercase text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-5">
                Deploy containers anywhere.
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-7 max-w-xl">
                Without the orchestration headache. From weekend projects to production
                traffic.{" "}
                <span className="text-foreground font-medium">
                  No platform middleman taking a cut or locking you in.
                </span>
              </p>

              <InstallCommand />

              <div className="flex flex-wrap justify-center gap-3 mt-7">
                <Button asChild className="h-10 px-5 rounded-sm">
                  <Link href="/docs/getting-started/quick-start">
                    <Terminal className="mr-2 w-4 h-4" />
                    Quick Start
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-10 px-5 rounded-sm">
                  <Link href="https://github.com/acidtib/jiji" target="_blank">
                    <Github className="mr-2 w-4 h-4" />
                    View Source
                    <ExternalLink className="ml-2 w-3 h-3 opacity-50" />
                  </Link>
                </Button>
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
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading kicker="02 / MANIFEST" title="Production ready from day one" />

            <div className="grid md:grid-cols-3 gap-3">
              <BenefitModule
                icon={Server}
                title="Your Infrastructure"
                description="Run on any server you control. AWS, Hetzner, DigitalOcean, bare metal. Mix providers freely."
              />
              <BenefitModule
                icon={Zap}
                title="Predictable Costs"
                description="No per request fees. A $5/month VPS can run production workloads. Scale when you need to."
              />
              <BenefitModule
                icon={Lock}
                title="Secure by Default"
                description="WireGuard mesh VPN encrypts all traffic automatically. Your app never binds a host port directly, only kamal-proxy and WireGuard are exposed."
              />
            </div>
          </div>
        </section>

        {/* Config -> Output */}
        <section className="py-16 md:py-20 border-y border-border bg-card/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="03 / CONFIG"
              title="One config. One command."
              description={
                <>
                  Define your entire infrastructure in a single YAML file. Deploy
                  with <code className="font-mono text-primary">jiji deploy</code>.
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
            <SectionHeading kicker="04 / COMPARISON" title="Why Jiji?" />

            <div className="grid md:grid-cols-3 gap-3">
              <ComparisonModule
                rank="01"
                title="vs. Kubernetes"
                items={[
                  { label: "Learning curve", jiji: "Minutes", other: "Months" },
                  { label: "Config complexity", jiji: "1 file", other: "100+ files" },
                  { label: "Minimum servers", jiji: "1", other: "3+" },
                  { label: "Resource overhead", jiji: "Minimal", other: "High" },
                ]}
              />
              <ComparisonModule
                rank="02"
                title="vs. Docker Compose"
                items={[
                  { label: "Multi server", jiji: "Built-in", other: "N/A" },
                  { label: "Zero-downtime", jiji: "Automatic", other: "Manual" },
                  { label: "Service discovery", jiji: "DNS", other: "Single host" },
                  { label: "Health checks", jiji: "Deploy aware", other: "Basic" },
                ]}
              />
              <ComparisonModule
                rank="03"
                title="vs. PaaS"
                items={[
                  { label: "Infrastructure", jiji: "Yours", other: "Theirs" },
                  { label: "Pricing", jiji: "Fixed", other: "Usage based" },
                  { label: "Vendor lock-in", jiji: "None", other: "High" },
                  { label: "Control", jiji: "Full", other: "Limited" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Full feature manifest, progressively disclosed */}
        <section className="py-16 md:py-20 border-y border-border bg-card/40">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <SectionHeading
              kicker="05 / FEATURES"
              title="Everything included"
              description="Built-in features that would take weeks to set up manually. Each row opens to the full entry."
            />

            <ManifestBoard manifest={FEATURE_MANIFEST} />
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeading kicker="06 / ARCHITECTURE" title="Three components, zero complexity" />

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

        {/* CTA */}
        <section className="py-20 md:py-24 border-t border-border">
          <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
            <span className="tag-chip bg-primary/15 text-primary text-[11px] px-2.5 py-1 mb-8 inline-block">
              07 / DEPLOY
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
              Deploy your first app in 5 minutes
            </h2>
            <p className="text-lg text-muted-foreground mb-9">
              Read the quick start guide or dive into the full documentation.
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
    <div>
      <div className="flex items-center gap-3 bg-background border border-border pl-4 pr-2 py-2.5 rounded-sm font-mono text-sm w-full sm:w-auto sm:inline-flex hover:border-primary/40 transition-colors">
        <span className="text-primary">$</span>
        <code className="flex-1 truncate">{command}</code>
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
          view script &rarr;
        </a>
        {" · "}MIT licensed, source on{" "}
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
    // Racks fade/slide in on mount (animate-fade-in-up moves them via transform), so a rect
    // measured on the very first frame can catch them mid-animation, well short of their
    // resting position -- re-measure once each rack's entrance animation actually finishes,
    // plus a fixed fallback in case animationend doesn't fire (e.g. reduced-motion).
    const container = containerRef.current;
    container?.addEventListener("animationend", measure);
    const settleTimer = setTimeout(measure, 900);

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      container?.removeEventListener("animationend", measure);
      clearTimeout(settleTimer);
    };
  }, []);

  return (
    <div className="module-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
        <span className="tag-chip bg-primary/15 text-primary text-[10px] px-2 py-0.5">MESH</span>
        <span className="font-mono text-xs text-muted-foreground">
          6 services &middot; 4 servers &middot; private network
        </span>
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
                stroke="hsl(var(--primary) / 0.4)"
                strokeWidth="1"
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
            </g>
          ))}
        </svg>

        <div className="relative grid grid-cols-2 gap-4 md:gap-16">
          {RACKS.map((rack, rackIndex) => (
            <Rack
              key={rack.name}
              rack={rack}
              delay={rackIndex * 100}
              bladeRef={(bladeIndex, el) => bladeRefs.current.set(`${rackIndex}-${bladeIndex}`, el)}
            />
          ))}
        </div>

        <div className="relative flex items-center justify-center gap-2 mt-8 md:mt-10 pt-5 border-t border-border/60">
          <span className="inline-block w-4 h-[2px] bg-primary animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            Service traffic over .jiji DNS
          </span>
        </div>
      </div>
    </div>
  );
}

// A server as a rack: a bordered card with a header (name/provider/ip) and its services
// stacked inside as blades, the way a physical server holds blade units. Each blade shows
// its own private address and the .jiji name other services actually reach it by.
function Rack({ rack, delay, bladeRef }) {
  return (
    <div
      className="relative border border-border bg-background/70 opacity-0 animate-fade-in-up transition-colors duration-300 hover:border-primary/40"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="px-2.5 md:px-3 py-2 border-b border-border bg-muted/40">
        <div className="font-mono text-[11px] md:text-xs font-bold text-foreground">{rack.name}</div>
        <div className="font-mono text-[9px] text-muted-foreground whitespace-nowrap">
          {rack.provider} &middot; {rack.ip}
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
                {blade.name}
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

function ComparisonModule({ rank, title, items }) {
  return (
    <div className="module-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="tag-chip bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5">{rank}</span>
        <h3 className="font-mono text-xs font-bold tracking-wide">{title.toUpperCase()}</h3>
      </div>
      <div className="space-y-3.5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm gap-3">
            <span className="text-muted-foreground">{item.label}</span>
            <div className="flex items-center gap-2.5 font-mono text-xs">
              <span className="font-bold text-cleared">{item.jiji}</span>
              <span className="text-muted-foreground/40">vs</span>
              <span className="text-muted-foreground">{item.other}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManifestBoard({ manifest }) {
  const [expanded, setExpanded] = useState({});
  const toggle = (title) => setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));

  return (
    <div className="space-y-2">
      {manifest.map((category) => {
        const isOpen = !!expanded[category.title];
        const visible = isOpen ? category.features : category.features.slice(0, 3);
        const hiddenCount = category.features.length - 3;

        return (
          <div key={category.title} className="module-card px-4 py-3.5">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h3 className="font-mono text-xs font-bold tracking-wide">{category.title.toUpperCase()}</h3>
              <span className="tag-chip bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5">
                {category.features.length}
              </span>
            </div>

            <div className={isOpen ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-2" : "flex flex-wrap gap-1.5"}>
              {visible.map((feature) =>
                isOpen ? (
                  <ManifestEntry key={feature.title} {...feature} />
                ) : (
                  <ManifestChip key={feature.title} {...feature} />
                )
              )}
            </div>

            {hiddenCount > 0 && (
              <button
                onClick={() => toggle(category.title)}
                className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
                aria-expanded={isOpen}
              >
                {isOpen ? "SHOW LESS" : `+${hiddenCount} MORE`}
                <ChevronRight className={`w-3 h-3 transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ManifestChip({ icon: Icon, title }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-muted/50 border border-border rounded-sm px-2 py-1.5">
      <Icon className="w-3 h-3 text-primary" />
      {title}
    </span>
  );
}

function ManifestEntry({ icon: Icon, title, description }) {
  return (
    <div className="border border-border bg-muted/20 rounded-sm p-3">
      <div className="flex items-start gap-2.5">
        <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-sm mb-0.5">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
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
