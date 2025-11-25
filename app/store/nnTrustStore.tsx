import { AttackManagementProps, ModelInfo, RegisterObjectProps } from "@/interfaces/NNInterfaces";
import { BenchmarkDataProps, ReportProps } from "@/interfaces/reportInterfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  model: ModelInfo | null;
  listModels: ModelInfo[];
  attacks: { [key: string]: RegisterObjectProps };
  metrics: { [key: string]: RegisterObjectProps };
  benchmarkId: string | number | null;
  testAttack: RegisterObjectProps | null;
  loading: boolean;
  error: string | null;
  report: ReportProps | null;
  benchmark: { [key: string]: BenchmarkDataProps } | null;
  vulnerabilitySelected: string | null;

  setModel: (models: ModelInfo | null) => void;
  setListModels: (listModels: ModelInfo[]) => void;
  setAttacks: (attacks: { [key: string]: RegisterObjectProps }) => void;
  setMetrics: (metrics: { [key: string]: RegisterObjectProps }) => void;
  setBenchmarkId: (benchmarkId: string | number | null) => void;
  setMap: (
    map: { [key: string]: RegisterObjectProps },
    name: 'attacks' | 'metrics' | 'selectedAttacks' | 'selectedMetrics'
  ) => void;
  setReport: (report: ReportProps) => void;
  setBenchmark: (benchmark: { [key: string]: BenchmarkDataProps }) => void;
  setVulnerabilitySelected: (vulnerabilitySelected: string) => void;
}

const useNNTrustStore = create<AppState>()(
  persist(
    (set) => ({
      model: null,
      listModels: [],
      attacks: {},
      metrics: {},
      benchmarkId: null,
      testAttack: null,
      loading: false,
      error: null,
      report: null,
      benchmark: null,
      vulnerabilitySelected: null,

      setModel: (models) => set({ model: models }),
      setListModels: (listModels) => set({ listModels }),
      setAttacks: (attacks) => set({ attacks }),
      setMetrics: (metrics) => set({ metrics }),
      setBenchmarkId: (benchmarkId) => set({ benchmarkId }),
      setMap: (map, name) => set({ [name]: map }),
      setReport: (report) => set({ report }),
      setBenchmark: (benchmark) => set({ benchmark }),
      setVulnerabilitySelected: (vulnerabilitySelected) => set({ vulnerabilitySelected }),
    }),
    {
      name: "app-storage-models",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        model: state.model,
        attacks: state.attacks,
        metrics: state.metrics,
        report: state.report,
        benchmark: state.benchmark,
        benchmarkId: state.benchmarkId,
      }),
    }
  )
);

export default useNNTrustStore;