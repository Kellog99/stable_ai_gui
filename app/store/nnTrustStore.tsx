import { ModelInfo } from "@/interfaces/homePageInterface";
import { RegisterObjectProps } from "@/interfaces/NNInterfaces";
import { BenchmarkDataProps, ModelReportProps } from "@/interfaces/reportInterfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  model: ModelInfo | null;
  listModels: ModelInfo[];

  attacks: { [key: string]: RegisterObjectProps };
  metrics: { [key: string]: RegisterObjectProps };

  selectedAttacks: { [key: string]: RegisterObjectProps };

  benchmarkId: string | number | null;
  benchmark: { [key: string]: BenchmarkDataProps } | null;

  testAttack: RegisterObjectProps | null;
  loading: boolean;
  error: string | null;
  modelReport: ModelReportProps | null;
  vulnerabilitySelected: string | null;


  setModel: (models: ModelInfo | null) => void;
  setListModels: (listModels: ModelInfo[]) => void;
  setAttacks: (attacks: { [key: string]: RegisterObjectProps }) => void;
  setMetrics: (metrics: { [key: string]: RegisterObjectProps }) => void;
  setSelectedAttackList: (selectedAttacks: { [key: string]: RegisterObjectProps }) => void
  setBenchmarkId: (benchmarkId: string | number | null) => void;
  setMap: (
    map: { [key: string]: RegisterObjectProps },
    name: 'attacks' | 'metrics' | 'selectedAttacks' | 'selectedMetrics'
  ) => void;
  setAttackReport: (attackReport: ModelReportProps) => void;
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
      selectedAttacks: {},
      benchmarkId: null,
      testAttack: null,
      loading: false,
      error: null,
      modelReport: null,
      benchmark: null,
      benchmarkPROVA: [],
      vulnerabilitySelected: null,

      setModel: (models) => set({ model: models }),
      setListModels: (listModels) => set({ listModels }),
      setAttacks: (attacks) => set({ attacks }),
      setMetrics: (metrics) => set({ metrics }),
      setSelectedAttackList: (selectedAttacks) => set({ selectedAttacks }),
      setBenchmarkId: (benchmarkId) => set({ benchmarkId }),
      setMap: (map, name) => set({ [name]: map }),
      setAttackReport: (attackReport) => set({ modelReport: attackReport }),
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
        attackReport: state.modelReport,
        benchmark: state.benchmark,
        benchmarkId: state.benchmarkId,
        selectedAttacks: state.selectedAttacks
      }),
    }
  )
);

export default useNNTrustStore;