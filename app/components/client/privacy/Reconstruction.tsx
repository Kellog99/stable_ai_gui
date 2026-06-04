import PrivacyAttackPanel from "./PrivacyAttackPanel";

const Reconstruction = () => (
    <PrivacyAttackPanel
        privacyType="reconstruction"
        title="Reconstruction Attack"
        description="MIFace optimizes synthetic inputs to reconstruct representative training samples from model gradients."
    />
);

export default Reconstruction;
