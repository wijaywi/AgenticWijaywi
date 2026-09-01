import { NextResponse } from "next/server";
import { db } from "@/db";
import { objectives, hypotheses, evidence, experiments, beliefs, agentActions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, payload } = body;

    switch (type) {
      case "SET_OBJECTIVE":
        await db.insert(objectives).values(payload).onConflictDoUpdate({
          target: objectives.id,
          set: payload
        });
        break;
      case "ADD_HYPOTHESIS":
        await db.insert(hypotheses).values(payload);
        break;
      case "UPDATE_HYPOTHESIS":
        await db.update(hypotheses).set(payload.updates).where(eq(hypotheses.id, payload.id));
        break;
      case "ADD_EVIDENCE":
        await db.insert(evidence).values(payload);
        break;
      case "ADD_EXPERIMENT":
        await db.insert(experiments).values(payload);
        break;
      case "ADD_BELIEF":
        await db.insert(beliefs).values(payload);
        break;
      case "UPDATE_BELIEF":
        await db.update(beliefs).set(payload.updates).where(eq(beliefs.id, payload.id));
        break;
      case "LOG_ACTION":
        await db.insert(agentActions).values(payload);
        break;
      case "RESET_STATE":
        await db.delete(objectives);
        await db.delete(hypotheses);
        await db.delete(evidence);
        await db.delete(experiments);
        await db.delete(beliefs);
        await db.delete(agentActions);
        break;
      default:
        return NextResponse.json({ error: "Unknown mutation type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mutation failed:", error);
    return NextResponse.json({ error: "Mutation failed" }, { status: 500 });
  }
}
