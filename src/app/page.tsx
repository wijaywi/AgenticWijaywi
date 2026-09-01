import Link from "next/link";
import { ArrowRight, Terminal, Shield, Workflow } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-900">
      <main className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <div className="inline-block border border-indigo-900/50 bg-indigo-950/20 text-indigo-400 px-3 py-1 text-sm rounded-full mb-8 font-mono">
          Agentic Wijaywi Architecture
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
          AI agents can act on the web.
        </h1>
        
        <p className="text-xl text-neutral-400 max-w-3xl mb-12 leading-relaxed">
          Wijaywi gives humans and agents a shared world model, evidence ledger, uncertainty engine, and verified action loop through native WebMCP integration.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          <Link href="/lab" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded font-bold transition-colors flex items-center justify-center gap-2">
            Launch Reliability Lab <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/demo" className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-4 rounded font-bold transition-colors flex items-center justify-center gap-2">
            Run Demo Scenario
          </Link>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 border border-neutral-800 rounded bg-neutral-900/50">
            <Terminal className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">WebMCP Native</h3>
            <p className="text-neutral-400 text-sm">Agents interact directly with the DOM via <code>document.modelContext.registerTool</code>. No blind UI scraping required.</p>
          </div>
          <div className="p-6 border border-neutral-800 rounded bg-neutral-900/50">
            <Workflow className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Epistemic Engine</h3>
            <p className="text-neutral-400 text-sm">Every action requires a hypothesis. Every claim requires evidence. The falsifier agent tries to destroy beliefs to prevent confirmation bias.</p>
          </div>
          <div className="p-6 border border-neutral-800 rounded bg-neutral-900/50">
            <Shield className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Human on the Loop</h3>
            <p className="text-neutral-400 text-sm">Strict permission boundaries. Production mutations automatically escalate to the command center with full epistemic provenance.</p>
          </div>
        </div>

        {/* Visual Pipeline */}
        <div className="mt-32 w-full">
          <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-8 font-mono">The Verification Loop</h3>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400">
            <span className="px-3 py-1 border border-neutral-800 rounded">OBJECTIVE</span>
            <ArrowRight className="w-4 h-4 opacity-50" />
            <span className="px-3 py-1 border border-neutral-800 rounded">WORLD MODEL</span>
            <ArrowRight className="w-4 h-4 opacity-50" />
            <span className="px-3 py-1 border border-neutral-800 rounded">HYPOTHESIS</span>
            <ArrowRight className="w-4 h-4 opacity-50" />
            <span className="px-3 py-1 border border-neutral-800 rounded bg-indigo-950/20 text-indigo-300">EXPERIMENT</span>
            <ArrowRight className="w-4 h-4 opacity-50" />
            <span className="px-3 py-1 border border-neutral-800 rounded">EVIDENCE</span>
            <ArrowRight className="w-4 h-4 opacity-50" />
            <span className="px-3 py-1 border border-red-900/30 rounded text-red-400 bg-red-950/20">FALSIFICATION</span>
            <ArrowRight className="w-4 h-4 opacity-50" />
            <span className="px-3 py-1 border border-neutral-800 rounded">BELIEF UPDATE</span>
          </div>
        </div>
      </main>
    </div>
  );
}
