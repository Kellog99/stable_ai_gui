import React from 'react'
import RepositoryCard, { CardProps } from './Card';
import { TriangleAlert } from 'lucide-react';
import './FileRepository.css'

interface FileRepositoryProps {
    elements: CardProps[],
    selectHandle: (id: string) => void
}

// This component has the role to create the card associated to the model or dataset repository
const FileRepository: React.FC<FileRepositoryProps> = ({
    elements,
    selectHandle,
}) => {
    return (
        <div className='repository-container'>
            {elements.length > 0 ?
                elements.map((element: CardProps) => (
                    <RepositoryCard
                        key={element.id}
                        {...element}
                        handleClick={selectHandle}
                    />
                )) :
                <div className='warning'>
                    <TriangleAlert size={"var(--icon-size)"} fill='var(--warning)' />
                    <p>File not found</p>
                </div>
            }
        </div>
    )
}

export default FileRepository;