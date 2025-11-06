import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Dataset, { Configs} from "../interfaces/genericInterface";
import { ResultPoll } from "@/interfaces/metricsInterface";
import { DQReportProps } from "@/interfaces/reportInterfaces";

interface AppState {
  datasets: Dataset[] | null;
  datasetUsed: Dataset | null;
  queryDataset: string | '';
  selectedIndexes: number[];
  selectedPoints: number[];

  hoverIndex: number | null;
  selectedFeature: string | null;
  lazoMode: boolean;
  featureToDisplay: string | null;
  metricsConfig: Configs[];
  internalConfigs: Object;
  reportFromBE: DQReportProps | null;


  labelDict: { [key: number]: string } | null;

  addToReport: boolean;
  isLoadingEmbs: boolean;

  report: Object[];
  colorMap: Partial<Record<number, number[]>>;
  uqColors: [number, number, number][] | null;

  filteredLabels: string[];
  size: { width: number, height: number }

  prototypesData: string[] | null;
  labelProtoData: number[] | null;
  labelToSamples: { label: string; samples: number }[]

  showOverview: boolean;
  collapsed: boolean;

  activeTask: string;

  


  setSelectedIndexes: ( selectedIndexes: number[] ) => void;
  setSelectedPoints: ( selectedPoints: number[] ) => void;
  setHoverIndex: ( hoverIndex: number | null ) => void
  setSelectedFeature: ( selectedFeature: string ) => void;
  setData: ( datasetUsed: Dataset | null ) => void;
  setDatasets: ( datasets: Dataset[] | null ) => void;
  setLazoMode: ( lazoMode: boolean ) => void;
  setQueryDataset: ( queryDataset: string ) => void;
  setFeatureToDisplay: ( featureToDisplay: string | null ) => void;
  setMetricsConfigs: ( metricsConfig: Configs[] | [] ) => void;
  setInternalConfigs: ( internalConfigs: Object ) => void;
  setReportFromBE: ( reportFromBE: DQReportProps | null ) => void;  

  setLabelDict: (labelDict: { [key: number]: string } | null) => void;

  setAddToReport: (addToReport: boolean) => void;
  setIsLoadingEmbs: (isLoadingEmbs: boolean) => void;
  setReport: (report: Object[] | []) => void;
  setColorMap: (colorMap: Partial<Record<number, number[]>>) => void;
  setUqColors: (uqColors: [number, number, number][] | null) => void;

  setFilteredLabels: (filteredLabels: string[] | []) => void;
  setSize: (size: { width: number, height: number }) => void;
  setPrototypesData: (prototypesData: string[] | null) => void;
  setLabelProtoData: (labelProtoData: number[] | null) => void;
  setLabelToSamples: (labelToSamples: { label: string; samples: number }[]) => void;

  setShowOverview: (showOverview: boolean) => void;
  setCollapsed: (collapsed: boolean) => void;

  setActiveTask: ( activeTask: string ) => void;

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
      reportFromBE: null,

      labelDict: null,

      addToReport: false,
      isLoadingEmbs: true,
      report: [],
      colorMap: {},
      filteredLabels: [],
      size: { width: 690, height: 500 },
      uqColors: null,

      prototypesData: null,
      labelProtoData: null,
      labelToSamples: [],
      showOverview: true,

      collapsed: false,

      activeTask: "",


      setData: (datasetUsed) => set({ datasetUsed }),
      setDatasets: (datasets: Dataset[] | null) => set({ datasets }),
      setSelectedIndexes: (selectedIndexes: number[]) => set({ selectedIndexes }),
      setSelectedPoints: (selectedPoints: number[]) => set({ selectedPoints }),
      setHoverIndex: (hoverIndex: number | null) => set({ hoverIndex }),
      setSelectedFeature: (selectedFeature: string) => set({ selectedFeature }),
      setLazoMode: (lazoMode: boolean) => set({ lazoMode }),
      setQueryDataset: (queryDataset: string) => set({ queryDataset }),
      setFeatureToDisplay: (featureToDisplay: string | null) => set({ featureToDisplay }),
      setMetricsConfigs: (metricsConfig: Configs[] | []) => set({ metricsConfig }),
      setInternalConfigs: (internalConfigs: Object) => set({ internalConfigs }),
      setReportFromBE: (reportFromBE: DQReportProps | null) => set({ reportFromBE }),

      setLabelDict: (labelDict: { [key: number]: string } | null) => set({ labelDict }),

      setAddToReport: (addToReport: boolean) => set({ addToReport }),
      setIsLoadingEmbs: (isLoadingEmbs: boolean) => set({ isLoadingEmbs }),
      setReport: (report: Object[] | []) => set({ report }),
      setColorMap: (colorMap: Partial<Record<number, number[]>>) => set({ colorMap }),
      setUqColors: (uqColors: [number, number, number][] | null) => set({ uqColors }),

      setFilteredLabels: (filteredLabels: string[] | []) => set({ filteredLabels }),
      setSize: (size: { width: number, height: number }) => set({ size }),

      setPrototypesData: (prototypesData: string[] | null) => set({ prototypesData }),
      setLabelProtoData: (labelProtoData: number[] | null) => set({ labelProtoData }),
      setLabelToSamples: (labelToSamples: { label: string; samples: number }[]) => set({ labelToSamples }),

      setShowOverview: ( showOverview: boolean ) => set( { showOverview } ),
      setCollapsed: ( collapsed: boolean ) => set( { collapsed } ),

      setActiveTask: ( activeTask: string ) => set( { activeTask } ),
    } ),

    {
      name: "app-storage-dq",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        datasets: state.datasets,
        datasetUsed: state.datasetUsed,
        selectedFeature: state.selectedFeature,
        report: state.report,
        prototypesData: state.prototypesData,
        labelProtoData: state.labelProtoData,
        labelToSamples: state.labelToSamples,
        activeTask: state.activeTask,
        //featureToDisplay: state.featureToDisplay
        // queryDataset is NOT included, so it won't be persisted
      }),
    }
  )
);

interface ActionStore {
  actionResult: ResultPoll;
  resolver: ((value: ResultPoll) => void) | null;
  setActionResult: (result: ResultPoll) => void;
  waitForActionResult: () => Promise<ResultPoll>;
}

export const useActionStore = create<ActionStore>((set, get) => ({
  actionResult: { origin: "", data: {} },
  resolver: null, // used to resolve waiting Promises

  setActionResult: (result: ResultPoll) => {
    set({ actionResult: result });
    // Resolve any pending promise
    const resolver = get().resolver;
    if (resolver) {
      resolver(result);
      set({ resolver: null }); // clean up
    }
  },

  waitForActionResult: () =>
    new Promise((resolve) => set({ resolver: resolve })),
}));

export default useStore;



