import { Job } from "@/interfaces/NNInterfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState
{
  dataset: Object | null;
  datasets: string[] | null;
  models: string[] | null;
  allJobs: Job[];
  

  setDataset: ( dataset: Object | null ) => void;
  setDatasets: (datasets: string[] | null) => void;
  setModels: (models: string[] | null) => void;
  setAllJobs: (allJobs: Job[]) => void;
  
 
}

const useNNTrustStore = create<AppState>()(
  persist(
    ( set ) => ( {
      dataset: null,
      datasets: null,
      models: null,
      allJobs: [],
      
     
      setDataset: ( dataset ) => set( { dataset } ),
      setDatasets: (datasets) => set({datasets}),
      setModels: (models) => set({models}),
      setAllJobs: (allJobs) => set({allJobs}),
      
      
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