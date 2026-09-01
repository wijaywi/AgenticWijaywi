import { create } from "zustand";
import { 
  Objective, Hypothesis, Evidence, Experiment, Belief, AgentAction, Event, WorldState 
} from "@/lib/types/domain";

interface AppState {
  worldState: WorldState;
  agentActions: AgentAction[];
  
  // Actions
  fetchState: () => Promise<void>;
  setObjective: (objective: Objective) => Promise<void>;
  addHypothesis: (hypothesis: Hypothesis) => Promise<void>;
  updateHypothesis: (id: string, updates: Partial<Hypothesis>) => Promise<void>;
  addEvidence: (evidence: Evidence) => Promise<void>;
  addExperiment: (experiment: Experiment) => Promise<void>;
  updateExperiment: (id: string, updates: Partial<Experiment>) => Promise<void>;
  addBelief: (belief: Belief) => Promise<void>;
  updateBelief: (id: string, updates: Partial<Belief>) => Promise<void>;
  logAction: (action: AgentAction) => Promise<void>;
  addEvent: (event: Event) => void;
  resetState: () => Promise<void>;
}

const initialState: WorldState = {
  objective: null,
  entities: [],
  recentEvents: [],
  activeHypotheses: [],
  unresolvedContradictions: [],
  importantEvidence: [],
  currentBeliefs: [],
  pendingExperiments: [],
  governanceConstraints: [
    "No production mutation without explicit human approval.",
    "Claims must be verified with at least one dynamic observation.",
    "Do not repeat disproven hypotheses."
  ],
};

const mutate = async (type: string, payload?: any) => {
  try {
    await fetch("/api/mutate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload })
    });
  } catch (e) {
    console.error("DB mutation failed", e);
  }
};

export const useStore = create<AppState>()(
  (set) => ({
    worldState: initialState,
    agentActions: [],

    fetchState: async () => {
      try {
        const res = await fetch("/api/world");
        if (res.ok) {
          const data = await res.json();
          set({ worldState: data.worldState, agentActions: data.agentActions });
        }
      } catch (e) {
        console.error("Failed to fetch initial state", e);
      }
    },

    setObjective: async (objective) => {
      await mutate("SET_OBJECTIVE", objective);
      set((state) => ({ worldState: { ...state.worldState, objective } }));
    },

    addHypothesis: async (hypothesis) => {
      await mutate("ADD_HYPOTHESIS", hypothesis);
      set((state) => ({
        worldState: { ...state.worldState, activeHypotheses: [...state.worldState.activeHypotheses, hypothesis] }
      }));
    },

    updateHypothesis: async (id, updates) => {
      await mutate("UPDATE_HYPOTHESIS", { id, updates });
      set((state) => ({
        worldState: {
          ...state.worldState,
          activeHypotheses: state.worldState.activeHypotheses.map(h => h.id === id ? { ...h, ...updates } : h)
        }
      }));
    },

    addEvidence: async (evidence) => {
      await mutate("ADD_EVIDENCE", evidence);
      set((state) => ({
        worldState: { ...state.worldState, importantEvidence: [...state.worldState.importantEvidence, evidence] }
      }));
    },

    addExperiment: async (experiment) => {
      await mutate("ADD_EXPERIMENT", experiment);
      set((state) => ({
        worldState: { ...state.worldState, pendingExperiments: [...state.worldState.pendingExperiments, experiment] }
      }));
    },

    updateExperiment: async (id, updates) => {
      // For now we don't have an UPDATE_EXPERIMENT route defined in our mega handler, but keeping local state updated.
      set((state) => ({
        worldState: {
          ...state.worldState,
          pendingExperiments: state.worldState.pendingExperiments.map(e => e.id === id ? { ...e, ...updates } : e)
        }
      }));
    },

    addBelief: async (belief) => {
      await mutate("ADD_BELIEF", belief);
      set((state) => ({
        worldState: { ...state.worldState, currentBeliefs: [...state.worldState.currentBeliefs, belief] }
      }));
    },

    updateBelief: async (id, updates) => {
      await mutate("UPDATE_BELIEF", { id, updates });
      set((state) => ({
        worldState: {
          ...state.worldState,
          currentBeliefs: state.worldState.currentBeliefs.map(b => b.id === id ? { ...b, ...updates } : b)
        }
      }));
    },

    logAction: async (action) => {
      await mutate("LOG_ACTION", action);
      set((state) => ({
        agentActions: [action, ...state.agentActions]
      }));
    },

    addEvent: (event) => set((state) => ({
      worldState: {
        ...state.worldState,
        recentEvents: [event, ...state.worldState.recentEvents].slice(0, 100)
      }
    })),

    resetState: async () => {
      await mutate("RESET_STATE");
      set(() => ({ worldState: initialState, agentActions: [] }));
    },
  })
);
