import { ModelSpecs, RegisterObjectProps } from "@/interfaces/NNInterfaces";
import { BenchmarkDataProps, ReportProps } from "@/interfaces/reportInterfaces";
import Benchmark from "@/pages/tasks/redteam/benchmark/page";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AttackManagementProps {
  id: string;
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
  benchmark: { [key: string]: BenchmarkDataProps } | null;
  vulnerabilitySelected: string | null;

  benchmarkID: string;

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
  setBenchmark: (benchmark: { [key: string]: BenchmarkDataProps; }) => void;
  setVulnerabilitySelected: (vulnerabilitySelected: string) => void;

  setBenchmarkID: (benchmarkID: string) => void;
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

      executedAttacks: [{
        id: "",
        name: "",
        status: "",
        progress: 0
      }],

      testAttack: null,

      loading: false,
      error: null,

      report: null,
      benchmark: null,
      vulnerabilitySelected: null,

      benchmarkID: "",

      setModels: (models) => set({ models }),
      setModelName: (modelName) => set({ modelName }),

      setAttacks: (attacks) => set({ attacks }),
      setMetrics: (metrics) => set({ metrics }),
      setSelectedAttacks: (selectedAttacks) => set({ selectedAttacks }),
      setSelectedMetrics: (selectedMetrics) => set({ selectedMetrics }),

      setMap: (map, name) => set({ [name]: map }),
      setExecutedAttacks: (executedAttacks: AttackManagementProps[]) => set({ executedAttacks }),

      setReport: (report: ReportProps) => set({ report }),
      setBenchmark: (benchmark: { [key: string]: BenchmarkDataProps; }) => set({ benchmark }),
      setVulnerabilitySelected: (vulnerabilitySelected: string) => set({ vulnerabilitySelected }),
      setBenchmarkID: (benchmarkID: string) => set({ benchmarkID }),
    }),

    {
      name: "app-storage-models",
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
        benchmarkID: state.benchmarkID
        // Don't persist loading and error states
      }),
    }
  )
);

export default useNNTrustStore;