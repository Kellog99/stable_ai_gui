export interface AttackConfig {
  epsilon: number;
  iterations: number;
  stepSize: number;
  targetClass?: number;
  confidence?: number;
}

export interface AttackResult {
  originalImage: string;
  perturbation: string;
  adversarialImage: string;
  success: boolean;
  confidence: number;
  l2Distance: number;
  linfinityDistance: number;
  iterations: number;
  timestamp: number;
}

export interface AttackStats {
  successRate: number;
  averageDistortion: number;
  averageConfidence: number;
  executionTime: number;
}

export type AttackType = 
  | 'fgsm' 
  | 'pgd' 
  | 'cw' 
  | 'deepfool' 
  | 'jsma';

