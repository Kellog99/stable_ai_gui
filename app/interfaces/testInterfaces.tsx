import {ModelInfo} from "./homePageInterface";
import {RegisterObjectProps} from "./NNInterfaces";

export interface SingleAttackInput {
    input: string,
    device: "cpu" | "gpu" | "nps",
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


export interface BubbleInterface {
    sender: "user" | "model";
    msg: string;
    score?: number;
    /** Attacker's stated escalation rationale for this step (tree attacks). */
    improvement?: string;
    /** Escalation round the turn belongs to, 1-based (tree attacks). */
    depth?: number;
}

/** A single turn as emitted by the backend. `improvement` and `depth` are only
 *  produced by tree-shaped attacks (e.g. Tree-Crescendo). */
export interface JailbreakTurn {
    role: string;
    content: string;
    score?: number;
    improvement?: string;
    depth?: number;
}

export interface JailbreakAttackOutput {
    goal: string;
    success: boolean;
    best_prompt: string;
    best_response: string;
    best_score: number;
    history: JailbreakTurn[];
    conversations: JailbreakTurn[][];
    metadata: { [key: string]: any };
}

export interface JailbreakHistoryEntry {
    id: string;
    goal: string;
    success: boolean;
    best_score?: number;
    n_attempts: number;
    saved_at: string;
}
