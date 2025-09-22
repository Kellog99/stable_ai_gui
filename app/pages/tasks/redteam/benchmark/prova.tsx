import { AttackProps } from "@/interfaces/NNInterfaces"

export const listAttacks: AttackProps[] = [
  {
    "id": "fgsm",
    "name": "Fast Gradient Sign Method (FGSM)",
    "description": "A single-step adversarial attack that uses the gradient of the loss function to generate adversarial examples. It adds noise in the direction of the gradient to fool the model.",
    "parameters": [
      {
        "name": "epsilon",
        "label": "Epsilon",
        "min": 0.001,
        "max": 0.5,
        "step": 0.001,
        "default": 0.03,
        "description": "Maximum perturbation magnitude allowed for each pixel"
      },
      {
        "name": "norm",
        "label": "Norm Type",
        "min": 1,
        "max": 2,
        "step": 1,
        "default": 2,
        "description": "Type of norm used (L1 or L2)"
      }
    ]
  },
  {
    "id": "pgd",
    "name": "Projected Gradient Descent (PGD)",
    "description": "An iterative adversarial attack that applies multiple small perturbations projected onto an epsilon ball. More powerful than FGSM as it uses multiple iterations.",
    "parameters": [
      {
        "name": "epsilon",
        "label": "Epsilon",
        "min": 0.001,
        "max": 0.5,
        "step": 0.001,
        "default": 0.03,
        "description": "Maximum perturbation magnitude allowed"
      },
      {
        "name": "alpha",
        "label": "Step Size (Alpha)",
        "min": 0.0001,
        "max": 0.1,
        "step": 0.0001,
        "default": 0.01,
        "description": "Step size for each iteration"
      },
      {
        "name": "steps",
        "label": "Number of Steps",
        "min": 1,
        "max": 100,
        "step": 1,
        "default": 40,
        "description": "Number of gradient descent steps"
      },
      {
        "name": "random_start",
        "label": "Random Start",
        "min": 0,
        "max": 1,
        "step": 1,
        "default": 1,
        "description": "Whether to start from a random point (0 = false, 1 = true)"
      }
    ]
  },
  {
    "id": "cw",
    "name": "Carlini & Wagner (C&W)",
    "description": "An optimization-based attack that finds minimal perturbations by solving a constrained optimization problem. Known for generating high-quality adversarial examples.",
    "parameters": [
      {
        "name": "c",
        "label": "Confidence Parameter",
        "min": 0.1,
        "max": 100,
        "step": 0.1,
        "default": 1.0,
        "description": "Confidence parameter that controls the trade-off between perturbation size and attack success"
      },
      {
        "name": "kappa",
        "label": "Kappa",
        "min": 0,
        "max": 100,
        "step": 1,
        "default": 0,
        "description": "Minimum confidence gap for successful attack"
      },
      {
        "name": "steps",
        "label": "Optimization Steps",
        "min": 100,
        "max": 10000,
        "step": 100,
        "default": 1000,
        "description": "Number of optimization steps"
      },
      {
        "name": "lr",
        "label": "Learning Rate",
        "min": 0.001,
        "max": 1.0,
        "step": 0.001,
        "default": 0.01,
        "description": "Learning rate for the optimization process"
      }
    ]
  },
  {
    "id": "deepfool",
    "name": "DeepFool",
    "description": "An iterative attack that finds the minimal perturbation needed to cross the decision boundary by approximating the classifier with a linear model at each step.",
    "parameters": [
      {
        "name": "steps",
        "label": "Maximum Steps",
        "min": 1,
        "max": 1000,
        "step": 1,
        "default": 50,
        "description": "Maximum number of iterations"
      },
      {
        "name": "overshoot",
        "label": "Overshoot",
        "min": 0.01,
        "max": 1.0,
        "step": 0.01,
        "default": 0.02,
        "description": "Overshoot parameter to ensure crossing the boundary"
      }
    ]
  },
  {
    "id": "boundary",
    "name": "Boundary Attack",
    "description": "A black-box attack that starts from an adversarial example and walks along the decision boundary to find closer adversarial examples to the original input.",
    "parameters": [
      {
        "name": "steps",
        "label": "Attack Steps",
        "min": 100,
        "max": 50000,
        "step": 100,
        "default": 25000,
        "description": "Number of attack iterations"
      },
      {
        "name": "spherical_step",
        "label": "Spherical Step Size",
        "min": 0.001,
        "max": 0.1,
        "step": 0.001,
        "default": 0.01,
        "description": "Step size for spherical steps"
      },
      {
        "name": "source_step",
        "label": "Source Step Size",
        "min": 0.001,
        "max": 0.1,
        "step": 0.001,
        "default": 0.01,
        "description": "Step size for source steps"
      }
    ]
  }
]
