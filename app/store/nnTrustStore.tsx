import { ModelSpecs, RegisterObjectProps } from "@/interfaces/NNInterfaces";
import { BenchmarkDataProps, ReportProps } from "@/interfaces/reportInterfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AttackManagementProps {
  id: number;
  name: string;
  status: string;
  progress: number
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

  // report
  report: ReportProps | null;
  benchmark: BenchmarkDataProps | null;
  vulnerabilitySelected: string | null;

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
  setReport: (report: ReportProps) => void;
  setBenchmark: (benchmark: BenchmarkDataProps) => void;
  setVulnerabilitySelected: (vulnerabilitySelected: string) => void;
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

      report: null,
      benchmark: null,
      vulnerabilitySelected: null,

      setModels: (models) => set({ models }),
      setModelName: (modelName) => set({ modelName }),

      setAttacks: (attacks) => set({ attacks }),
      setMetrics: (metrics) => set({ metrics }),
      setSelectedAttacks: (selectedAttacks) => set({ selectedAttacks }),
      setSelectedMetrics: (selectedMetrics) => set({ selectedMetrics }),

      setMap: (map, name) => set({ [name]: map }),
      setExecutedAttacks: (executedAttacks: AttackManagementProps[]) => set({ executedAttacks }),

      setReport: (report: ReportProps) => set({ report }),
      setBenchmark: (benchmark: BenchmarkDataProps) => set({ benchmark }),
      setVulnerabilitySelected: (vulnerabilitySelected: string) => set({ vulnerabilitySelected })
    }),

    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        models: state.models,
        modelName: state.modelName,
        attacks: state.attacks,
        metrics: state.metrics,
        selectedAttacks: state.selectedAttacks,
        report: state.report,
        benchmark: state.benchmark,
        vulnerabilitySelected: state.vulnerabilitySelected, 
        executedAttacks: state.executedAttacks,
        // Don't persist loading and error states
      }),
    }
  )
);

export default useNNTrustStore;