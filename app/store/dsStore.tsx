import { create } from "zustand";
import Dataset from "../interfaces/DatasetInterface"
  
interface AppState {
    datasetUsed: Dataset | null;
    selectedIndexes : number[] | [];
    selectedFeature : string | null;
    setSelectedIndexes : (selectedIndexes : number[]) => void;
    setSelectedFeature : (selectedFeature : string) => void;
    setData: (datasetUsed: Dataset) => void;
  }

const useStore = create<AppState>((set) => ({
    datasetUsed: null , 
    selectedIndexes: [],
    selectedFeature: null,
    setData: (datasetUsed) => set({ datasetUsed }),
    setSelectedIndexes : (selectedIndexes : number[])  => set({selectedIndexes}),
    setSelectedFeature : (selectedFeature : string)  => set({selectedFeature})
  }));

export default useStore;