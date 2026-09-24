import type {ModelInfo} from '@/interfaces/homePageInterface';
import type {RegisterObjectProps} from '@/interfaces/NNInterfaces';
import type {JailbreakAttackOutput} from '@/interfaces/testInterfaces';
import type useJailbreakStore from '@/store/jailbreakStore';

type JailbreakActions = Pick<
    ReturnType<typeof useJailbreakStore.getState>,
    'setGoal' | 'setIsClicked' | 'setResults'
>;

interface HandleSubmitParams extends JailbreakActions {
    url: string;
    isActive: boolean;
    prompt: string;
    model: ModelInfo | null;
    selectedAttack: RegisterObjectProps | null;
    attackerModel: ModelInfo | null;
    judgeModel: ModelInfo | null;
    applyJailbreakOutput: (data: JailbreakAttackOutput, attackId?: string) => void;
}

export async function handleSubmit({
                                       url,
                                       isActive,
                                       prompt,
                                       model,
                                       selectedAttack,
                                       attackerModel,
                                       judgeModel,
                                       setGoal,
                                       setIsClicked,
                                       setResults,
                                       applyJailbreakOutput,
                                   }: HandleSubmitParams): Promise<void> {
    if (isActive && selectedAttack) {
        setIsClicked(true)
        const currentGoal = prompt
        setGoal(currentGoal)

        // Clear previous states before starting
        setResults({
            goal: currentGoal,
            resultAttackId: selectedAttack.id,
            fullHistory: [],
            conversationChat: [],
            modelResponse: "",
            adversarialPrompt: undefined,
            attackSuccess: false,
            bestScore: 0,
            attackMetadata: {},
        })

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    "input": prompt,
                    "model": model,
                    "attack": selectedAttack,
                    "task_type": "nlp",
                    "attacker": attackerModel,
                    "judge": judgeModel,
                    "device": "cuda"
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorDetail = await response.json();
                console.error('Server validation error:', JSON.stringify(errorDetail, null, 2));
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: JailbreakAttackOutput = await response.json();
            applyJailbreakOutput(data, selectedAttack.id);
        } catch (err) {
            console.error('Jailbreaking attack failed:', err)
            setGoal(undefined)
            setIsClicked(false)
        } finally {
            setIsClicked(false)
        }
    }
}
