// components/ZipUploader.js
import React, { useState, useRef } from 'react';

const ZipUploader = () => {
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0]; // Get the first selected file
        if (!file) {
            setMessage('No file selected.');
            return;
        }

        if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
            setMessage('Please select a .zip file.');
            return;
        }

        setMessage(`Selected file: ${file.name}. Uploading...`);
        setLoading(true);

        const formData = new FormData();
        formData.append('folder_zip', file); // 'folder_zip' must match the FastAPI parameter name

        try {
            const response = await fetch(upload_post, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`Upload successful: ${data.message}`);
            } else {
                setMessage(`Upload failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error uploading:', error);
            setMessage(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Upload Zip File</h1>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".zip,application/zip" // Suggest only zip files
            />
            {loading && <p>Loading...</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default ZipUploader;import {ok} from 'assert';
import {files} from 'jszip';
import {endsWith,method} from 'lodash';
import {type} from 'os';
import {json} from 'stream/consumers';import {upload_post} from '@/properties/urls';

