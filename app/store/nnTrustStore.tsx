import { ModelInfo, RegisterObjectProps } from "@/interfaces/NNInterfaces";
import { BenchmarkDataProps, ReportAttacksProps } from "@/interfaces/reportInterfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  model: ModelInfo | null;
  listModels: ModelInfo[];

  attacks: { [key: string]: RegisterObjectProps };
  metrics: { [key: string]: RegisterObjectProps };

  benchmarkId: string | number | null;
  benchmark: { [key: string]: BenchmarkDataProps } | null;
  benchmarkPROVA: BenchmarkDataProps[];

  testAttack: RegisterObjectProps | null;
  loading: boolean;
  error: string | null;
  attackReport: ReportAttacksProps | null;
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
  setAttackReport: (attackReport: ReportAttacksProps) => void;
  setBenchmark: (benchmark: { [key: string]: BenchmarkDataProps }) => void;
  setBenchmarkPROVA: (benchmarkPROVA: BenchmarkDataProps[]) => void;

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
      attackReport: null,
      benchmark: null,
      benchmarkPROVA: [],
      vulnerabilitySelected: null,

      setModel: (models) => set({ model: models }),
      setListModels: (listModels) => set({ listModels }),
      setAttacks: (attacks) => set({ attacks }),
      setMetrics: (metrics) => set({ metrics }),
      setBenchmarkId: (benchmarkId) => set({ benchmarkId }),
      setMap: (map, name) => set({ [name]: map }),
      setAttackReport: (attackReport) => set({ attackReport }),
      setBenchmark: (benchmark) => set({ benchmark }),
      setBenchmarkPROVA: (benchmarkPROVA) => set({ benchmarkPROVA }),
      setVulnerabilitySelected: (vulnerabilitySelected) => set({ vulnerabilitySelected }),
    }),
    {
      name: "app-storage-models",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        model: state.model,
        attacks: state.attacks,
        metrics: state.metrics,
        attackReport: state.attackReport,
        benchmark: state.benchmark,
        benchmarkId: state.benchmarkId,
      }),
    }
  )
);

export default useNNTrustStore;