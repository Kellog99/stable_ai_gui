import React from 'react'
import { Brain, Database } from 'lucide-react';
import { FileDropZoneProps } from "@/app/types";
import FileDropZone from "@/app/components/FileDropZone";
import { HomePageProps } from "@/app/types";

const HomePageDrop: React.FC<HomePageProps> = ({
    dataset,
    model,
    onFileSelect,
    onTaskSelect
}) => {
    //This create the grid for the loading part
    const homePageDropZones: FileDropZoneProps[] = [
        {
            title: "Dataset",
            Icon: Database,
            description: "Upload your dataset in ZIP format",
            acceptedTypes: ['.zip'],
            onFileSelect: (file) => onFileSelect(file, 'dataset'),
            isLoaded: false,
            loadedFileName: "dataset?.name",
        },
        {
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
        <div className="file-grid">
            {homePageDropZones.map((dropElement: FileDropZoneProps) =>
                <FileDropZone {...dropElement} />
            )}
        </div>
    )
}

export default HomePageDrop