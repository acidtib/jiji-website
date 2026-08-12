import React, { useState } from 'react';
import { Server, Cpu, HardDrive, Database, FileCode, Activity, CheckCircle2, AlertTriangle, Play, Layers, Shield } from 'lucide-react';
import { INITIAL_NODES } from '../data/content';

const PROJECT_CONFIG_YAML = `project: myapp

servers:
  web1:
    host: web1.example.com
  web2:
    host: web2.example.com
  app1:
    host: app1.example.com
  data1:
    host: data1.example.com

services:
  api:
    image: registry.example.com/myapp:8f31c2a
    servers:
      - web1
      - web2
    replicas: 2
    ports:
      - "3000"
    proxy:
      port: 3000
      hosts:
        - api.example.com
      ssl: true
      healthcheck:
        path: /health
        interval: 10s

  worker:
    image: registry.example.com/worker:8f31c2a
    servers:
      - app1

  database:
    image: postgres:16-alpine
    servers:
      - data1
    volumes:
      - "/data/postgres:/var/lib/postgresql/data"`;

export const DashboardShowcase: React.FC = () => {
  const nodes = INITIAL_NODES;
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-01');
  const [activeTab, setActiveTab] = useState<'containers' | 'compose'>('containers');
  const [selectedContainerId, setSelectedContainerId] = useState<string>('c-101');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const totalContainers = nodes.reduce((sum, node) => sum + node.containers.length, 0);

  return (
    <section id="topology" className="py-20 bg-[#060806] relative overflow-hidden border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold uppercase text-white tracking-tight">
            ONE PRIVATE NETWORK. <span className="text-lime-400">EVERY SERVER.</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-300 font-sans">
            Add servers wherever you need them across cloud providers, datacenters, or your own hardware. Jiji connects them with private networking and service discovery, so your applications can communicate across machines by name.
          </p>
          <p className="mt-2 text-sm sm:text-base text-zinc-300 font-sans">Below is an example of how a multi-server Jiji deployment can fit together.</p>
        </div>

        {/* Dashboard Shell Container */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0a0d0a] shadow-2xl overflow-hidden font-mono text-xs text-zinc-200 green-border-glow">
          {/* Top Control Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-950 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-lime-400 font-bold">
                <Server className="w-4 h-4" />
                <span>JIJI CLUSTER</span>
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setActiveTab('containers')}
                className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'containers' ? 'bg-lime-950 text-lime-400 border border-lime-500/40 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Containers</span>
              </button>

              <button
                onClick={() => setActiveTab('compose')}
                className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'compose' ? 'bg-lime-950 text-lime-400 border border-lime-500/40 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Config</span>
              </button>
            </div>
          </div>

          {/* Main Dashboard Layout: Left Nodes Grid + Right Detail Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Left Column: Server Nodes Selector (Matching screenshot 4 boxes) */}
            <div className="lg:col-span-5 p-4 border-r border-zinc-800/80 bg-[#070907] space-y-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-500 uppercase tracking-wider font-bold mb-1">
                <span>SELECT SERVER NODE</span>
                <span className="text-lime-400">4 HOSTS ONLINE</span>
              </div>

              {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      if (node.containers.length > 0) {
                        setSelectedContainerId(node.containers[0].id);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-lime-950/30 border-lime-500/60 shadow-lg shadow-lime-950/50'
                        : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{node.flag}</span>
                        <span className="font-bold text-white text-sm">{node.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-zinc-950 text-lime-400 border border-zinc-800 text-[10px] font-bold">
                        {node.provider}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mb-3">
                      <span>IP: {node.ip}</span>
                      <span>•</span>
                      <span>{node.location}</span>
                    </div>

                    {/* Gauges */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/60 text-[10px]">
                      <div>
                        <div className="flex justify-between text-zinc-400 mb-1">
                          <span>CPU</span>
                          <span className="text-lime-400 font-bold">{node.cpu}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-lime-400 rounded-full"
                            style={{ width: `${node.cpu}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-zinc-400 mb-1">
                          <span>RAM</span>
                          <span className="text-lime-400 font-bold">{node.ramUsed}GB</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-lime-400 rounded-full"
                            style={{ width: `${(node.ramUsed / node.ramTotal) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-zinc-400 mb-1">
                          <span>CONTAINERS</span>
                          <span className="text-white font-bold">{node.containers.length}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min((node.containers.length / 4) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Active View (Containers / Logs / Compose) */}
            <div className="lg:col-span-7 p-5 bg-[#0a0d0a] flex flex-col justify-between">
              {/* Active Tab Content */}
              {activeTab === 'containers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{selectedNode.name} Containers</span>
                        <span className="text-xs text-lime-400 font-normal">({selectedNode.containers.length} active)</span>
                      </h3>
                      <p className="text-zinc-400 text-[11px] font-sans">
                        Tracked in the project's service catalog, reachable by name from any server
                      </p>
                    </div>
                  </div>

                  {/* Containers List */}
                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {selectedNode.containers.map((container) => (
                      <div
                        key={container.id}
                        onClick={() => setSelectedContainerId(container.id)}
                        className={`p-3.5 rounded-lg border transition ${
                          selectedContainerId === container.id
                            ? 'bg-zinc-900 border-lime-500/50'
                            : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                container.status === 'running'
                                  ? 'bg-lime-400 animate-pulse'
                                  : container.status === 'restarting'
                                  ? 'bg-yellow-400 animate-spin'
                                  : 'bg-zinc-600'
                              }`}
                            ></span>
                            <div>
                              <span className="font-bold text-white text-sm">{container.name}</span>
                              <div className="text-[11px] text-zinc-400 font-mono">
                                Image: <span className="text-zinc-300">{container.image}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {container.ssl && (
                              <span className="px-2 py-0.5 rounded bg-lime-950 text-lime-400 border border-lime-800 text-[10px]">
                                HTTPS SSL
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                              {container.port}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                          <span>CPU: <strong className="text-lime-400">{container.cpu}</strong></span>
                          <span>RAM: <strong className="text-lime-400">{container.ram}</strong></span>
                          <span>Uptime: <strong className="text-zinc-200">{container.uptime}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'compose' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <FileCode className="w-4 h-4 text-lime-400" />
                    <span className="font-bold text-white">
                      .jiji/deploy.yml
                    </span>
                  </div>

                  <pre className="bg-[#050705] border border-zinc-800 rounded-lg p-3 font-mono text-[11px] text-lime-300 max-h-[475px] overflow-y-auto">
                    {PROJECT_CONFIG_YAML}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Summary Bar (Matching image metrics line) */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
            <div className="flex items-center gap-6">
              <div>
                NODES: <strong className="text-white">{nodes.length}</strong>
              </div>
              <div>
                CONTAINERS: <strong className="text-lime-400">{totalContainers} ACTIVE</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-lime-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>ALL PROBES HEALTHY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
