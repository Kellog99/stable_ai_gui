import {ModelInfo} from "@/interfaces/homePageInterface";
import {RegisterObjectProps} from "@/interfaces/NNInterfaces";
import {SingleAttackInput, SingleAttackProps} from "@/interfaces/testInterfaces";
import {AttackResults} from "./page";

interface HandlePostRequestParams {
    url: string;
    file?: string;
    model: ModelInfo | null;
    attack?: RegisterObjectProps;
    isAttacking: boolean;
    setAdvImg: React.Dispatch<React.SetStateAction<string | null>>;
    setAdvPert: React.Dispatch<React.SetStateAction<string | null>>;
    setIsAttacking: (isAttacking: boolean) => void;
    setAttackResults: React.Dispatch<React.SetStateAction<AttackResults>>;
}

/*
This function is responsible for handling the post request for the single attack.
*/
export async function handlePostRequest({
                                            url,
                                            file,
                                            model,
                                            attack,
                                            isAttacking,
                                            setAdvImg,
                                            setAdvPert,
                                            setIsAttacking,
                                            setAttackResults
                                        }: HandlePostRequestParams) {
    // At this moment there could be one click at the time
    // If an attack has been executed then the button will not be available untill the attack finishes its process. 
    if (!!(file && model && attack && !isAttacking)) {
        setAdvImg(null)
        setAdvPert(null)
        setIsAttacking(true);
        try {
            // Extract base64 data safely
            const base64Image = file.includes(",")
                ? file.split(",")[1]
                : file;

            const input: SingleAttackInput = {
                attack: attack,
                input: base64Image,
                model: model
            }
            console.log(attack)
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(input),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorDetail = await response.json();
                console.error('Server validation error:', JSON.stringify(errorDetail, null, 2));
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: SingleAttackProps = await response.json();

            setAdvImg(data.x_adv)
            setAdvPert(data.adv_perturbation)

            // Store results locally for the visualization modal
            setAttackResults({
                prediction: {
                    original: data.original_prediction,
                    adversarial: data.adversarial_prediction,
                },
                confidence: data.confidence,
                metrics: data.advance_metrics,
                parameters: attack.parameters?.map((parameter) => ({...parameter})),
            });

        } catch (error) {
            console.error('ERROR:', error);
        } finally {
            // it ends the loading animation
            setIsAttacking(false)
        }

    }
};
