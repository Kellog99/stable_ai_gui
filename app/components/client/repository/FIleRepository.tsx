import React from 'react'

export interface RepositoryCardProps {
    id: string,
    name: string,
    image: string,
    properties: { [key: string]: string }
}

// This component has the role to create the card associated to the model or dataset repository
const FileRepositoryCards: React.FC<RepositoryCardProps[]> = ({
    repositoryCards
}) => {

    return (
        <div>Repository</div>
    )
}

export default FileRepositoryCards;