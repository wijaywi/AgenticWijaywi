import { NextResponse } from "next/server";
import { db } from "@/db";
import { objectives, hypotheses, evidence, experiments, beliefs, agentActions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allObjectives = await db.select().from(objectives).orderBy(desc(objectives.createdAt));
    const allHypotheses = await db.select().from(hypotheses).orderBy(desc(hypotheses.createdAt));
    const allEvidence = await db.select().from(evidence).orderBy(desc(evidence.timestamp));
    const allExperiments = await db.select().from(experiments);
    const allBeliefs = await db.select().from(beliefs).orderBy(desc(beliefs.updatedAt));
    const allActions = await db.select().from(agentActions).orderBy(desc(agentActions.timestamp)).limit(100);

    return NextResponse.json({
      worldState: {
        objective: allObjectives[0] || null,
        entities: [],
        recentEvents: [],
        activeHypotheses: allHypotheses,
        unresolvedContradictions: [],
        importantEvidence: allEvidence,
        currentBeliefs: allBeliefs,
        pendingExperiments: allExperiments,
        governanceConstraints: [
          "No production mutation without explicit human approval.",
          "Claims must be verified with at least one dynamic observation.",
          "Do not repeat disproven hypotheses."
        ]
      },
      agentActions: allActions
    });
  } catch (error) {
    console.error("Failed to fetch world state:", error);
    return NextResponse.json({ error: "Failed to fetch state" }, { status: 500 });
  }
}
