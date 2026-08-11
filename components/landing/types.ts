export interface MeshServer {
  id: string;
  name: string;
  provider: string;
  ip: string;
  wgIp: string;
  status: 'healthy' | 'warning' | 'deploying';
  services: {
    name: string;
    domain: string;
    wgIp: string;
    status: 'HEALTHY' | 'DEPLOYING' | 'OFFLINE';
  }[];
}

export interface ContainerItem {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'restarting' | 'stopped';
  port: string;
  cpu: string;
  ram: string;
  uptime: string;
  ssl: boolean;
  logs?: string[];
}

export interface ServerNode {
  id: string;
  name: string;
  flag: string;
  provider: string;
  ip: string;
  location: string;
  cpu: number;
  ramUsed: number;
  ramTotal: number;
  diskUsed?: number;
  diskTotal?: number;
  status?: string;
  containersCount: number;
  containers: ContainerItem[];
}

export interface FeatureCardItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  iconName: string;
  details?: string;
}

export interface LiveTrafficLog {
  id: string;
  timestamp: string;
  source: string;
  status: number | string;
  latency: string;
  method: string;
  target: string;
}

export interface FaqItem {
  id: string;
  num?: string;
  category: string;
  question: string;
  answer: string;
  codeSnippet?: string;
}

export interface ProductionToolCard {
  id: string;
  num: string;
  category: string;
  title: string;
  description: string;
  iconName: string;
}

