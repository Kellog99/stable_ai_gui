import { Job, ModelSpecs } from "@/interfaces/NNInterfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  models: ModelSpecs[] | null;
  modelName: string | null;


  setModels: (models: ModelSpecs[] | null) => void;
  setModelName: (modelName: string | null) => void;


}

const useNNTrustStore = create<AppState>()(
  persist(
    (set) => ({
      models: null,
      modelName: null,


      setModels: (models) => set({ models }),
      setModelName: (modelName) => set({ modelName }),


    }),

    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // datasets: state.dataset,
      }),
    }
  )
);

export default useNNTrustStore;