import {LucideIcon} from "lucide-react";
import {ReactEventHandler} from "react";
import {Task} from "@/interfaces/homePageInterface";


export interface ButtonProps {
    id: string,
    name: string
    Icon: LucideIcon;
    currentPage: string;
    onClickHandle: ReactEventHandler
}

export interface ParametersProps {
    id: string
    name: string
    min?: number
    max?: number
    step?: number
    default: number | string | boolean
    description: string
    kind?: 'number' | 'enum' | 'boolean' | 'string'
    options?: string[]
}

export interface RegisterObjectProps {
    id: string,
    name: string,
    description?: string
    parameters: ParametersProps[]
    task: Task[] | Task
    knowledge?: string
    objective?: string
    type?: string
    nature?: string
    category?: string
    attack_type?: string
    privacy_type?: string
}

/**
 * Checks whether a registered object supports the given task.
 * Handles both a single task and a list of tasks using case-insensitive matching.
 * @param.registeredObject : this is the object to check whether its task(s) is/are supported
 * @param.task : Task to check
 */
export const supportsTask = (
    registeredObject: RegisterObjectProps,
    task: string
): boolean => {
    const normalizedTask: string = task.toLowerCase();
    const supportedTasks: string[] = Array.isArray(registeredObject.task)
        ? registeredObject.task
        : [registeredObject.task];

    return supportedTasks.some((supportedTask) => supportedTask.toLowerCase() === normalizedTask);
};

export const ATTACK_STATUSES = ['pending', 'in progress', 'finished', 'error'] as const;

export type AttackStatus = typeof ATTACK_STATUSES[number];

export interface ParameterLogProps {
    id: string;
    name?: string | null;
    value: unknown;
    description?: string | null;
}

export interface JobResult {
    id: string;
    parameters?: ParameterLogProps[] | null;
    result?: Record<string, unknown> | null;
    total?: number | null;
    progress?: number | null;
    iteration_time?: number | null;
    execution_time?: number | null;
    estimated_execution_time?: number | null;
    status: AttackStatus;
    error?: string | null;
}
