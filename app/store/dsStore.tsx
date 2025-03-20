import { create } from "zustand";
import Dataset from "../interfaces/DatasetInterface"
  
interface AppState {
    datasetUsed: Dataset | null;
    setData: (datasetUsed: Dataset) => void;
  }

const useStore = create<AppState>((set) => ({
    datasetUsed: null , 
    setData: (datasetUsed) => set({ datasetUsed }),
  }));

export default useStore;