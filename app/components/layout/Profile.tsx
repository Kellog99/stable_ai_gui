import React, { useState } from 'react'
import SettingsModal from '@/components/client/GlobalSettings/SettingsModal'
import { UserRound } from 'lucide-react'
import './Profile.css'

interface ProfileProps {
    isOpen: boolean;
}
const Profile: React.FC<ProfileProps> = ({
    isOpen
}) => {
    const [openSettings, setOpenSettings] = useState<boolean>(false)

    return (
        <>
            <button
                className='profile-container'
                onClick={() => setOpenSettings(true)}>
                <UserRound size={"var(--icon-size)"} />
                {isOpen ? "Settings" : null}
            </button>

            <SettingsModal
                isOpen={openSettings}
                onClose={() => setOpenSettings(false)}
            />

        </>
    )
}

export default Profile