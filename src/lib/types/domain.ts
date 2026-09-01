export type Priority = "low" | "medium" | "high" | "critical";
export type VerificationStatus = "CONFIRMED" | "DISPROVEN" | "UNCERTAIN";
export type PermissionLevel = "READ" | "ANALYZE" | "WRITE_TEST_ENVIRONMENT" | "EXECUTE_SANDBOX" | "REQUEST_APPROVAL" | "PRODUCTION_MUTATION";
export type ActionRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Objective {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  createdAt: string;
  status: "active" | "completed" | "abandoned";
}

export interface Hypothesis {
  id: string;
  claim: string;
  assumptions: string[];
  expected_observations: string[];
  counterfactual: string;
  initial_confidence: number;
  current_confidence: number;
  rationale: string;
  status: VerificationStatus;
  createdAt: string;
}

export interface Evidence {
  evidence_id: string;
  source: string;
  observation: string;
  timestamp: string;
  provenance: string;
  reliability: number;
  supports: string[]; // Hypothesis IDs
  contradicts: string[]; // Hypothesis IDs
  verification_status: VerificationStatus;
}

export interface Experiment {
  id: string;
  hypothesis_id: string;
  design: string;
  expected_result: string;
  actual_result?: string;
  cost: number;
  information_gain?: number;
  conclusion?: string;
  status: "planned" | "running" | "completed" | "failed";
}

export interface Belief {
  id: string;
  claim: string;
  confidence: number;
  supporting_evidence: string[]; // Evidence IDs
  counter_evidence: string[]; // Evidence IDs
  assumptions: string[];
  unknowns: string[];
  previous_confidence: number;
  reason_for_update: string;
  updatedAt: string;
}

export interface AgentAction {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  tool: string;
  input: string;
  reason: string;
  cost: number;
  permission: PermissionLevel;
  observation?: string;
  belief_before?: number;
  belief_after?: number;
  evidence_created?: string[];
  result?: string;
}

export interface Event {
  id: string;
  type: string;
  timestamp: string;
  payload: any;
}

export interface WorldState {
  objective: Objective | null;
  entities: any[];
  recentEvents: Event[];
  activeHypotheses: Hypothesis[];
  unresolvedContradictions: string[];
  importantEvidence: Evidence[];
  currentBeliefs: Belief[];
  pendingExperiments: Experiment[];
  governanceConstraints: string[];
}
