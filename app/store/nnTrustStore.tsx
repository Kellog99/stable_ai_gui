import { ModelSpecs } from "@/interfaces/NNInterfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  models: ModelSpecs[] | null;
  modelName: string | null;
  attacks: Set<string>;
  enableMonitoring: boolean      // this variable allows to tell wheter the benchmark has been executed or not


  setModels: (models: ModelSpecs[] | null) => void;
  setModelName: (modelName: string | null) => void;
  setAttacks: (attacks: Set<string>) => void;
  setEnableMonitoring: (enableMonitoring: boolean) => void;

  updateAttacks: (attack: string) => void;

}

const useNNTrustStore = create<AppState>()(
  persist(
    (set) => ({
      models: null,
      modelName: null,
      attacks: new Set(),
      enableMonitoring: false,

      setModels: (models) => set({ models }),
      setModelName: (modelName) => set({ modelName }),
      setAttacks: (attacks: Set<string>) => set({ attacks }),
      setEnableMonitoring: (enableMonitoring: boolean) => set({ enableMonitoring }),

      updateAttacks: (attack: string) =>
        set((state) => {
          const updatedAttacks = new Set(state.attacks);
          updatedAttacks.add(attack);
          return { attacks: updatedAttacks };
        }),
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