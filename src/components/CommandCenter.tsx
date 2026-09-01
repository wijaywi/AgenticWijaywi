"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { registerWebMCPTools } from "@/lib/webmcp/registerTools";
import { ShieldAlert, Database, Cpu, Activity, AlertTriangle, CheckCircle, Search, HelpCircle, Server } from "lucide-react";

export default function CommandCenter() {
  const { worldState, agentActions, resetState, fetchState } = useStore();
  const [webmcpAvailable, setWebmcpAvailable] = useState(false);

  useEffect(() => {
    fetchState();
    // Attempt registration on mount
    const initWebMCP = async () => {
      const isAvailable = await registerWebMCPTools();
      setWebmcpAvailable(isAvailable);
    };
    initWebMCP();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 font-mono selection:bg-indigo-900">
      <header className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400 flex items-center gap-2">
            <Database className="w-6 h-6" />
            Wijaywi Web Agent Reliability Lab
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Epistemic Command Center</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end border border-neutral-800 p-2 rounded bg-neutral-900">
            <span className="text-xs text-neutral-500 uppercase tracking-widest">WebMCP Status</span>
            {webmcpAvailable ? (
              <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> AVAILABLE
              </span>
            ) : (
              <span className="text-amber-500 text-sm font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> UNAVAILABLE
              </span>
            )}
          </div>
          <button 
            onClick={resetState}
            className="px-3 py-1 bg-red-900/30 text-red-400 border border-red-900 rounded hover:bg-red-900/50 transition-colors text-sm"
          >
            Reset World State
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
        {/* LEFT: Objective & World State */}
        <div className="col-span-3 border border-neutral-800 rounded bg-neutral-900/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-neutral-800 bg-neutral-900 font-bold text-sm tracking-widest text-neutral-300">
            WORLD STATE
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            <section>
              <h3 className="text-xs text-neutral-500 uppercase mb-2">Current Objective</h3>
              {worldState.objective ? (
                <div className="p-3 border border-indigo-900/50 bg-indigo-950/20 rounded">
                  <div className="font-bold text-indigo-300">{worldState.objective.title}</div>
                  <div className="text-xs text-neutral-400 mt-1">{worldState.objective.description}</div>
                  <div className="mt-2 text-[10px] bg-indigo-900/50 text-indigo-200 inline-block px-1.5 py-0.5 rounded uppercase">
                    PRIORITY: {worldState.objective.priority}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-neutral-600 italic">No objective set.</div>
              )}
            </section>
            
            <section>
              <h3 className="text-xs text-neutral-500 uppercase mb-2">Governance Constraints</h3>
              <ul className="space-y-2">
                {worldState.governanceConstraints.map((c, i) => (
                  <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                    <ShieldAlert className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </section>
            
            <section>
              <h3 className="text-xs text-neutral-500 uppercase mb-2">Current Beliefs</h3>
              {worldState.currentBeliefs.length > 0 ? (
                <div className="space-y-3">
                  {worldState.currentBeliefs.map(b => (
                    <div key={b.id} className="p-2 border border-neutral-800 rounded bg-neutral-950">
                      <div className="text-sm">{b.claim}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 flex-1 bg-neutral-800 rounded overflow-hidden">
                          <div 
                            className={`h-full ${b.confidence > 0.7 ? 'bg-emerald-500' : b.confidence > 0.4 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${b.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-500">{(b.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-neutral-600 italic">No established beliefs.</div>
              )}
            </section>
          </div>
        </div>

        {/* CENTER: Hypothesis Graph & Epistemic Engine */}
        <div className="col-span-5 border border-neutral-800 rounded bg-neutral-900/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-neutral-800 bg-neutral-900 font-bold text-sm tracking-widest text-neutral-300 flex justify-between items-center">
            <span>HYPOTHESIS LEDGER</span>
            <Activity className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {worldState.activeHypotheses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-600">
                <Search className="w-8 h-8 mb-2 opacity-50" />
                <p>No active hypotheses.</p>
                <p className="text-xs mt-1">Waiting for Synthesizer agent...</p>
              </div>
            ) : (
              worldState.activeHypotheses.map(h => (
                <div key={h.id} className="border border-neutral-700 rounded bg-neutral-900 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-neutral-200">{h.claim}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold
                      ${h.status === 'CONFIRMED' ? 'bg-emerald-900/50 text-emerald-400' : 
                        h.status === 'DISPROVEN' ? 'bg-red-900/50 text-red-400' : 
                        'bg-amber-900/50 text-amber-400'}`}
                    >
                      {h.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mb-4">{h.rationale}</div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase mb-1">Confidence</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-light text-neutral-300">{(h.current_confidence * 100).toFixed(0)}%</div>
                        {h.current_confidence !== h.initial_confidence && (
                          <div className="text-xs text-neutral-500 line-through">{(h.initial_confidence * 100).toFixed(0)}%</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase mb-1">Assumptions</div>
                      <div className="text-xs text-neutral-400">{h.assumptions.length} listed</div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-3 mt-3 text-xs text-neutral-500 font-mono">
                    ID: {h.id.split('-')[0]}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Agent Activity */}
        <div className="col-span-4 border border-neutral-800 rounded bg-neutral-900/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-neutral-800 bg-neutral-900 font-bold text-sm tracking-widest text-neutral-300 flex justify-between items-center">
            <span>AGENT ACTIVITY LOG</span>
            <Cpu className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="p-0 flex-1 overflow-y-auto">
            {agentActions.length === 0 ? (
              <div className="p-4 text-sm text-neutral-600 italic text-center mt-10">
                Awaiting agent connection via WebMCP...
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {agentActions.map((action, i) => (
                  <div key={action.id} className="p-3 hover:bg-neutral-800/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs font-bold text-indigo-400">{action.agent}</div>
                      <div className="text-[10px] text-neutral-500">{new Date(action.timestamp).toLocaleTimeString()}</div>
                    </div>
                    <div className="text-sm text-neutral-300 font-mono mb-2">
                      <span className="text-neutral-500">$</span> {action.tool}
                    </div>
                    <div className="text-xs text-neutral-400 bg-neutral-950 p-2 rounded border border-neutral-900 mb-2 font-mono whitespace-pre-wrap">
                      {action.reason}
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                        COST: {action.cost.toFixed(2)}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded
                        ${action.permission === 'READ' ? 'bg-blue-900/30 text-blue-400' : 
                          action.permission === 'EXECUTE_SANDBOX' ? 'bg-amber-900/30 text-amber-400' :
                          'bg-red-900/30 text-red-400'}`}
                      >
                        {action.permission}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
