import React, { useState } from 'react'
import RepositoryCard from './Card';
import { TriangleAlert } from 'lucide-react';
import './FileRepository.css'
import { DatasetInfo, ModelInfo } from '@/interfaces/NNInterfaces';

interface FileRepositoryProps {
    elements: ModelInfo[] | DatasetInfo[],
    activeId?: string,
    handleDelete: (model: ModelInfo | DatasetInfo) => void,
    selectHandle: (model: ModelInfo | DatasetInfo) => void,
}

// This component has the role to create the card associated to the model or dataset repository
const FileRepository: React.FC<FileRepositoryProps> = ({
    elements,
    activeId,
    selectHandle,
    handleDelete,
}) => {
    return (
        <div className='repository-container'>
            {elements.length > 0 ?
                elements.map((element: ModelInfo | DatasetInfo) => (
                    <RepositoryCard
                        key={element.id}
                        config={element}
                        activeId={activeId}
                        handleClick={() => {
                            selectHandle(element)
                        }}
                        handleDelete={()=>handleDelete(element)}
                    />
                )) :
                <div className='container-warning'>
                    <div className='warning'>
                        <TriangleAlert size={"var(--icon-size)"} fill='var(--warning)' />
                        <p>File not found</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default FileRepository;