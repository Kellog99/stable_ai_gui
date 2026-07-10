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
  image: string,
  attack: RegisterObjectProps,
  model: ModelInfo
}
export interface SingleAttackProps {
  adv_perturbation: string;
  x_adv: string;
  original_prediction: string;
  adversarial_prediction: string;
  confidence: { [key: string]: number[] },
  advance_metrics: { [key: string]: number }
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
  metadata: { [key: string]: any };
}
