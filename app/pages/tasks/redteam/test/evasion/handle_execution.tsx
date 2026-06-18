import { ModelInfo } from "@/interfaces/homePageInterface";
import { RegisterObjectProps } from "@/interfaces/NNInterfaces";
import { SingleAttackInput, SingleAttackProps } from "@/interfaces/testInterfaces";
import { AttackResults } from "./page";

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
This function is responsable for handling the post request for the single attack.
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
                image: base64Image,
                model: model
            }

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(input),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data: SingleAttackProps = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

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
            });

        } catch (error) {
            console.error('ERROR:', error);
        } finally {
            // it ends the loading animation
            setIsAttacking(false)
        }

    }
};