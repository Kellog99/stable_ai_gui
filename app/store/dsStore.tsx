import { create } from "zustand";
import Dataset from "../interfaces/DatasetInterface"
  
interface AppState {
    datasetUsed: Dataset | null;
    selectedIndexes : number[] | [];
    selectedFeature : string | null;
    lazoMode : bool;
    setSelectedIndexes : (selectedIndexes : number[]) => void;
    setSelectedFeature : (selectedFeature : string) => void;
    setData: (datasetUsed: Dataset) => void;
    setLazoMode: (lazoMode : bool) => void;
  }

const useStore = create<AppState>((set) => ({
    datasetUsed: null , 
    selectedIndexes: [],
    selectedFeature: null,
    lazoMode: false,
    setData: (datasetUsed) => set({ datasetUsed }),
    setSelectedIndexes : (selectedIndexes : number[])  => set({selectedIndexes}),
    setSelectedFeature : (selectedFeature : string)  => set({selectedFeature}),
    setLazoMode: (lazoMode : bool)=> set({lazoMode})
  }));

export default useStore;