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

export type AttackType =
  | 'fgsm'
  | 'pgd'
  | 'cw'
  | 'deepfool'
  | 'jsma';

