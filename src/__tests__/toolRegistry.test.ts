import { describe, it, expect, beforeEach } from "vitest";
import { CreateObjectiveSchema, ProposeHypothesisSchema } from "../lib/webmcp/toolSchemas";
import { registerWebMCPTools } from "../lib/webmcp/registerTools";

describe("WebMCP Tool Schemas", () => {
  it("should validate a valid objective", () => {
    const valid = { title: "Test", description: "Desc", priority: "high" };
    expect(() => CreateObjectiveSchema.parse(valid)).not.toThrow();
  });

  it("should reject an invalid priority", () => {
    const invalid = { title: "Test", description: "Desc", priority: "super" };
    expect(() => CreateObjectiveSchema.parse(invalid)).toThrow();
  });
  
  it("should validate a valid hypothesis", () => {
    const valid = {
      claim: "System is failing due to X",
      assumptions: ["X exists"],
      expected_observations: ["Logs show X"],
      counterfactual: "If not X, then Y",
      initial_confidence: 0.8,
      rationale: "Because Z"
    };
    expect(() => ProposeHypothesisSchema.parse(valid)).not.toThrow();
  });
});

describe("WebMCP Tool Registration", () => {
  beforeEach(() => {
    // Mock the WebMCP environment
    (global as any).document = {
      modelContext: {
        registerTool: async (tool: any) => {
          return true;
        }
      }
    };
  });

  it("should register tools when modelContext is available", async () => {
    const result = await registerWebMCPTools();
    expect(result).toBe(true);
  });
});
