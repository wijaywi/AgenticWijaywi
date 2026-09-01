import { useStore } from "@/store/useStore";
import { v4 as uuidv4 } from "uuid";
import { 
  CreateObjectiveSchema, 
  InspectWorldStateSchema,
  ProposeHypothesisSchema,
  RecordEvidenceSchema,
  RunExperimentSchema,
  FalsifyHypothesisSchema,
  UpdateBeliefSchema,
  VerifyClaimSchema,
  RequestHumanApprovalSchema,
  InspectAgentMemorySchema
} from "./toolSchemas";
import { zodToJsonSchema } from "zod-to-json-schema";

// Extend the Document interface to include modelContext for WebMCP
declare global {
  interface Document {
    modelContext?: any;
  }
  interface Navigator {
    modelContext?: any;
  }
}

export const registerWebMCPTools = async () => {
  const modelContext = typeof document !== 'undefined' ? document.modelContext || navigator?.modelContext : null;
  
  if (!modelContext) {
    console.warn("WebMCP: modelContext not available in this browser.");
    return false;
  }

  try {
    const store = useStore.getState();

    await modelContext.registerTool({
      name: "create_objective",
      description: "Allows an agent to create or update an investigation objective.",
      inputSchema: zodToJsonSchema(CreateObjectiveSchema as any),
      execute: async (input: any) => {
        const parsed = CreateObjectiveSchema.parse(input);
        const obj = {
          id: uuidv4(),
          title: parsed.title,
          description: parsed.description,
          priority: parsed.priority,
          createdAt: new Date().toISOString(),
          status: "active" as const,
        };
        store.setObjective(obj);
        store.logAction({
          id: uuidv4(), timestamp: new Date().toISOString(), agent: "Synthesizer",
          action: "create_objective", tool: "create_objective", input: JSON.stringify(input),
          reason: "Establish investigation goal.", cost: 0.1, permission: "ANALYZE"
        });
        return { success: true, objective: obj };
      }
    });

    await modelContext.registerTool({
      name: "inspect_world_state",
      description: "Returns the current relevant world model.",
      inputSchema: zodToJsonSchema(InspectWorldStateSchema as any),
      execute: async () => {
        store.logAction({
          id: uuidv4(), timestamp: new Date().toISOString(), agent: "Explorer",
          action: "inspect_world_state", tool: "inspect_world_state", input: "{}",
          reason: "Gather current context.", cost: 0.05, permission: "READ"
        });
        return store.worldState;
      }
    });

    await modelContext.registerTool({
      name: "propose_hypothesis",
      description: "Creates a hypothesis.",
      inputSchema: zodToJsonSchema(ProposeHypothesisSchema as any),
      execute: async (input: any) => {
        const parsed = ProposeHypothesisSchema.parse(input);
        const hyp = {
          id: uuidv4(),
          ...parsed,
          current_confidence: parsed.initial_confidence,
          status: "UNCERTAIN" as const,
          createdAt: new Date().toISOString(),
        };
        store.addHypothesis(hyp);
        store.logAction({
          id: uuidv4(), timestamp: new Date().toISOString(), agent: "Synthesizer",
          action: "propose_hypothesis", tool: "propose_hypothesis", input: JSON.stringify(input),
          reason: "Formulate new explanation.", cost: 0.5, permission: "ANALYZE"
        });
        return { success: true, hypothesis: hyp };
      }
    });

    await modelContext.registerTool({
      name: "record_evidence",
      description: "Adds evidence with provenance.",
      inputSchema: zodToJsonSchema(RecordEvidenceSchema as any),
      execute: async (input: any) => {
        const parsed = RecordEvidenceSchema.parse(input);
        const ev = {
          evidence_id: uuidv4(),
          ...parsed,
          timestamp: new Date().toISOString(),
          verification_status: "CONFIRMED" as const,
        };
        store.addEvidence(ev);
        store.logAction({
          id: uuidv4(), timestamp: new Date().toISOString(), agent: "Evidence Collector",
          action: "record_evidence", tool: "record_evidence", input: JSON.stringify(input),
          reason: "Store collected data.", cost: 0.2, permission: "READ", evidence_created: [ev.evidence_id]
        });
        return { success: true, evidence: ev };
      }
    });

    await modelContext.registerTool({
      name: "run_experiment",
      description: "Creates and records an experiment.",
      inputSchema: zodToJsonSchema(RunExperimentSchema as any),
      execute: async (input: any) => {
        const parsed = RunExperimentSchema.parse(input);
        const exp = {
          id: uuidv4(),
          ...parsed,
          status: "completed" as const, // simulating synchronous for now
          actual_result: "Simulated result based on expected result.",
          information_gain: Math.random() * 0.5 + 0.1,
          conclusion: "Experiment yielded relevant data.",
        };
        store.addExperiment(exp);
        store.logAction({
          id: uuidv4(), timestamp: new Date().toISOString(), agent: "Experimenter",
          action: "run_experiment", tool: "run_experiment", input: JSON.stringify(input),
          reason: "Test hypothesis validity.", cost: parsed.cost, permission: "EXECUTE_SANDBOX",
          result: exp.actual_result
        });
        return { success: true, experiment: exp };
      }
    });

    await modelContext.registerTool({
      name: "falsify_hypothesis",
      description: "Attempts to destroy a hypothesis, not prove it.",
      inputSchema: zodToJsonSchema(FalsifyHypothesisSchema as any),
      execute: async (input: any) => {
        const parsed = FalsifyHypothesisSchema.parse(input);
        store.logAction({
          id: uuidv4(), timestamp: new Date().toISOString(), agent: "Falsifier",
          action: "falsify_hypothesis", tool: "falsify_hypothesis", input: JSON.stringify(input),
          reason: "Active attempt to break hypothesis.", cost: 0.8, permission: "ANALYZE"
        });
        
        // Simulate falsification result
        return {
          hypothesis: parsed.hypothesis_id,
          falsification_strategy: parsed.falsification_strategy,
          evidence_searched: parsed.evidence_searched,
          contradictory_evidence: ["Simulated counter-evidence X"],
          result: "Hypothesis weakened.",
          remaining_uncertainty: 0.6
        };
      }
    });

    await modelContext.registerTool({
      name: "update_belief",
      description: "Updates a belief based on evidence.",
      inputSchema: zodToJsonSchema(UpdateBeliefSchema as any),
      execute: async (input: any) => {
        const parsed = UpdateBeliefSchema.parse(input);
        const existing = store.worldState.currentBeliefs.find(b => b.id === parsed.belief_id);
        if (existing) {
          store.updateBelief(parsed.belief_id, {
            confidence: parsed.new_confidence,
            previous_confidence: existing.confidence,
            reason_for_update: parsed.reason,
            updatedAt: new Date().toISOString()
          });
        }
        store.logAction({
          id: uuidv4(), timestamp: new Date().toISOString(), agent: "Synthesizer",
          action: "update_belief", tool: "update_belief", input: JSON.stringify(input),
          reason: "Incorporate new evidence.", cost: 0.3, permission: "ANALYZE",
          belief_before: existing?.confidence, belief_after: parsed.new_confidence
        });
        return { success: true };
      }
    });

    await modelContext.registerTool({
      name: "verify_claim",
      description: "Determines CONFIRMED, DISPROVEN, or UNCERTAIN.",
      inputSchema: zodToJsonSchema(VerifyClaimSchema as any),
      execute: async (input: any) => {
        store.logAction({
          id: uuidv4(), timestamp: new Date().toISOString(), agent: "Verifier",
          action: "verify_claim", tool: "verify_claim", input: JSON.stringify(input),
          reason: "Independent claim check.", cost: 0.4, permission: "READ"
        });
        return { status: "UNCERTAIN" }; // Defaulting to uncertain for safety
      }
    });

    await modelContext.registerTool({
      name: "request_human_approval",
      description: "Used when an action crosses a permission boundary.",
      inputSchema: zodToJsonSchema(RequestHumanApprovalSchema as any),
      execute: async (input: any) => {
        store.logAction({
          id: uuidv4(), timestamp: new Date().toISOString(), agent: "Synthesizer",
          action: "request_human_approval", tool: "request_human_approval", input: JSON.stringify(input),
          reason: "Permission boundary crossed.", cost: 0, permission: "REQUEST_APPROVAL"
        });
        // In a real app this would block and wait.
        return { status: "PENDING", message: "Escalated to Epistemic Command Center." };
      }
    });

    await modelContext.registerTool({
      name: "inspect_agent_memory",
      description: "Returns relevant institutional memory.",
      inputSchema: zodToJsonSchema(InspectAgentMemorySchema as any),
      execute: async (input: any) => {
        store.logAction({
          id: uuidv4(), timestamp: new Date().toISOString(), agent: "Explorer",
          action: "inspect_agent_memory", tool: "inspect_agent_memory", input: JSON.stringify(input),
          reason: "Consult past lessons.", cost: 0.1, permission: "READ"
        });
        return {
          previous_experiments: ["EX-1: Failed due to timeout"],
          failed_hypotheses: ["H-2: Authentication bypass"],
          successful_procedures: ["Use dynamic tracing for race conditions"],
          causal_knowledge: ["Service A restarts cause Service B timeouts"],
          lessons_learned: ["Static analysis alone is insufficient for runtime bugs."]
        };
      }
    });

    console.log("WebMCP Tools registered successfully.");
    return true;
  } catch (err) {
    console.error("Failed to register WebMCP tools:", err);
    return false;
  }
};
