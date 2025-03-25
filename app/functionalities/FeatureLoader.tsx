"use server";

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

export async function getArrowFileNames(datasetName) {
    try {
        const datasetsDir = path.join(process.cwd(), 'public', 'datasets', datasetName);
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


export default async function featureLoader(datasetName, featureName) {
    try {
        const request = await getArrowFileNames(datasetName);
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
        const response = await fetch(`${feature_post}?featureName=${encodeURIComponent(featureName)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            body: blob,
        });

        if (!response.ok) throw new Error('Failed to send files to backend');

        const feature = await response.json();
        return feature

    } catch (error) {
        console.error('Error:', error);
    }
}
