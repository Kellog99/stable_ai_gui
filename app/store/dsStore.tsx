import { create } from "zustand";
import Dataset from "../interfaces/DatasetInterface"
  
interface AppState {
    datasets : Dataset[] | null;
    datasetUsed: Dataset | null;
    //datasetUsed: string | undefined;
    queryDataset: string | '';
    selectedIndexes : number[] | [];
    selectedFeature : string | null;
    lazoMode : boolean;
    setSelectedIndexes : (selectedIndexes : number[]) => void;
    setSelectedFeature : (selectedFeature : string) => void;
    setData: (datasetUsed: Dataset) => void;
    setDatasets: (datasets: Dataset[] | null) => void;
    setLazoMode: (lazoMode : boolean ) => void;
    setQueryDataset: (queryDataset : string) => void;
  }

const useStore = create<AppState>((set) => ({
    datasets : null,
    datasetUsed: null , 
    queryDataset: '',
    selectedIndexes: [],
    selectedFeature: null,
    lazoMode: false,
    setData: (datasetUsed) => set({ datasetUsed }),
    setDatasets: (datasets: Dataset[] | null) => set({datasets}),
    setSelectedIndexes : (selectedIndexes : number[])  => set({selectedIndexes}),
    setSelectedFeature : (selectedFeature : string)  => set({selectedFeature}),
    setLazoMode: (lazoMode : boolean)=> set({lazoMode}),
    setQueryDataset: (queryDataset: string) => set({queryDataset}),
  }));

export default useStore;