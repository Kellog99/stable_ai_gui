import {DatasetInfo, ModelInfo} from "@/interfaces/homePageInterface";
import {RegisterObjectProps} from "@/interfaces/NNInterfaces";
import {BenchmarkDataProps, ModelReportProps} from "@/interfaces/reportInterfaces";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

interface AppState {
    model: ModelInfo | null;
    listModels: ModelInfo[] | null;

    dataset: DatasetInfo | null;
    listDatasets: DatasetInfo[] | null;

    attacks: { [key: string]: RegisterObjectProps };
    privacyAttacks: { [key: string]: RegisterObjectProps };
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
    setListModels: (listModels: ModelInfo[] | null) => void;
    setDataset: (dataset: DatasetInfo | null) => void;
    setListDatasets: (listDataset: DatasetInfo[] | null) => void;

    setAttacks: (attacks: { [key: string]: RegisterObjectProps }) => void;
    setPrivacyAttacks: (privacyAttacks: { [key: string]: RegisterObjectProps }) => void;
    setMetrics: (metrics: { [key: string]: RegisterObjectProps }) => void;
    setSelectedAttackList: (selectedAttacks: { [key: string]: RegisterObjectProps }) => void
    setBenchmarkId: (benchmarkId: string | number | null) => void;
    setMap: (
        map: { [key: string]: RegisterObjectProps },
        name: 'attacks' | 'metrics' | 'selectedAttacks' | 'selectedMetrics'
    ) => void;
    setModelReport: (attackReport: ModelReportProps) => void;
    setBenchmark: (benchmark: { [key: string]: BenchmarkDataProps }) => void;

    setVulnerabilitySelected: (vulnerabilitySelected: string) => void;
}

const useNNTrustStore = create<AppState>()(
    persist(
        (set) => ({
            model: null,
            listModels: null,
            dataset: null,
            listDatasets: null,
            attacks: {},
            privacyAttacks: {},
            metrics: {},
            selectedAttacks: {},
            benchmarkId: null,
            testAttack: null,
            loading: false,
            error: null,
            modelReport: null,      // This is the model's report selected
            benchmark: null,
            vulnerabilitySelected: null,

            setModel: (model: ModelInfo | null) => set({model}),
            setListModels: (listModels: ModelInfo[] | null) => set({listModels}),
            setDataset: (dataset: DatasetInfo | null) => set({dataset}),
            setListDatasets: (listDatasets: DatasetInfo[] | null) => set({listDatasets}),

            setAttacks: (attacks) => set({attacks}),
            setPrivacyAttacks: (privacyAttacks) => set({privacyAttacks}),

            setMetrics: (metrics) => set({metrics}),
            setSelectedAttackList: (selectedAttacks) => set({selectedAttacks}),
            setBenchmarkId: (benchmarkId) => set({benchmarkId}),
            setMap: (map, name) => set({[name]: map}),
            setModelReport: (modelReport) => set({modelReport: modelReport}),
            setBenchmark: (benchmark) => set({benchmark}),
            setVulnerabilitySelected: (vulnerabilitySelected) => set({vulnerabilitySelected}),
        }),
        {
            name: "app-storage-models",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                model: state.model,
                dataset: state.dataset,
                listModels: state.listModels,
                listDatasets: state.listDatasets,
                attacks: state.attacks,
                privacyAttacks: state.privacyAttacks,
                metrics: state.metrics,
                modelReport: state.modelReport,
                benchmark: state.benchmark,
                benchmarkId: state.benchmarkId,
                selectedAttacks: state.selectedAttacks
            }),
        }
    )
);

export default useNNTrustStore;
