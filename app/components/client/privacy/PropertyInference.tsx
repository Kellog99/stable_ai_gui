import PrivacyAttackPanel from "./PrivacyAttackPanel";

const PropertyInference = () => (
    <PrivacyAttackPanel
        privacyType="property_inference"
        title="Property Inference Attack"
        description="Infer global properties of training data from model behavior."
    />
);

export default PropertyInference;