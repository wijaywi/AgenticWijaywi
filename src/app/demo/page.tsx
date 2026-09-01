"use client";

import { useEffect, useState } from "react";
import CommandCenter from "@/components/CommandCenter";
import { useStore } from "@/store/useStore";
import { v4 as uuidv4 } from "uuid";
import { AlertCircle } from "lucide-react";

export default function DemoPage() {
  const [running, setRunning] = useState(false);
  const { 
    setObjective, addHypothesis, addEvidence, addExperiment, updateBelief, logAction, resetState 
  } = useStore();

  const runSimulation = async () => {
    setRunning(true);
    resetState();

    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Step 1: Create objective
    await wait(1000);
    const objId = uuidv4();
    setObjective({
      id: objId,
      title: "Identify cause of authentication regression in production",
      description: "Users are experiencing random disconnects after 5 minutes of inactivity.",
      priority: "critical",
      createdAt: new Date().toISOString(),
      status: "active"
    });
    logAction({
      id: uuidv4(), timestamp: new Date().toISOString(), agent: "Synthesizer",
      action: "create_objective", tool: "create_objective", input: '{"title":"Identify cause of authentication regression..."}',
      reason: "Establish investigation goal.", cost: 0.1, permission: "ANALYZE"
    });

    // Step 2: Propose hypothesis
    await wait(2000);
    const hypId = uuidv4();
    addHypothesis({
      id: hypId,
      claim: "Session timeout configuration was altered in the latest deployment.",
      assumptions: ["Deployments modify config", "Timeout is set in environment vars"],
      expected_observations: ["Config history shows changes to SESSION_TIMEOUT"],
      counterfactual: "If not config, then it must be a network middleware issue.",
      initial_confidence: 0.8,
      current_confidence: 0.8,
      rationale: "Most common cause of sudden timeout changes.",
      status: "UNCERTAIN",
      createdAt: new Date().toISOString()
    });
    logAction({
      id: uuidv4(), timestamp: new Date().toISOString(), agent: "Synthesizer",
      action: "propose_hypothesis", tool: "propose_hypothesis", input: '{"claim":"Session timeout configuration..."}',
      reason: "Formulate primary hypothesis based on symptoms.", cost: 0.3, permission: "ANALYZE"
    });

    // Step 3: Falsifier in action
    await wait(2500);
    logAction({
      id: uuidv4(), timestamp: new Date().toISOString(), agent: "Falsifier",
      action: "falsify_hypothesis", tool: "falsify_hypothesis", input: `{"hypothesis_id":"${hypId}"}`,
      reason: "Attempting to find evidence that config did NOT change.", cost: 0.5, permission: "READ"
    });

    // Step 4: Record contradictory evidence
    await wait(2000);
    const evId = uuidv4();
    addEvidence({
      evidence_id: evId,
      source: "git log config/production.yaml",
      observation: "No changes to SESSION_TIMEOUT in the last 30 days.",
      timestamp: new Date().toISOString(),
      provenance: "Falsifier agent executing read-only git command",
      reliability: 1.0,
      supports: [],
      contradicts: [hypId],
      verification_status: "CONFIRMED"
    });
    logAction({
      id: uuidv4(), timestamp: new Date().toISOString(), agent: "Evidence Collector",
      action: "record_evidence", tool: "record_evidence", input: '{"observation":"No changes to SESSION_TIMEOUT..."}',
      reason: "Found contradictory evidence in Git history.", cost: 0.2, permission: "READ", evidence_created: [evId]
    });

    // Step 5: Update belief
    await wait(1500);
    logAction({
      id: uuidv4(), timestamp: new Date().toISOString(), agent: "Synthesizer",
      action: "update_belief", tool: "update_belief", input: '{"new_confidence":0.1}',
      reason: "Git history disproves the config change hypothesis.", cost: 0.1, permission: "ANALYZE",
      belief_before: 0.8, belief_after: 0.1
    });

    // Step 6: Human escalation
    await wait(3000);
    logAction({
      id: uuidv4(), timestamp: new Date().toISOString(), agent: "Experimenter",
      action: "request_human_approval", tool: "request_human_approval", input: '{"reason":"Need to restart production auth middleware to test race condition hypothesis."}',
      reason: "Mutation requires production access.", cost: 0.0, permission: "REQUEST_APPROVAL"
    });

    setRunning(false);
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        {running ? (
          <div className="flex items-center gap-2 bg-indigo-900/80 border border-indigo-500 text-indigo-100 px-4 py-2 rounded shadow-lg animate-pulse">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest">SIMULATION RUNNING</span>
          </div>
        ) : (
          <button 
            onClick={runSimulation}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded font-bold shadow-lg transition-colors"
          >
            Start Zero-API-Key Demo
          </button>
        )}
      </div>
      <CommandCenter />
    </div>
  );
}
