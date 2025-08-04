import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState
{
  dataset: Object | null;
  datasets: string[] | null;
  models: string[] | null;

  setDataset: ( dataset: Object | null ) => void;
  setDatasets: (datasets: string[] | null) => void;
  setModels: (models: string[] | null) => void;
 
}

const useNNTrustStore = create<AppState>()(
  persist(
    ( set ) => ( {
      dataset: null,
      datasets: null,
      models: null,
     
      setDataset: ( dataset ) => set( { dataset } ),
      setDatasets: (datasets) => set({datasets}),
      setModels: (models) => set({models}),
      
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