import { ModelSpecs, ParametersProps, RegisterObjectProps } from "@/interfaces/NNInterfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AttackManagementProps {
  id: number;
  name: string;
  status: string;
}

interface AppState {
  models: ModelSpecs[] | null;
  modelName: string | null;
  attacks: Map<string, RegisterObjectProps>;
  metrics: Map<string, RegisterObjectProps>;

  selectedAttacks: Map<string, RegisterObjectProps>;
  selectedMetrics: Map<string, RegisterObjectProps>;

  executedAttacks: AttackManagementProps[];
  monitoring: boolean;
  loading: boolean;
  error: string | null;

  setModels: (models: ModelSpecs[] | null) => void;
  setModelName: (modelName: string | null) => void;
  setAttacks: (attaks: Map<string, RegisterObjectProps>) => void;
  setMetrics: (metrics: Map<string, RegisterObjectProps>) => void;
  setSelectedAttacks: (selectedAttack: Map<string, RegisterObjectProps>) => void;
  setSelectedMetrics: (selectedMetrics: Map<string, RegisterObjectProps>) => void;
  setMap: (
    map: Map<string, RegisterObjectProps>,
    name: 'attacks' | 'metrics' | 'selectedAttacks' | 'selectedMetrics'
  ) => void;
  setMonitoring: (monitoring: boolean) => void;
  setExecutedAttacks: (executedAttacks: AttackManagementProps[]) => void;
}

const useNNTrustStore = create<AppState>()(
  persist(
    (set) => ({
      models: null,
      modelName: null,

      attacks: new Map(),
      metrics: new Map(),
      selectedAttacks: new Map(),
      selectedMetrics: new Map(),

      executedAttacks: [],

      monitoring: false,
      loading: false,
      error: null,

      setModels: (models) => set({ models }),
      setModelName: (modelName) => set({ modelName }),

      setAttacks: (attacks) => set({ attacks }),
      setMetrics: (metrics) => set({ metrics }),
      setSelectedAttacks: (selectedAttacks) => set({ selectedAttacks }),
      setSelectedMetrics: (selectedMetrics) => set({ selectedMetrics }),

      setMap: (map, name) => set({ [name]: map }),
      setMonitoring: (monitoring: boolean) => set({ monitoring }),
      setExecutedAttacks: (executedAttacks: AttackManagementProps[]) => set({ executedAttacks })

    }),

    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        models: state.models,
        modelName: state.modelName,
        attacks: state.attacks,
        metrics: state.metrics,
        monitoring: state.monitoring,
        // Don't persist loading and error states
      }),
    }
  )
);

export default useNNTrustStore;