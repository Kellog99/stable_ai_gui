import { Job, ModelSpecs } from "@/interfaces/NNInterfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState
{
  dataset: Object | null;
  datasets: string[] | null;
  models: ModelSpecs[] | null;
  allJobs: Job[];
  modelName: string | null;
  

  setDataset: ( dataset: Object | null ) => void;
  setDatasets: (datasets: string[] | null) => void;
  setModels: (models: ModelSpecs[] | null) => void;
  setAllJobs: (allJobs: Job[]) => void;
  setModelName: (modelName: string | null) => void;
  
 
}

const useNNTrustStore = create<AppState>()(
  persist(
    ( set ) => ( {
      dataset: null,
      datasets: null,
      models: null,
      allJobs: [],
      modelName: null,
      
     
      setDataset: ( dataset ) => set( { dataset } ),
      setDatasets: (datasets) => set({datasets}),
      setModels: (models) => set({models}),
      setAllJobs: (allJobs) => set({allJobs}),
      setModelName: (modelName) => set({modelName}),
      
      
    } ),

    {
      name: "app-storage",
      storage: createJSONStorage( () => sessionStorage ),
      partialize: ( state ) => ( {
        datasets: state.dataset,
       

      } ),
    }
  )
);

export default useNNTrustStore;