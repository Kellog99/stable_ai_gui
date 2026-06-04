import PrivacyAttackPanel from "./PrivacyAttackPanel";

const ModelInversion = () => (
    <PrivacyAttackPanel
        privacyType="model_inversion"
        title="Model Inversion Attack"
        description="E3 trains a surrogate model via query access and inverts it to recover approximate training distributions."
    />
);

export default ModelInversion;