import {ParametersProps, RegisterObjectProps} from '@/interfaces/NNInterfaces'


export function updateParameterDefaults(
    parameters: ParametersProps[],
    values: (number | string)[]
): ParametersProps[] {
    return parameters.map((parameter, index) => ({
        ...parameter,
        default: values[index] ?? parameter.default,
    }))
}

export function updateSelectedObjects(
    id: string,
    selected: Record<string, RegisterObjectProps>,
    available: Record<string, RegisterObjectProps>,
    visible: Record<string, RegisterObjectProps> = available
): Record<string, RegisterObjectProps> {
    if (id === 'all') {
        return {...selected, ...visible}
    }

    if (id === 'none') {
        const visibleIds = new Set(Object.keys(visible))
        return Object.fromEntries(
            Object.entries(selected).filter(([selectedId]) => !visibleIds.has(selectedId))
        )
    }

    const updated = {...selected}
    if (id in updated) {
        delete updated[id]
    } else {
        updated[id] = available[id]
    }
    return updated
}
