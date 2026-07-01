import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  hostname: string,
  port: string,
  setHostname: (hostname: string) => void;
  setPort: (port: string) => void;
}

const useBackendVariablesStore = create<AppState>()(
  persist(
    (set) => ({
      hostname: "localhost",
      port: "8000",
      setHostname: (hostname) => set({ hostname }),
      setPort: (port) => set({ port }),
    }),
    {
      name: "app-storage-global",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        port: state.port,
        hostname: state.hostname,
      }),
    }
  )
);

export default useBackendVariablesStore;