'use client';

import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import { HatGlasses, Play } from 'lucide-react';
import React, { ReactElement, useEffect, useState } from 'react';

import './PrivacyStyle.css'
import PropertyInference from '@/components/client/privacy/PropertyInference';
import ModelInversion from '@/components/client/privacy/ModelInversion';
import { MembershipInference } from '@/components/client/privacy/MembershipInference';

function Privacy() {
    const [test, setTest] = useState<string>("memb_inf")
    const [child, setChild] = useState<React.ReactNode>(<MembershipInference />)


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
    const pages: { [key: string]: ReactElement } = {
        "memb_inf": <MembershipInference
            key="memb_inf"
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            handleUpload={handleUploadFile}
        />,
        "prop_inference": <PropertyInference key="prop_inference"/>,
        "mod_inversion": <ModelInversion key="mod_inversion"/>
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
            <button className='execute-btn'>
                <Play /> Test
            </button>
        </div>
    );
}

export default Privacy;