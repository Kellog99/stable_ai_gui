import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Dataset, {Configs} from "../interfaces/DatasetInterface"
  
interface AppState {
    datasets : Dataset[] | null;
    datasetUsed: Dataset | null;
    queryDataset: string | '';
    selectedIndexes : number[] | [];
    selectedPoints: number[] | [];

    hoverIndex: number | null;
    selectedFeature : string | null;
    lazoMode : boolean;
    featureToDisplay: string | null;
    metricsConfig: Configs[] | [];
    internalConfigs: Object;

    addToReport: boolean;
    isLoadingEmbs : boolean;

    report: Object[] | [];
    colorMap: Partial<Record<number, number[]>>;
    uqColors: [number, number, number][] | null;

    filteredLabels: string[] | [];
    size: { width: number, height: number }


    setSelectedIndexes : (selectedIndexes : number[]) => void;
    setSelectedPoints: (selectedPoints : number[]) => void;
    setHoverIndex: (hoverIndex: number | null) => void
    setSelectedFeature : (selectedFeature : string) => void;
    setData: (datasetUsed: Dataset) => void;
    setDatasets: (datasets: Dataset[] | null) => void;
    setLazoMode: (lazoMode : boolean ) => void;
    setQueryDataset: (queryDataset : string) => void;
    setFeatureToDisplay : (featureToDisplay: string | null) => void;
    setMetricsConfigs: (metricsConfig: Configs[] | []) => void;
    setInternalConfigs: (internalConfigs: Object) => void;
    
    setAddToReport: (addToReport: boolean) => void;
    setIsLoadingEmbs: (isLoadingEmbs: boolean) => void;
    setReport: (report: Object[] | []) => void;
    setColorMap: (colorMap: Partial<Record<number, number[]>>) => void;
    setUqColors: (uqColors: [number, number, number][] | null) => void;

    setFilteredLabels: (filteredLabels: string[]| []) => void;
    setSize: (size: { width: number, height: number }) => void;
    
  }

  const useStore = create<AppState>()(
    persist(
        (set) => ({
            datasets: null,
            datasetUsed: null,
            queryDataset: "",
            selectedIndexes: [],
            selectedPoints: [],
            hoverIndex: null,
            selectedFeature: null,
            lazoMode: false,
            featureToDisplay: null,
            metricsConfig: [],
            internalConfigs: {},
            
            addToReport: false,
            isLoadingEmbs: true,
            report: [],
            colorMap: {},
            filteredLabels: [],
            size: { width: 690, height: 500 },
            uqColors: null,
            

            setData: (datasetUsed) => set({ datasetUsed }),
            setDatasets: (datasets: Dataset[] | null) => set({ datasets }),
            setSelectedIndexes: (selectedIndexes: number[]) => set({ selectedIndexes }),
            setSelectedPoints: (selectedPoints: number[]) => set({ selectedPoints }),
            setHoverIndex: (hoverIndex: number | null ) => set ({hoverIndex}),
            setSelectedFeature: (selectedFeature: string) => set({ selectedFeature }),
            setLazoMode: (lazoMode: boolean) => set({ lazoMode }),
            setQueryDataset: (queryDataset: string) => set({ queryDataset }),
            setFeatureToDisplay : (featureToDisplay: string | null) => set({featureToDisplay}),
            setMetricsConfigs: (metricsConfig: Configs[] | []) => set({metricsConfig}),
            setInternalConfigs: (internalConfigs: Object) => set({internalConfigs}),
            
            setAddToReport:(addToReport: boolean) => set({addToReport}),
            setIsLoadingEmbs:(isLoadingEmbs: boolean) => set({isLoadingEmbs}),
            setReport:(report: Object[] | []) => set({report}),
            setColorMap: (colorMap: Partial<Record<number, number[]>>) => set({colorMap}),
            setUqColors: (uqColors: [number, number, number][] | null) => set({uqColors}),

            setFilteredLabels: (filteredLabels: string[] | []) => set({filteredLabels}),
            setSize: (size: { width: number, height: number }) => set({size}),
        }),
        {
          name: "app-storage",
          storage: createJSONStorage(() => sessionStorage),
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