import { create } from "zustand";
import { persist } from "zustand/middleware";
import Dataset, {Configs} from "../interfaces/DatasetInterface"
  
interface AppState {
    datasets : Dataset[] | null;
    datasetUsed: Dataset | null;
    queryDataset: string | '';
    selectedIndexes : number[] | [];
    selectedFeature : string | null;
    lazoMode : boolean;
    featureToDisplay: string | null;
    metricsConfig: Configs[] | [];
    internalConfigs: Object;
    addToReport: boolean;
    setSelectedIndexes : (selectedIndexes : number[]) => void;
    setSelectedFeature : (selectedFeature : string) => void;
    setData: (datasetUsed: Dataset) => void;
    setDatasets: (datasets: Dataset[] | null) => void;
    setLazoMode: (lazoMode : boolean ) => void;
    setQueryDataset: (queryDataset : string) => void;
    setFeatureToDisplay : (featureToDisplay: string | null) => void;
    setMetricsConfigs: (metricsConfig: Configs[] | []) => void;
    setInternalConfigs: (internalConfigs: Object) => void;
    setAddToReport: (addToReport: boolean) => void;
  }

  const useStore = create<AppState>()(
    persist(
        (set) => ({
            datasets: null,
            datasetUsed: null,
            queryDataset: "",
            selectedIndexes: [],
            selectedFeature: null,
            lazoMode: false,
            featureToDisplay: null,
            metricsConfig: [],
            internalConfigs: {},
            addToReport: false,
            setData: (datasetUsed) => set({ datasetUsed }),
            setDatasets: (datasets: Dataset[] | null) => set({ datasets }),
            setSelectedIndexes: (selectedIndexes: number[]) => set({ selectedIndexes }),
            setSelectedFeature: (selectedFeature: string) => set({ selectedFeature }),
            setLazoMode: (lazoMode: boolean) => set({ lazoMode }),
            setQueryDataset: (queryDataset: string) => set({ queryDataset }),
            setFeatureToDisplay : (featureToDisplay: string | null) => set({featureToDisplay}),
            setMetricsConfigs: (metricsConfig: Configs[] | []) => set({metricsConfig}),
            setInternalConfigs: (internalConfigs: Object) => set({internalConfigs}),
            setAddToReport:(addToReport: boolean) => set({addToReport})
        }),
        {
          name: "app-storage",
          partialize: (state) => ({
              datasets: state.datasets,
              datasetUsed: state.datasetUsed,
              selectedFeature: state.selectedFeature,
              //featureToDisplay: state.featureToDisplay
              // queryDataset is NOT included, so it won't be persisted
          }),
      }
  )
);

export default useStore;