import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

interface AppState {
    hostname: string,
    port: string,
    device: "cpu" | "gpu" | "nps",
    setHostname: (hostname: string) => void;
    setPort: (port: string) => void;
    setDevice: (device: "cpu" | "gpu" | "nps") => void
}

const useBackendVariablesStore = create<AppState>()(
    persist(
        (set) => ({
            hostname: "localhost",
            port: "8000",
            device: "gpu",
            setHostname: (hostname: string) => set({hostname}),
            setPort: (port: string) => set({port}),
            setDevice: (device: "cpu" | "gpu" | "nps") => set({device})
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