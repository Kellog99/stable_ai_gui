import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { feature_post } from '../properties/urls';

function readPublicFolder(directory: string): string[] {
    let arrowFiles: string[] = [];

    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
        arrowFiles = arrowFiles.concat(readPublicFolder(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.arrow')) {
        arrowFiles.push(fullPath);
        }
    }
    return arrowFiles;
    }

export async function getArrowFileNames() {
    try {
        const datasetsDir = path.join(process.cwd(), 'public', 'datasets');
        const arrowFiles = readPublicFolder(datasetsDir);
        console.log('Matching files:', arrowFiles);
        const response = {
            files: arrowFiles,
            message: 'Files read successfully'
          };
      
          return NextResponse.json(response);
        } catch (error) {
          console.error('Error reading files:', error);
          return NextResponse.json(
            { error: 'Failed to read files' },
            { status: 500 }
          );
        }
      }


export default async function FeatureLoader(indexes,name) {
    try {
        const request = await getArrowFileNames();
        const data = await request.json();
        
        const fileNames: string[] = data.files;
        
        const fs = require('fs').promises;

        const files = await Promise.all(fileNames.map(async (fileName) => {
        try {
            const data = await fs.readFile(fileName);
            return data.buffer;
        } catch (error) {
            throw new Error(`Failed to read ${fileName}`);
        }
        }));

        const blob = new Blob(files, { type: 'application/octet-stream' });
        
        const response = await fetch(`${feature_post}?featureName=${encodeURIComponent(name)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' }, // binary content type
            body: blob,
        });

        if (!response.ok) throw new Error('Failed to send files to backend');

        const feature = await response.json();
        console.log('Server Response:', feature); // Handle the JSON response
        
        const decodedString = decodeURIComponent(indexes);
        console.log(decodedString)
        // Split the string into an array of strings using comma as the delimiter
        const indexesArray = decodedString.split(',');

        // Convert each element into an integer
        const numericIndexes = indexesArray.map(index => parseInt(index, 10));
        console.log(feature.datas[0])
        let filteredArr = [];
        numericIndexes.forEach(index => {
        filteredArr.push(feature.datas[index]);
        });
        const out = numericIndexes.map(index => feature.datas[index]);
        console.log("AHAH",filteredArr)
        return filteredArr
    } catch (error) {
        console.error('Error:', error);
    }
}
