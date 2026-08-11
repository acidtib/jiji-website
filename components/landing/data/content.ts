import { ServerNode, FaqItem, FeatureCardItem } from '../types';

export const INITIAL_NODES: ServerNode[] = [
  {
    id: 'node-01',
    name: 'web1',
    provider: 'Hetzner Cloud',
    location: 'Ashburn, VA',
    flag: '🇺🇸',
    ip: '100.81.200.10',
    cpu: 18,
    ramUsed: 4.8,
    ramTotal: 32,
    diskUsed: 42,
    diskTotal: 500,
    containersCount: 4,
    status: 'healthy',
    containers: [
      {
        id: 'c-101',
        name: 'jiji-proxy',
        image: 'jiji/proxy:v2.4.0',
        port: '443:3000',
        status: 'running',
        cpu: '1.4%',
        ram: '64 MB',
        uptime: '14d 6h',
        ssl: true,
        logs: [
          '[jiji-proxy] Automatic Let\'s Encrypt TLS certificate issued for api.example.com',
          '[jiji-proxy] Routing GET /v1/health -> Candidate container (myapp-api.jiji)',
          '[jiji-proxy] Health-gated traffic switch completed in 542ms'
        ]
      },
      {
        id: 'c-102',
        name: 'myapp-api-primary',
        image: 'registry.example.com/myapp:8f31c2a',
        port: '3000:3000',
        status: 'running',
        cpu: '3.2%',
        ram: '180 MB',
        uptime: '14d 6h',
        ssl: true,
        logs: [
          '[myapp-api] Server listening on 0.0.0.0:3000',
          '[myapp-api] Registered in service catalog as myapp-api.jiji',
          '[myapp-api] Health probe GET /health responded 200 OK (2ms)'
        ]
      }
    ]
  },
  {
    id: 'node-02',
    name: 'web2',
    provider: 'DigitalOcean',
    location: 'Frankfurt, DE',
    flag: '🇩🇪',
    ip: '100.81.200.11',
    cpu: 24,
    ramUsed: 3.2,
    ramTotal: 16,
    diskUsed: 28,
    diskTotal: 160,
    containersCount: 3,
    status: 'healthy',
    containers: [
      {
        id: 'c-201',
        name: 'myapp-api-secondary',
        image: 'registry.example.com/myapp:8f31c2a',
        port: '3000:3000',
        status: 'running',
        cpu: '2.8%',
        ram: '175 MB',
        uptime: '14d 6h',
        ssl: true,
        logs: [
          '[myapp-api] Discoverable at myapp-api.jiji from any server',
          '[myapp-api] Health check passed: 200 OK'
        ]
      }
    ]
  },
  {
    id: 'node-03',
    name: 'app1',
    provider: 'AWS EC2',
    location: 'Singapore, SG',
    flag: '🇸🇬',
    ip: '100.81.200.20',
    cpu: 12,
    ramUsed: 1.4,
    ramTotal: 8,
    diskUsed: 18,
    diskTotal: 80,
    containersCount: 2,
    status: 'healthy',
    containers: [
      {
        id: 'c-301',
        name: 'worker-service',
        image: 'registry.example.com/worker:8f31c2a',
        port: '8080:8080',
        status: 'running',
        cpu: '1.2%',
        ram: '98 MB',
        uptime: '30d 1h',
        ssl: false,
        logs: [
          '[worker] Connected to myapp-database.jiji:5432',
          '[worker] Processing scheduled cron tasks...'
        ]
      }
    ]
  },
  {
    id: 'node-04',
    name: 'data1',
    provider: 'Bare Metal',
    location: 'Nuremberg, DE',
    flag: '🇩🇪',
    ip: '100.81.200.30',
    cpu: 38,
    ramUsed: 12.4,
    ramTotal: 64,
    diskUsed: 180,
    diskTotal: 1000,
    containersCount: 2,
    status: 'healthy',
    containers: [
      {
        id: 'c-401',
        name: 'postgres-primary',
        image: 'postgres:16-alpine',
        port: '5432:5432',
        status: 'running',
        cpu: '18.4%',
        ram: '4.2 GB',
        uptime: '60d 12h',
        ssl: true,
        logs: [
          '[postgres] Accepting connections on the private project network',
          '[postgres] WAL replication sync active'
        ]
      }
    ]
  }
];

export const TOP_FEATURE_CARDS: FeatureCardItem[] = [
  {
    id: 'f-1',
    title: 'BRING YOUR LINUX SERVERS',
    badge: 'SSH & ROOT/SUDO',
    description: 'Deploy to supported Linux cloud VMs, bare metal, home labs, or across providers using SSH and root or sudo access.',
    details: 'Connect AWS, Hetzner, DigitalOcean, OVHcloud, or your own bare metal hardware over standard SSH without installing complex Kubernetes clusters.',
    iconName: 'Server',
    techSpecs: ['AWS / Hetzner / DigitalOcean / Bare Metal', 'Standard SSH authentication', 'Docker or Podman engine support', 'Zero PaaS overhead']
  },
  {
    id: 'f-2',
    title: 'KEEP COSTS PREDICTABLE',
    badge: 'DIRECT BILLING',
    description: 'Pay infrastructure providers directly and scale on your terms. Your deployment workflow stays the same as servers and traffic grow.',
    details: 'Because Jiji is a free open-source CLI, you pay $0 in vendor markup fees or managed cluster subscriptions.',
    iconName: 'DollarSign',
    techSpecs: ['Direct provider billing', '100% Open source (MIT)', 'Identical workflow at any scale', 'No per-container tax']
  },
  {
    id: 'f-3',
    title: 'PRIVATE BY DEFAULT',
    badge: 'ENCRYPTED MESH',
    description: 'Jiji connects servers with an encrypted WireGuard network and private DNS. Service-to-service and proxy-to-backend traffic uses the mesh.',
    details: 'Encrypted communication between nodes across any provider without exposing backend database ports to the open internet.',
    iconName: 'ShieldCheck',
    techSpecs: ['Encrypted WireGuard mesh', 'Private DNS resolution', 'Minimal exposure surface', 'Secrets never appear in commands or logs']
  }
];

export const DEEP_DIVE_FEATURES: FeatureCardItem[] = [
  {
    id: 'dd-1',
    title: 'AUTO SSL / TLS',
    badge: '01/06 INGRESS',
    description: 'Issue and renew HTTPS certificates automatically through jiji-proxy without manual Caddy or Nginx boilerplate.',
    details: 'Define domain hosts in `.jiji/deploy.yml` with `ssl: true` and jiji-proxy manages certificate issuance via Let\'s Encrypt.',
    iconName: 'GitBranch'
  },
  {
    id: 'dd-2',
    title: 'FAIL-SAFE HEALTH CHECKS',
    badge: '02/06 ROLLOUT',
    description: 'Discard failed candidate containers while the currently healthy version keeps serving live production traffic.',
    details: 'Jiji probes HTTP/TCP endpoints before switching proxy routes. If a candidate fails, the rollout stops and the previous version is never touched.',
    iconName: 'Activity'
  },
  {
    id: 'dd-3',
    title: 'SECRETS MANAGEMENT',
    badge: '03/06 SECURITY',
    description: 'Load secrets from environment files without logging them or placing sensitive tokens in command strings.',
    details: 'Keep production credentials out of your shell history and process list. Secrets are staged into containers as files, never as command-line arguments.',
    iconName: 'Key'
  },
  {
    id: 'dd-4',
    title: 'ANY REGISTRY',
    badge: '04/06 IMAGES',
    description: 'Use a standard container registry (GHCR, Docker Hub, ECR, GCP Artifact Registry) or tunnel a local registry directly over SSH.',
    details: 'Build container images locally on your machine or CI runner and push directly to your servers or any container registry.',
    iconName: 'Database'
  },
  {
    id: 'dd-5',
    title: 'AUDIT TRAIL',
    badge: '05/06 VISIBILITY',
    description: 'Inspect deployment history and stream application logs in real time across your server fleet.',
    details: 'Command `jiji service logs` streams live logs from any service across hosts, while `jiji audit` and `jiji network diagnostics` show deployment history and current state.',
    iconName: 'Network'
  },
  {
    id: 'dd-6',
    title: 'SCHEDULED JOBS',
    badge: '06/06 AUTOMATION',
    description: 'Run service commands on a cron schedule in isolated containers with durable execution status and log history.',
    details: 'Execute database cleanups, search index updates, or report generation in background containers scheduled in deploy config.',
    iconName: 'Layers'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Architecture',
    question: 'WHERE DOES JIJI RUN?',
    answer: 'The Jiji CLI runs on your machine or CI runner. It connects over SSH to the selected servers and any hosts that own affected state, applies the deployment, and exits. A per-project jiji-agent remains on each server to maintain networking, DNS, and service state, while jiji-proxy handles configured ingress.',
    codeSnippet: '# Execute from your local machine or GitHub Actions / GitLab CI\n$ jiji deploy --build'
  },
  {
    id: 'faq-2',
    category: 'Rollbacks',
    question: 'WHAT HAPPENS IF A ROLLOUT FAILS?',
    answer: 'Jiji evaluates candidate health probes before routing live traffic. If candidate containers fail to start or pass health checks, the CLI discards the failed containers, reports the failure details, and leaves the currently healthy deployment serving traffic without interruption.',
    codeSnippet: '03 Start candidates [ROLLOUT ACROSS 2 SERVERS] ... FAILED\nHealth probe GET /health failed (500 Internal Server Error)\n✓ Rolled back automatically. Previous healthy release active.'
  },
  {
    id: 'faq-3',
    category: 'Infrastructure',
    question: 'CAN ONE PROJECT SPAN PROVIDERS?',
    answer: 'Yes. Jiji\'s private networking connects every server automatically, so you can mix AWS EC2, Hetzner Cloud, DigitalOcean, bare metal, or home lab servers in a single project. Services reach each other by name across providers as if on one private network.',
    codeSnippet: '# .jiji/deploy.yml\nservers:\n  web1: { host: aws-us-east.example.com }\n  web2: { host: hetzner-eu.example.com }'
  },
  {
    id: 'faq-4',
    category: 'Registries',
    question: 'WHICH CONTAINER REGISTRIES CAN I USE?',
    answer: 'You can use any standard container registry (GitHub Container Registry, Docker Hub, AWS ECR, GCP Artifact Registry, or a self-hosted registry) or tunnel a local image registry directly over SSH during build.',
    codeSnippet: 'services:\n  api:\n    image: ghcr.io/myorg/myapp-api:latest'
  },
  {
    id: 'faq-5',
    category: 'Open Source',
    question: 'IS JIJI AN ONLINE SERVICE OR A CLI TOOL?',
    answer: 'JIJI is a 100% open-source CLI tool (MIT Licensed), NOT an online subscription service or SaaS. You run `jiji` from your own terminal or CI runner. There are no monthly control plane subscription fees, third-party accounts, or tracking.',
    codeSnippet: '# Open source repository:\nhttps://github.com/acidtib/jiji'
  }
];
