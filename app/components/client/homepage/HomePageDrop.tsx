import FileDropZone from '@/components/client/FileDropZone';
import { FileDropZoneProps, HomePageProps } from '@/interfaces/NNInterfaces';
import { Brain, Database } from 'lucide-react';
import React from 'react';
import styles from '@/styles/HomePage.module.css';


const HomePageDrop: React.FC<HomePageProps> = ({
    dataset,
    model,
    onFileSelect,
    onTaskSelect
}) => {
    //This create the grid for the loading part
    const homePageDropZones: FileDropZoneProps[] = [
        {
            id: "drop1",
            title: "Dataset",
            Icon: Database,
            description: "Upload your dataset in ZIP format",
            acceptedTypes: ['.zip'],
            onFileSelect: (file) => onFileSelect(file, 'dataset'),
            isLoaded: false,
            loadedFileName: "dataset?.name",
        },
        {
            id: "drop2",
            title: "Model",
            Icon: Brain,
            description: "Upload your model in a `.pth` format",
            acceptedTypes: ['.zip'],
            onFileSelect: (file) => onFileSelect(file, 'model'),
            isLoaded: false,
            loadedFileName: "dataset?.name",
        }
    ]
    return (

        <div className={styles.filegrid}>
            {homePageDropZones.map((dropElement: FileDropZoneProps) => (
                <FileDropZone key={dropElement.id} {...dropElement} />
            ))}
        </div>
    )
}

export default HomePageDrop