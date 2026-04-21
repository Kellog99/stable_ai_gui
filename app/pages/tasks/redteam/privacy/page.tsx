'use client';

import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import { HatGlasses, Play } from 'lucide-react';
import React, { ReactElement, useEffect, useState } from 'react';

import './PrivacyStyle.css'
import PropertyInference from '@/components/client/privacy/PropertyInference';
import ModelInversion from '@/components/client/privacy/ModelInversion';
import MembershipInference from '@/components/client/privacy/MembershipInference';
import useNNTrustStore from '@/store/nnTrustStore';

function Privacy() {

    const {
        attacks,
        model
    } = useNNTrustStore()

    const [test, setTest] = useState<string>("memb_inf")


    const [uploadedFile, setUploadedFile] = useState<string>()

    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string; // Now it's a string!
                setUploadedFile(base64String);
            };
            reader.readAsDataURL(file);
        }
    }



    function simulateResults(): {} {
        const base = Math.random() * 0.2;
        const acc = 0.6 + base + Math.random() * 0.1;
        const auc = 0.55 + base + Math.random() * 0.15;
        const adv = acc - 0.5;
        const prec = 0.58 + Math.random() * 0.2;
        const rec = 0.55 + Math.random() * 0.2;
        const f1 = (2 * prec * rec) / (prec + rec);
        return {
            'Attack Accuracy': acc,
            'AUC-ROC': auc,
            'Advantage': adv,
            'Precision': prec,
            'Recall': rec,
            'F1-Score': f1,
        }
    }
    const type = model && model.type ? model.type : "cv"
    const pages: { [key: string]: ReactElement } = {
        "memb_inf": <MembershipInference
            listAttacks={Object.values(attacks)}
            type={"llm"}
            results={simulateResults()}
        />,
        "prop_inference": <PropertyInference key="prop_inference" />,
        "mod_inversion": <ModelInversion key="mod_inversion" />
    }


    return (
        <div className="container-pages">
            {/* Header */}
            <HeaderPageTask
                Icon={HatGlasses}
                title="Testing Lab"
                descrition="See whether a specific model has some privacy vulnerabilities."
            />
            <div className='privacy-container'>
                <div className='btn-container'>
                    <button
                        className={`btn ${test === "memb_inf" ? "active" : ""}`}
                        onClick={() => setTest("memb_inf")}
                    >
                        Membership Inference
                    </button>
                    <button
                        className={`btn ${test === "prop_inference" ? "active" : ""}`}
                        onClick={() => setTest("prop_inference")}
                    >
                        Property Inference
                    </button>
                    <button
                        className={`btn ${test === "mod_inversion" ? "active" : ""}`}
                        onClick={() => setTest("mod_inversion")}
                    >
                        Model Inversion
                    </button>
                </div>
                {pages[test]}
            </div>
        </div>
    );
}

export default Privacy;