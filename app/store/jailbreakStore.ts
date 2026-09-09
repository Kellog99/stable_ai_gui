import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ModelInfo } from "@/interfaces/homePageInterface";
import { BubbleInterface } from "@/interfaces/testInterfaces";

interface JailbreakState {
  // Inputs & Configuration
  prompt: string;
  goal: string | undefined;
  selectedAttackId: string | null;
  savedParams: Record<string, (number | string)[]>;
  attackerModel: ModelInfo | null;
  judgeModel: ModelInfo | null;
  backendStartupId: string | null;

  // Results & Execution State
  fullHistory: BubbleInterface[];
  conversationChat: BubbleInterface[][] | undefined;
  modelResponse: string | undefined;
  adversarialPrompt: string | undefined;
  attackSuccess: boolean | undefined;
  bestScore: number | undefined;
  attackMetadata: Record<string, unknown> | undefined;
  isClicked: boolean;

  // Actions
  setPrompt: (prompt: string) => void;
  setGoal: (goal: string | undefined) => void;
  setSelectedAttackId: (id: string | null) => void;
  setSavedParams: (updater: (prev: Record<string, (number | string)[]>) => Record<string, (number | string)[]>) => void;
  setAttackerModel: (model: ModelInfo | null) => void;
  setJudgeModel: (model: ModelInfo | null) => void;
  setAdversarialPrompt: (adversarialPrompt: string | undefined) => void;
  setBackendStartupId: (startupId: string | null) => void;
  setResults: (results: {
    goal: string;
    fullHistory: BubbleInterface[];
    conversationChat: BubbleInterface[][];
    modelResponse: string;
    adversarialPrompt: string | undefined;
    attackSuccess: boolean;
    bestScore: number;
    attackMetadata: Record<string, unknown>;
  }) => void;
  setIsClicked: (isClicked: boolean) => void;
  clearResults: () => void;
}

export const useJailbreakStore = create<JailbreakState>()(
  persist(
    (set) => ({
      prompt: "",
      goal: undefined,
      selectedAttackId: null,
      savedParams: {},
      attackerModel: null,
      judgeModel: null,
      backendStartupId: null,
      fullHistory: [],
      conversationChat: undefined,
      modelResponse: undefined,
      adversarialPrompt: undefined,
      attackSuccess: undefined,
      bestScore: undefined,
      attackMetadata: undefined,
      isClicked: false,

      setPrompt: (prompt) => set({ prompt }),
      setGoal: (goal) => set({ goal }),
      setSelectedAttackId: (selectedAttackId) => set({ selectedAttackId }),
      setSavedParams: (updater) => set((state) => ({ savedParams: updater(state.savedParams) })),
      setAttackerModel: (attackerModel) => set({ attackerModel }),
      setJudgeModel: (judgeModel) => set({ judgeModel }),
      setAdversarialPrompt: (adversarialPrompt) => set({ adversarialPrompt }),
      setBackendStartupId: (backendStartupId) => set({ backendStartupId }),
      setResults: (res) => set({ ...res, isClicked: false }),
      setIsClicked: (isClicked) => set({ isClicked }),
      clearResults: () => set({
        goal: undefined,
        fullHistory: [],
        conversationChat: undefined,
        modelResponse: undefined,
        adversarialPrompt: undefined,
        attackSuccess: undefined,
        bestScore: undefined,
        attackMetadata: undefined,
        isClicked: false,
      }),
    }),
    {
      name: "app-storage-jailbreak-v6",
      storage: createJSONStorage(() => localStorage),
      // partialize: (state) => ({
      //   prompt: state.prompt,
      //   selectedAttackId: state.selectedAttackId,
      //   savedParams: state.savedParams,
      //   attackerModel: state.attackerModel,
      //   judgeModel: state.judgeModel,
      //   backendStartupId: state.backendStartupId,
      // }),
    }
  )
);

export default useJailbreakStore;
