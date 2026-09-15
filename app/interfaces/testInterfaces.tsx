import { ModelInfo } from "./homePageInterface";
import { RegisterObjectProps } from "./NNInterfaces";

export interface AttackConfig {
  epsilon: number;
  iterations: number;
  stepSize: number;
  targetClass?: number;
  confidence?: number;
}
export interface SingleAttackInput {
  input: string,
  attack: RegisterObjectProps,
  model: ModelInfo
}
export type ConfidenceSeries = number[] | { [key: string]: number };
export type ConfidenceData = { [key: string]: ConfidenceSeries };
export interface SingleAttackProps {
  adv_perturbation: string;
  x_adv: string;
  original_prediction: string;
  adversarial_prediction: string;
  confidence: ConfidenceData,
  advance_metrics: { [key: string]: number | null }
}

export interface AttackStats {
  ssim: number;
  executionTime: number;
}



export interface BubbleInterface {
  sender: "user" | "model";
  msg: string;
  score?: number;
}

export interface JailbreakAttackOutput {
  goal: string;
  success: boolean;
  best_prompt: string;
  best_response: string;
  best_score: number;
  history: { role: string; content: string; score?: number }[];
  conversations: { role: string; content: string; score?: number }[][];
  metadata: { [key: string]: any };
}
