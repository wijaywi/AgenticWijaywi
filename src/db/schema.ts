import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const objectives = sqliteTable("objectives", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(),
  createdAt: text("createdAt").notNull(),
  status: text("status").notNull(),
});

export const hypotheses = sqliteTable("hypotheses", {
  id: text("id").primaryKey(),
  claim: text("claim").notNull(),
  assumptions: text("assumptions", { mode: "json" }).notNull(),
  expected_observations: text("expected_observations", { mode: "json" }).notNull(),
  counterfactual: text("counterfactual").notNull(),
  initial_confidence: real("initial_confidence").notNull(),
  current_confidence: real("current_confidence").notNull(),
  rationale: text("rationale").notNull(),
  status: text("status").notNull(),
  createdAt: text("createdAt").notNull(),
});

export const evidence = sqliteTable("evidence", {
  evidence_id: text("evidence_id").primaryKey(),
  source: text("source").notNull(),
  observation: text("observation").notNull(),
  timestamp: text("timestamp").notNull(),
  provenance: text("provenance").notNull(),
  reliability: real("reliability").notNull(),
  supports: text("supports", { mode: "json" }).notNull(),
  contradicts: text("contradicts", { mode: "json" }).notNull(),
  verification_status: text("verification_status").notNull(),
});

export const experiments = sqliteTable("experiments", {
  id: text("id").primaryKey(),
  hypothesis_id: text("hypothesis_id").notNull(),
  design: text("design").notNull(),
  expected_result: text("expected_result").notNull(),
  actual_result: text("actual_result"),
  cost: real("cost").notNull(),
  information_gain: real("information_gain"),
  conclusion: text("conclusion"),
  status: text("status").notNull(),
});

export const beliefs = sqliteTable("beliefs", {
  id: text("id").primaryKey(),
  claim: text("claim").notNull(),
  confidence: real("confidence").notNull(),
  supporting_evidence: text("supporting_evidence", { mode: "json" }).notNull(),
  counter_evidence: text("counter_evidence", { mode: "json" }).notNull(),
  assumptions: text("assumptions", { mode: "json" }).notNull(),
  unknowns: text("unknowns", { mode: "json" }).notNull(),
  previous_confidence: real("previous_confidence").notNull(),
  reason_for_update: text("reason_for_update").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const agentActions = sqliteTable("agent_actions", {
  id: text("id").primaryKey(),
  timestamp: text("timestamp").notNull(),
  agent: text("agent").notNull(),
  action: text("action").notNull(),
  tool: text("tool").notNull(),
  input: text("input").notNull(),
  reason: text("reason").notNull(),
  cost: real("cost").notNull(),
  permission: text("permission").notNull(),
  observation: text("observation"),
  belief_before: real("belief_before"),
  belief_after: real("belief_after"),
  evidence_created: text("evidence_created", { mode: "json" }),
  result: text("result"),
});
