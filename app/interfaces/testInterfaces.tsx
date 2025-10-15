export interface AttackConfig {
  epsilon: number;
  iterations: number;
  stepSize: number;
  targetClass?: number;
  confidence?: number;
}


export interface AdvanceResult {
  confidence: number[];
  ssim: number;
  executionTime: number
}

export interface AttackResult extends AdvanceResult {
  x: string;
  adv_perturbation: string;
  x_adv: string;
  original_prediction: string;
  adversarial_prediction: string;

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

