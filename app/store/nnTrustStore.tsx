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
  attacks: { [key: string]: RegisterObjectProps };
  metrics: { [key: string]: RegisterObjectProps };

  selectedAttacks: { [key: string]: RegisterObjectProps };
  selectedMetrics: { [key: string]: RegisterObjectProps };


  testAttack: RegisterObjectProps | null; // this variable saves the attack to test on the Test Page
  executedAttacks: AttackManagementProps[];
  loading: boolean;
  error: string | null;

  setModels: (models: ModelSpecs[] | null) => void;
  setModelName: (modelName: string | null) => void;
  setAttacks: (attaks: { [key: string]: RegisterObjectProps }) => void;
  setMetrics: (metrics: { [key: string]: RegisterObjectProps }) => void;
  setSelectedAttacks: (selectedAttack: { [key: string]: RegisterObjectProps }) => void;
  setSelectedMetrics: (selectedMetrics: { [key: string]: RegisterObjectProps }) => void;
  setMap: (
    map: { [key: string]: RegisterObjectProps },
    name: 'attacks' | 'metrics' | 'selectedAttacks' | 'selectedMetrics'
  ) => void;
  setExecutedAttacks: (executedAttacks: AttackManagementProps[]) => void;
}

const useNNTrustStore = create<AppState>()(
  persist(
    (set) => ({
      models: null,
      modelName: null,

      attacks: {},
      metrics: {},
      selectedAttacks: {},
      selectedMetrics: {},

      executedAttacks: [],

      testAttack: null,

      loading: false,
      error: null,

      setModels: (models) => set({ models }),
      setModelName: (modelName) => set({ modelName }),

      setAttacks: (attacks) => set({ attacks }),
      setMetrics: (metrics) => set({ metrics }),
      setSelectedAttacks: (selectedAttacks) => set({ selectedAttacks }),
      setSelectedMetrics: (selectedMetrics) => set({ selectedMetrics }),

      setMap: (map, name) => set({ [name]: map }),
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
        selectedAttacks: state.selectedAttacks
        // Don't persist loading and error states
      }),
    }
  )
);

export default useNNTrustStore;