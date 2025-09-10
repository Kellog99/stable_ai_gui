import FileDropZone from '@/components/client/FileDropZone';
import { FileDropZoneProps, HomePageProps } from '@/interfaces/NNInterfaces';
import { Brain, Database } from 'lucide-react';
import React from 'react';


const HomePageDrop: React.FC<HomePageProps> = ( {
    dataset,
    model,
    onFileSelect,
    onTaskSelect
} ) =>
{
    //This create the grid for the loading part
    const homePageDropZones: FileDropZoneProps[] = [
        {
            title: "Dataset",
            Icon: Database,
            description: "Upload your dataset in ZIP format",
            acceptedTypes: [ '.zip' ],
            onFileSelect: ( file ) => onFileSelect( file, 'dataset' ),
            isLoaded: false,
            loadedFileName: "dataset?.name",
        },
        {
            title: "Model",
            Icon: Brain,
            description: "Upload your model in a `.pth` format",
            acceptedTypes: [ '.zip' ],
            onFileSelect: ( file ) => onFileSelect( file, 'model' ),
            isLoaded: false,
            loadedFileName: "dataset?.name",
        }
    ]
    return (
        <div className="file-grid">
            { homePageDropZones.map( ( dropElement: FileDropZoneProps, index: number ) => (
                <FileDropZone key={ index } { ...dropElement } />
            ) ) }
        </div>
    )
}

export default HomePageDrop