import useNNTrustStore from "@/store/nnTrustStore";
import { ImageDisplay } from "@/components/client/test/ImageDisplay";
import { X } from "lucide-react";
import VulnerabilitySelection from "../test/VulnerabilitySelection";
import "./MembershipInference.css";
import { RingProgress, SemiCircleProgress } from "@mantine/core";
import { useState } from "react";

export interface MembershipInferenceProp {
    uploadedFile?: string;
    setUploadedFile: (file: string | undefined) => void;
    handleUploadFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;

}
export const MembershipInference: React.FC<MembershipInferenceProp> = ({
    uploadedFile,
    setUploadedFile,
    handleUploadFile
}) => {
    const {
        privacyAttacks,
        setPrivacyAttacks,
        model
    } = useNNTrustStore()

    if (Object.keys(privacyAttacks).length == 0) {
        // Se nessun attacco è stato fetchato, provo di nuovo a fetcharlo
    }

    const [value, setValue] = useState<number>(0)
    
    // prendo le variabili che sono passate
    return (
        <div className="mi-container">
            <VulnerabilitySelection
                attacks={privacyAttacks}
                isReady={false}
                handleSelection={function (e: React.ChangeEvent<HTMLSelectElement>): void {
                    throw new Error("Function not implemented.");
                }} handlePostRequest={function (): void {
                    throw new Error("Function not implemented.");
                }} handleChange={function (value: number[]): void {
                    throw new Error("Function not implemented.");
                }} attackResults={{
                    prediction: undefined,
                    confidence: undefined,
                    metrics: undefined
                }} />
            <ImageDisplay
                title="Image to test"
                placeholder='Load an PNG or a JPG file.'
                imageUrl={uploadedFile}
                handleUpload={handleUploadFile}
                actionButton={
                    <button
                        onClick={() => { setUploadedFile(undefined) }}
                    >
                        <X
                            size={20}
                            color="white"
                        />
                    </button>
                }
            />
            <SemiCircleProgress value={value} transitionDuration={250} label={`${value}%`} />
        </div>
    )
}
