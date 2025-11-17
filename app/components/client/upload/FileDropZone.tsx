"use client"
import React, { useState } from 'react';
import './FileDropZone.css';
import { FileDropZoneProps } from '@/interfaces/NNInterfaces';
import { DragDrop } from './DragDrop';
import { HardDrive, Upload } from 'lucide-react';
import ZipUploadComponent from './Uploader';
import { InfoLoader } from './InfoLoader';
import JSZip from 'jszip';

interface ParsedZipContent {
    dataFile: File | null;
    jsonFile: File | null;
    jsonContent: any;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
    id,
    title,
    description,
    Icon,
    config,
    fileType,
    storeSetter
}) => {
    const [upload, setUpload] = useState<boolean>(true);
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [parsedContent, setParsedContent] = useState<ParsedZipContent | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null);

    // const [activeSection, setActiveSection] = useState<string>(
    //     defaultActiveSection || sections[0]?.id || "selection"
    // );

    // const sectionsWithHandlers = sections.map(section => ({
    //     ...section,
    //     currentPage: activeSection,
    //     onClickHandle: () => setActiveSection(section.id)
    // }));

    // const currentSection = sectionsWithHandlers.find(s => s.id === activeSection);


    // This function handles the upload of the  zip file 
    // Hence, it handles the file decompression
    // and to set all the variables 
    const handleFileUpload = async (file: File | null) => {
        if (!file) {
            setZipFile(null);
            setParsedContent(null);
            setUploadStatus(null);
            return;
        }

        setLoading(true);
        try {
            const zip = new JSZip();
            const zipContent = await zip.loadAsync(file);

            let dataFile: File | null = null;
            let jsonContent: any = null;

            for (const [filename, fileData] of Object.entries(zipContent.files)) {
                if (fileData.dir) continue;

                // Extract model/data file
                if (filename.endsWith(`.${fileType}`)) {
                    const blob = await fileData.async("blob");
                    dataFile = new File([blob], filename);
                }

                // Extract JSON config
                if (filename.endsWith(".json")) {
                    const text = await fileData.async("string");
                    jsonContent = JSON.parse(text);
                }
            }

            if (!dataFile) {
                console.log(`No .${fileType} file found in this ZIP.`);
                setUploadStatus("error");
                return;
            }

            if (!jsonContent) {
                console.log("No JSON configuration file found in the ZIP.");
                setUploadStatus("error");
                return;
            }

            // Build parsed content
            const parsed: ParsedZipContent = {
                dataFile,
                jsonFile: null,
                jsonContent
            };

            setZipFile(file);
            setParsedContent(parsed);
            setUploadStatus("success");

            // Call storeSetter with dataFile and spread jsonContent properties
            if (storeSetter) {
                storeSetter(dataFile, jsonContent.name, jsonContent.num_classes);
            }

            console.log("ZIP parsed successfully.");
        } catch (error) {
            console.error("Error parsing ZIP: ", error);
            setUploadStatus("error");
        } finally {
            setLoading(false);
        }
    };

    // This function handle the uploading of the model or dataset inside the repository
    const handleRepositoryUpload = async () => {
        // TO DO
    };


    return (
        <div
            key={id}
            className="containerDropzone">
            <p className="dropTitle">
                <Icon size={35} /> {title} Selection <InfoLoader config={config} />
            </p>
            <p className="dropDescription">
                {description}
            </p>


            <div className="selection-buttons">
                <button
                    onClick={() => setUpload(true)}
                    className={`selection-button ${upload ? "active" : ""}`}>

                    <Upload size={"var(--icon-size)"} />
                    <span>Upload</span>
                </button>

                <button
                    onClick={() => setUpload(false)}
                    className={`selection-button ${!upload ? "active" : ""}`}>

                    <HardDrive size={"var(--icon-size)"} />
                    <span>Repository</span>
                </button>
            </div>


            {
                upload ?
                    <div className='container-upload'>
                        {/* Load Zone*/}
                        <DragDrop
                            name={title}
                            Icon={Icon}
                            acceptedType={"zip"}
                            description={description}
                            onFileSelect={handleFileUpload}
                        />

                        {/* Load button */}
                        <button
                            onClick={handleRepositoryUpload}
                            className='load-button'
                            disabled={zipFile ? true : false}
                        >
                            <Upload /> Upload into the Repository.
                        </button>
                    </div>
                    : <ZipUploadComponent />
            }
        </div >
    );
}

export default FileDropZone;