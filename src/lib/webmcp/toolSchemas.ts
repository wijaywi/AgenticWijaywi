import { z } from "zod";

export const CreateObjectiveSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
});

export const InspectWorldStateSchema = z.object({});

export const ProposeHypothesisSchema = z.object({
  claim: z.string(),
  assumptions: z.array(z.string()),
  expected_observations: z.array(z.string()),
  counterfactual: z.string(),
  initial_confidence: z.number().min(0).max(1),
  rationale: z.string(),
});

export const RecordEvidenceSchema = z.object({
  source: z.string(),
  observation: z.string(),
  provenance: z.string(),
  reliability: z.number().min(0).max(1),
  supports: z.array(z.string()),
  contradicts: z.array(z.string()),
});

export const RunExperimentSchema = z.object({
  hypothesis_id: z.string(),
  design: z.string(),
  expected_result: z.string(),
  cost: z.number(),
});

export const FalsifyHypothesisSchema = z.object({
  hypothesis_id: z.string(),
  falsification_strategy: z.string(),
  evidence_searched: z.array(z.string()),
});

export const UpdateBeliefSchema = z.object({
  belief_id: z.string(),
  new_confidence: z.number().min(0).max(1),
  reason: z.string(),
  new_supporting_evidence: z.array(z.string()).optional(),
  new_counter_evidence: z.array(z.string()).optional(),
});

export const VerifyClaimSchema = z.object({
  claim: z.string(),
});

export const RequestHumanApprovalSchema = z.object({
  reason: z.string(),
  confidence: z.number(),
  evidence: z.array(z.string()),
  risk: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  required_permission: z.enum(["READ", "ANALYZE", "WRITE_TEST_ENVIRONMENT", "EXECUTE_SANDBOX", "REQUEST_APPROVAL", "PRODUCTION_MUTATION"]),
  recommended_action: z.string(),
  prohibited_action: z.string(),
});

export const InspectAgentMemorySchema = z.object({
  query: z.string().optional(),
});
