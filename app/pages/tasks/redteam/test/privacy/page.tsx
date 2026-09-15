'use client';

import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import { HatGlasses } from 'lucide-react';
import React, { ReactElement, useState } from 'react';

import './PrivacyStyle.css'
import PropertyInference from '@/components/client/privacy/PropertyInference';
import ModelInversion from '@/components/client/privacy/ModelInversion';
import MembershipInference from '@/components/client/privacy/MembershipInference';
import Reconstruction from '@/components/client/privacy/Reconstruction';

function Privacy() {
    const [test, setTest] = useState<string>("memb_inf")
    const pages: { [key: string]: ReactElement } = {
        "memb_inf": <MembershipInference key="memb_inf" />,
        "prop_inference": <PropertyInference key="prop_inference" />,
        "reconstruction": <Reconstruction key="reconstruction" />,
        "mod_inversion": <ModelInversion key="mod_inversion" />
    }


    return (
        <div className="container-pages">
            {/* Header */}
            <HeaderPageTask
                Icon={HatGlasses}
                title="Privacy Lab"
                description="Test whether a specific model has specific privacy vulnerabilities."
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
                        className={`btn ${test === "reconstruction" ? "active" : ""}`}
                        onClick={() => setTest("reconstruction")}
                    >
                        Reconstruction
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