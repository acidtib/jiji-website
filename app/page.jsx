"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  Github,
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
import { useEffect, useState } from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark noise-overlay relative">
      {/* Mesh background */}
      <div className="fixed inset-0 mesh-bg opacity-50 pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/jiji_logo.svg"
                alt="Jiji"
                width={80}
                height={32}
                className="h-8 w-auto transition-transform group-hover:scale-105"
              />
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <NavLink href="/docs">Docs</NavLink>
            <NavLink href="/docs/getting-started/quick-start">
              Getting Started
            </NavLink>
            <div className="w-px h-5 bg-border mx-2" />
            <Link
              href="https://discord.gg/BMdKJzkknE"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <DiscordIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Discord</span>
            </Link>
            <Link
              href="https://github.com/acidtib/jiji"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="pt-20 pb-32 md:pt-28 md:pb-40 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="max-w-4xl">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-8 opacity-0 animate-fade-in-up">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-mono text-xs">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                  v0.3.1 Latest
                </Badge>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 opacity-0 animate-fade-in-up delay-100">
                <span className="block">Deploy containers</span>
                <span className="block mt-2">
                  <span className="gradient-text">anywhere</span>
                  <span className="text-muted-foreground">.</span>
                </span>
              </h1>

              {/* Subheadline with terminal aesthetic */}
              <div className="flex items-start gap-3 mb-8 opacity-0 animate-fade-in-up delay-200">
                <ChevronRight className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  Without the orchestration headache. From weekend projects to
                  production traffic.{" "}
                  <span className="text-foreground font-medium">
                    No platform middleman taking a cut or locking you in.
                  </span>
                </p>
              </div>

              {/* Install Command */}
              <div className="opacity-0 animate-fade-in-up delay-300">
                <InstallCommand />
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mt-10 opacity-0 animate-fade-in-up delay-400">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground glow-sm group"
                  asChild
                >
                  <Link href="/docs/getting-started/quick-start">
                    <Terminal className="mr-2 w-4 h-4" />
                    Quick Start
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                  asChild
                >
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

        {/* Network Visualization */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="opacity-0 animate-scale-in">
              <NetworkVisualization />
            </div>
          </div>
        </section>

        {/* What you get section */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-mono text-sm text-primary mb-4 opacity-0 animate-fade-in-up">
                // WHAT_YOU_GET
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 opacity-0 animate-fade-in-up delay-100">
                Production ready from day one
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-up delay-200">
                Everything you need to deploy and manage containerized
                applications across multiple servers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <BenefitCard
                icon={Server}
                title="Your Infrastructure"
                description="Run on any server you control. AWS, Hetzner, DigitalOcean, bare metal. Mix providers freely."
                delay="delay-100"
              />
              <BenefitCard
                icon={Zap}
                title="Predictable Costs"
                description="No per request fees. A $5/month VPS can run production workloads. Scale when you need to."
                delay="delay-200"
              />
              <BenefitCard
                icon={Lock}
                title="Secure by Default"
                description="WireGuard mesh VPN encrypts all traffic automatically. No exposed ports required."
                delay="delay-300"
              />
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30" />
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <p className="font-mono text-sm text-primary mb-4 opacity-0 animate-fade-in-up">
                // SIMPLICITY
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 opacity-0 animate-fade-in-up delay-100">
                One config. One command.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-up delay-200">
                Define your entire infrastructure in a single YAML file. Deploy
                with{" "}
                <code className="font-mono text-primary">jiji deploy</code>.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 opacity-0 animate-fade-in-up delay-300">
              {/* Config File */}
              <div className="rounded-xl overflow-hidden border border-border/50 bg-card shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground ml-2">
                    .jiji/deploy.yml
                  </span>
                </div>
                <pre className="p-5 text-sm overflow-x-auto font-mono leading-relaxed">
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
                    <Line>    <YamlKey>hosts</YamlKey>: <Val>[web1, web2]</Val></Line>
                    <Line>    <YamlKey>proxy</YamlKey>:</Line>
                    <Line>      <YamlKey>app_port</YamlKey>: <Val>3000</Val></Line>
                    <Line>      <YamlKey>host</YamlKey>: <Val>api.example.com</Val></Line>
                    <Line>      <YamlKey>ssl</YamlKey>: <Val>true</Val></Line>
                  </code>
                </pre>
              </div>

              {/* Terminal */}
              <div className="terminal-window rounded-xl overflow-hidden shadow-2xl">
                <div className="terminal-header flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="font-mono text-xs text-zinc-500 ml-2">
                    Terminal
                  </span>
                </div>
                <pre className="p-5 text-sm overflow-x-auto font-mono text-zinc-300 leading-relaxed">
                  <TerminalLine prompt>jiji server init</TerminalLine>
                  <TerminalLine>Initializing web1... <Success>done</Success></TerminalLine>
                  <TerminalLine>Initializing web2... <Success>done</Success></TerminalLine>
                  <TerminalLine />
                  <TerminalLine prompt>jiji deploy --build</TerminalLine>
                  <TerminalLine>Building api... <Success>done</Success></TerminalLine>
                  <TerminalLine>Pushing to registry... <Success>done</Success></TerminalLine>
                  <TerminalLine>Deploying to web1... <Success>healthy</Success></TerminalLine>
                  <TerminalLine>Deploying to web2... <Success>healthy</Success></TerminalLine>
                  <TerminalLine />
                  <TerminalLine><Success>✓</Success> Deployed myapp-api to 2 servers</TerminalLine>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-mono text-sm text-primary mb-4 opacity-0 animate-fade-in-up">
                // COMPARISON
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 opacity-0 animate-fade-in-up delay-100">
                Why Jiji?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <ComparisonCard
                title="vs. Kubernetes"
                items={[
                  { label: "Learning curve", jiji: "Minutes", other: "Months" },
                  {
                    label: "Config complexity",
                    jiji: "1 file",
                    other: "100+ files",
                  },
                  { label: "Minimum servers", jiji: "1", other: "3+" },
                  {
                    label: "Resource overhead",
                    jiji: "Minimal",
                    other: "High",
                  },
                ]}
              />
              <ComparisonCard
                title="vs. Docker Compose"
                items={[
                  { label: "Multi server", jiji: "Built-in", other: "N/A" },
                  {
                    label: "Zero-downtime",
                    jiji: "Automatic",
                    other: "Manual",
                  },
                  {
                    label: "Service discovery",
                    jiji: "DNS",
                    other: "Single host",
                  },
                  {
                    label: "Health checks",
                    jiji: "Deploy aware",
                    other: "Basic",
                  },
                ]}
              />
              <ComparisonCard
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

        {/* Features Grid */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <p className="font-mono text-sm text-primary mb-4 opacity-0 animate-fade-in-up">
                // FEATURES
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 opacity-0 animate-fade-in-up delay-100">
                Everything included
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-up delay-200">
                Built-in features that would take weeks to set up manually.
              </p>
            </div>

            {/* Core Features */}
            <FeatureCategory title="Core">
              <FeatureCard
                icon={Network}
                title="Private Mesh Network"
                description="WireGuard VPN between all servers. Encrypted by default."
              />
              <FeatureCard
                icon={Globe}
                title="Automatic DNS"
                description="Service discovery via jiji-dns. Access services by name."
              />
              <FeatureCard
                icon={RefreshCw}
                title="Zero-Downtime"
                description="Rolling deploys with health checks. Automatic rollback."
              />
              <FeatureCard
                icon={Container}
                title="Runtime Agnostic"
                description="Docker or Podman. Same config, your choice."
              />
              <FeatureCard
                icon={GitBranch}
                title="Multi Server"
                description="Deploy across servers in parallel. Scale horizontally or vertically."
              />
              <FeatureCard
                icon={Layers}
                title="Multi Project"
                description="Run multiple apps on one server. Perfect for small teams and hobby projects."
              />
            </FeatureCategory>

            {/* Proxy & SSL */}
            <FeatureCategory title="Proxy & SSL">
              <FeatureCard
                icon={Lock}
                title="Auto SSL/TLS"
                description="Automatic HTTPS certificates via kamal-proxy. Zero config."
              />
              <FeatureCard
                icon={Route}
                title="Path-based Routing"
                description="Route traffic based on URL path prefix to different services."
              />
              <FeatureCard
                icon={Sparkles}
                title="Wildcard Domains"
                description="Support for wildcard domain matching like *.example.com."
              />
              <FeatureCard
                icon={Split}
                title="Multi-port Services"
                description="Route multiple ports on single service to different domains."
              />
              <FeatureCard
                icon={Activity}
                title="HTTP Health Checks"
                description="Health checking via HTTP endpoints with configurable paths."
              />
              <FeatureCard
                icon={Terminal}
                title="Command Health Checks"
                description="Custom shell commands for health verification."
              />
              <FeatureCard
                icon={Clock}
                title="Health Check Timing"
                description="Configurable intervals, timeouts, and deploy timeouts."
              />
            </FeatureCategory>

            {/* Build Features */}
            <FeatureCategory title="Build">
              <FeatureCard
                icon={Workflow}
                title="Multi-stage Builds"
                description="Support Docker multi-stage builds with target specification."
              />
              <FeatureCard
                icon={FileCode}
                title="Custom Dockerfile"
                description="Specify non-standard Dockerfile path for builds."
              />
              <FeatureCard
                icon={Settings}
                title="Build Arguments"
                description="Pass build-time arguments (ARGs) to Docker."
              />
              <FeatureCard
                icon={Cloud}
                title="Remote Builds"
                description="Execute builds on remote SSH hosts for faster CI/CD."
              />
              <FeatureCard
                icon={Package}
                title="Build Cache"
                description="Control whether to use Docker layer cache for builds."
              />
            </FeatureCategory>

            {/* Container Configuration */}
            <FeatureCategory title="Container Config">
              <FeatureCard
                icon={Cpu}
                title="Resource Limits"
                description="CPU, memory, GPU limits. Device mapping support."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Privileged Mode"
                description="Run containers with extended privileges when needed."
              />
              <FeatureCard
                icon={Binary}
                title="Linux Capabilities"
                description="Add specific capabilities like SYS_ADMIN, NET_ADMIN."
              />
              <FeatureCard
                icon={Plug}
                title="Device Mappings"
                description="Mount host devices into containers (/dev/video0, /dev/snd)."
              />
              <FeatureCard
                icon={Database}
                title="Named Volumes"
                description="Use Docker named volumes instead of host paths."
              />
              <FeatureCard
                icon={FolderOpen}
                title="File & Directory Mounts"
                description="Mount files/directories with fine grained permissions."
              />
              <FeatureCard
                icon={Play}
                title="Custom Commands"
                description="Override container ENTRYPOINT/CMD as needed."
              />
              <FeatureCard
                icon={RefreshCw}
                title="Restart Policy"
                description="Configure restart behavior (unless-stopped, always, on-failure)."
              />
              <FeatureCard
                icon={Settings}
                title="Network Mode"
                description="Set custom network modes (bridge, host, etc.)."
              />
            </FeatureCategory>

            {/* Deployment Strategies */}
            <FeatureCategory title="Deployment">
              <FeatureCard
                icon={Play}
                title="Rolling Deployments"
                description="Zero-downtime deployments with old container cleanup."
              />
              <FeatureCard
                icon={Pause}
                title="Stop-First Mode"
                description="For stateful services like SQLite - stop old before starting new."
              />
              <FeatureCard
                icon={Activity}
                title="Health Check Rollback"
                description="Automatic rollback on failed health checks."
              />
              <FeatureCard
                icon={Timer}
                title="Image Retention"
                description="Control how many images to keep per service."
              />
              <FeatureCard
                icon={Shield}
                title="Deployment Locks"
                description="Prevent concurrent deploys. Team safe operations."
              />
              <FeatureCard
                icon={Filter}
                title="Service Filtering"
                description="Deploy specific services by name patterns."
              />
            </FeatureCategory>

            {/* SSH & Connections */}
            <FeatureCategory title="SSH & Connections">
              <FeatureCard
                icon={Link2}
                title="SSH Jump Host"
                description="Connect through bastion/intermediate hosts via SSH proxy."
              />
              <FeatureCard
                icon={Key}
                title="Multiple SSH Keys"
                description="Support multiple SSH keys for authentication."
              />
              <FeatureCard
                icon={KeyRound}
                title="Key Passphrase"
                description="Support encrypted SSH keys with passphrases."
              />
              <FeatureCard
                icon={FileText}
                title="SSH Config Support"
                description="Use system SSH config (~/.ssh/config)."
              />
              <FeatureCard
                icon={Users}
                title="Connection Pooling"
                description="Concurrent connection optimization for faster deploys."
              />
              <FeatureCard
                icon={Terminal}
                title="Interactive SSH"
                description="Shell access to servers via jiji server exec."
              />
            </FeatureCategory>

            {/* Environment & Secrets */}
            <FeatureCategory title="Environment & Secrets">
              <FeatureCard
                icon={KeyRound}
                title="Secrets Management"
                description="Reference secrets from .env files securely."
              />
              <FeatureCard
                icon={Share2}
                title="Shared Environment"
                description="Project level env vars inherited by all services."
              />
              <FeatureCard
                icon={FileText}
                title="Multi-environment"
                description="Load different configurations per environment."
              />
              <FeatureCard
                icon={Settings}
                title="Custom Secrets Path"
                description="Specify custom location for .env files."
              />
            </FeatureCategory>

            {/* Network Features */}
            <FeatureCategory title="Network">
              <FeatureCard
                icon={Settings}
                title="Custom Cluster CIDR"
                description="Configure private network IP range (default 10.210.0.0/16)."
              />
              <FeatureCard
                icon={Eye}
                title="Network Inspection"
                description="Query Corrosion database for container details."
              />
              <FeatureCard
                icon={Globe}
                title="DNS Record Viewing"
                description="View all DNS records from the network database."
              />
              <FeatureCard
                icon={Trash2}
                title="Network GC"
                description="Clean up unused network resources automatically."
              />
              <FeatureCard
                icon={Server}
                title="Network Teardown"
                description="Safely remove private networking from servers."
              />
            </FeatureCategory>

            {/* Registry */}
            <FeatureCategory title="Registry">
              <FeatureCard
                icon={HardDrive}
                title="Registry Support"
                description="Built-in local registry or GHCR, Docker Hub, ECR."
              />
              <FeatureCard
                icon={Key}
                title="Registry Login"
                description="Authenticate to remote container registries."
              />
              <FeatureCard
                icon={Settings}
                title="Registry Setup"
                description="Configure local or remote registries easily."
              />
            </FeatureCategory>

            {/* Logging & Monitoring */}
            <FeatureCategory title="Logging & Monitoring">
              <FeatureCard
                icon={Eye}
                title="Centralized Logs"
                description="Fetch logs from services with filtering."
              />
              <FeatureCard
                icon={Filter}
                title="Log Grep"
                description="Filter logs by pattern with grep options."
              />
              <FeatureCard
                icon={Clock}
                title="Time-based Filtering"
                description="Show logs since timestamp or relative time."
              />
              <FeatureCard
                icon={Play}
                title="Log Follow Mode"
                description="Stream logs in real-time like tail -f."
              />
              <FeatureCard
                icon={ScrollText}
                title="Audit Trail"
                description="Complete deployment history with filtering."
              />
              <FeatureCard
                icon={Activity}
                title="Deployment Metrics"
                description="Track deployment timing and success rates."
              />
            </FeatureCategory>

            {/* Operations */}
            <FeatureCategory title="Operations">
              <FeatureCard
                icon={Terminal}
                title="Remote Execution"
                description="Run commands across servers in parallel or sequential."
              />
              <FeatureCard
                icon={RefreshCw}
                title="Service Restart"
                description="Restart services without full redeployment."
              />
              <FeatureCard
                icon={Trash2}
                title="Service Removal"
                description="Clean removal with network unregistration."
              />
              <FeatureCard
                icon={Sparkles}
                title="Image Pruning"
                description="Automatic cleanup of old service images."
              />
              <FeatureCard
                icon={Server}
                title="Server Teardown"
                description="Clean server removal from cluster."
              />
              <FeatureCard
                icon={Hammer}
                title="Auto-install Engine"
                description="Install Docker/Podman automatically on servers."
              />
              <FeatureCard
                icon={Box}
                title="Architecture Support"
                description="Explicitly set server architecture (amd64/arm64)."
              />
            </FeatureCategory>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-mono text-sm text-primary mb-4 opacity-0 animate-fade-in-up">
                // ARCHITECTURE
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 opacity-0 animate-fade-in-up delay-100">
                Three components, zero complexity
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 opacity-0 animate-fade-in-up delay-200">
              <ArchCard
                number="01"
                title="Jiji CLI"
                description="Runs on your machine. Reads config, connects via SSH, orchestrates everything."
                icon={Terminal}
              />
              <ArchCard
                number="02"
                title="Network Stack"
                description="WireGuard mesh VPN. Corrosion state sync. Kamal Proxy for HTTP routing."
                icon={Network}
              />
              <ArchCard
                number="03"
                title="Jiji-dns"
                description="Lightweight DNS for service discovery. Health-aware routing. Real-time updates."
                icon={Globe}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
          <div className="max-w-4xl mx-auto px-6 text-center relative">
            <p className="font-mono text-sm text-primary mb-4 opacity-0 animate-fade-in-up">
              // GET_STARTED
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 opacity-0 animate-fade-in-up delay-100">
              Deploy your first app in 5 minutes
            </h2>
            <p className="text-xl text-muted-foreground mb-10 opacity-0 animate-fade-in-up delay-200">
              Read the quick start guide or dive into the full documentation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up delay-300">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow-sm group h-12 px-8"
                asChild
              >
                <Link href="/docs/getting-started/quick-start">
                  <Terminal className="mr-2 w-4 h-4" />
                  Quick Start
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-foreground h-12 px-8"
                asChild
              >
                <Link href="/docs">
                  <BookOpen className="mr-2 w-4 h-4" />
                  Documentation
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-foreground h-12 px-8"
                asChild
              >
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
      <footer className="border-t border-border/50 py-12 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Image
                src="/jiji_logo.svg"
                alt="Jiji"
                width={60}
                height={24}
                className="h-6 w-auto opacity-70"
              />
              <span className="text-sm text-muted-foreground font-mono">
                // open source container orchestration
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
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <DiscordIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com/acidtib/jiji"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/30 flex justify-between items-center text-sm text-muted-foreground">
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

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
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
  const command = "curl -fsSL https://get.jiji.run/install.sh | sh";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-3 bg-zinc-950/80 backdrop-blur text-zinc-300 pl-5 pr-3 py-3 rounded-xl font-mono text-sm border border-zinc-800/50 group hover:border-primary/30 transition-colors">
      <span className="text-primary">$</span>
      <code className="flex-1">{command}</code>
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg text-zinc-500 hover:text-primary hover:bg-white/5 transition-all"
        title="Copy to clipboard"
      >
        {copied
          ? <Check className="w-4 h-4 text-primary" />
          : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

function NetworkVisualization() {
  // Node positions for connection lines (percentages)
  // Top row: 3 nodes in grid-cols-3 (centers at 1/6, 3/6, 5/6)
  const top1 = { x: 16.67, y: 32 };
  const top2 = { x: 50, y: 32 };
  const top3 = { x: 83.33, y: 32 };
  // Bottom row: 2 nodes in grid-cols-4 at positions 2 and 3 (centers at 3/8 and 5/8)
  const bot1 = { x: 37.5, y: 58 };
  const bot2 = { x: 62.5, y: 58 };

  return (
    <div className="relative bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-8 md:p-12 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 mesh-bg-dense opacity-30" />

      {/* SVG Connection Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(142 71% 45% / 0.2)" />
            <stop offset="50%" stopColor="hsl(142 71% 45% / 0.5)" />
            <stop offset="100%" stopColor="hsl(142 71% 45% / 0.2)" />
          </linearGradient>
        </defs>
        {/* Top row connections */}
        <line
          x1={`${top1.x}%`}
          y1={`${top1.y}%`}
          x2={`${top2.x}%`}
          y2={`${top2.y}%`}
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <line
          x1={`${top2.x}%`}
          y1={`${top2.y}%`}
          x2={`${top3.x}%`}
          y2={`${top3.y}%`}
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        {/* Cross connections to bottom row */}
        <line
          x1={`${top1.x}%`}
          y1={`${top1.y}%`}
          x2={`${bot1.x}%`}
          y2={`${bot1.y}%`}
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <line
          x1={`${top2.x}%`}
          y1={`${top2.y}%`}
          x2={`${bot1.x}%`}
          y2={`${bot1.y}%`}
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <line
          x1={`${top2.x}%`}
          y1={`${top2.y}%`}
          x2={`${bot2.x}%`}
          y2={`${bot2.y}%`}
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <line
          x1={`${top3.x}%`}
          y1={`${top3.y}%`}
          x2={`${bot2.x}%`}
          y2={`${bot2.y}%`}
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        {/* Bottom row connection */}
        <line
          x1={`${bot1.x}%`}
          y1={`${bot1.y}%`}
          x2={`${bot2.x}%`}
          y2={`${bot2.y}%`}
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
      </svg>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Title */}
        <div className="text-center mb-10">
          <p className="font-mono text-xs text-primary mb-2">
            NETWORK_TOPOLOGY
          </p>
          <h3 className="text-xl font-semibold">Multi cloud, unified mesh</h3>
        </div>

        {/* Nodes */}
        <div className="grid grid-cols-3 gap-6 md:gap-12 mb-10">
          <ServerNode
            name="web1"
            provider="AWS"
            ip="10.210.0.1"
            status="healthy"
            delay={0}
          />
          <ServerNode
            name="api"
            provider="Hetzner"
            ip="10.210.1.1"
            status="healthy"
            delay={100}
          />
          <ServerNode
            name="worker"
            provider="DigitalOcean"
            ip="10.210.2.1"
            status="healthy"
            delay={200}
          />
        </div>
        {/* Bottom row uses grid-cols-4 with empty outer columns for consistent percentage alignment */}
        <div className="grid grid-cols-4 gap-6 md:gap-12">
          <div />
          <ServerNode
            name="db"
            provider="Bare Metal"
            ip="10.210.3.1"
            status="healthy"
            delay={300}
          />
          <ServerNode
            name="cache"
            provider="Vultr"
            ip="10.210.4.1"
            status="healthy"
            delay={400}
          />
          <div />
        </div>

        {/* Legend */}
        <div className="mt-10 pt-8 border-t border-border/30 flex flex-wrap justify-center gap-6 md:gap-10">
          <LegendItem icon={Shield} color="text-green-400" label="WireGuard" />
          <LegendItem
            icon={Globe}
            color="text-blue-400"
            label="Jiji-dns Discovery"
          />
          <LegendItem
            icon={Network}
            color="text-purple-400"
            label="10.210.0.0/16 Mesh"
          />
        </div>
      </div>
    </div>
  );
}

function ServerNode({ name, provider, ip, status, delay = 0 }) {
  return (
    <div
      className="flex flex-col items-center opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="relative group">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-muted/80 border border-border/50 flex items-center justify-center transition-all group-hover:border-primary/50 group-hover:bg-muted">
          <Server className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-node-pulse" />
      </div>
      <span className="font-mono text-sm font-medium mt-3">{name}</span>
      <span className="text-xs text-muted-foreground">{provider}</span>
      <span className="font-mono text-xs text-primary/60">{ip}</span>
    </div>
  );
}

function LegendItem({ icon: Icon, color, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className={`w-4 h-4 ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function BenefitCard({ icon: Icon, title, description, delay }) {
  return (
    <div
      className={`p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur opacity-0 animate-fade-in-up ${delay}`}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function ComparisonCard({ title, items }) {
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 opacity-0 animate-fade-in-up">
      <CardContent className="p-6">
        <h3 className="font-mono text-sm text-primary mb-5">{title}</h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="font-medium text-primary">{item.jiji}</span>
                <span className="text-muted-foreground/40 text-xs">vs</span>
                <span className="text-muted-foreground/60">{item.other}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCategory({ title, children }) {
  return (
    <div className="mb-12 last:mb-0">
      <h3 className="font-mono text-sm text-primary mb-6 opacity-0 animate-fade-in-up">
        // {title.toUpperCase().replace(/ /g, "_")}
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="feature-card p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur group">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-0.5">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ArchCard({ number, title, description, icon: Icon }) {
  return (
    <div className="relative p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur group hover:border-primary/30 transition-colors">
      <span className="absolute top-4 right-4 font-mono text-4xl font-bold text-muted/20 group-hover:text-primary/20 transition-colors">
        {number}
      </span>
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

// Code syntax highlighting components
function Line({ children }) {
  return <div className="min-h-[1.5em]">{children}</div>;
}

function YamlKey({ children }) {
  return <span className="text-cyan-400">{children}</span>;
}

function Val({ children }) {
  return <span className="text-amber-300">{children}</span>;
}

function TerminalLine({ children, prompt, comment }) {
  if (comment) {
    return <div className="text-zinc-600">{children}</div>;
  }
  return (
    <div className="min-h-[1.5em]">
      {prompt && <span className="text-primary">$</span>}
      {children}
    </div>
  );
}

function Success({ children }) {
  return <span className="text-green-400">{children}</span>;
}

function DiscordIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
