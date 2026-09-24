import PrivacyAttackPanel from './PrivacyAttackPanel';

const MembershipInference = () => (
    <PrivacyAttackPanel
        privacyType="membership_inference"
        title="Membership Inference Attack"
        description="Determine whether a specific data point was used during model training. These attacks exploit overfitting behaviors and confidence gaps exposed through model queries."
    />
);

export default MembershipInference;