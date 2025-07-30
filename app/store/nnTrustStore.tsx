import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// store con variabili di nntrust 

interface AppState
{
  dataset: Object | null;
  setDataset: ( dataset: Object | null ) => void;
}

const useNNTrustStore = create<AppState>()(
  persist(
    ( set ) => ( {
      dataset: null,
     
      setDataset: ( dataset ) => set( { dataset } ),
      
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