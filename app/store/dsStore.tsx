import { create } from "zustand";
import Dataset from "../interfaces/DatasetInterface"
  
interface AppState {
    datasetUsed: Dataset | null;
    selectedIndexes : number[] | [];
    selectedFeature : string | null;
    setSelectedIndexes : (selectedIndexes : number[] | ((prev: number[]) => number[])) => void;
    setSelectedFeature : (selectedFeature : string) => void;
    setData: (datasetUsed: Dataset) => void;
  }

const useStore = create<AppState>((set) => ({
    datasetUsed: null , 
    selectedIndexes: [],
    selectedFeature: null,
    setData: (datasetUsed) => set({ datasetUsed }),
    setSelectedIndexes : (selectedIndexes) => set({selectedIndexes}),
    setSelectedFeature : (selectedFeature)  => set({selectedFeature})
  }));

export default useStore;