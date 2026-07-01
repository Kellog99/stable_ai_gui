"use server";
import { dataset_get, datasets_get, save_get } from '../../properties/urls';
import { revalidatePath } from "next/cache";
import fsPromises from "node:fs/promises";

export default async function DatasetsLoader() {
    const response = await fetch(datasets_get);
    if (!response.ok) throw new Error('Failed to send files to backend');
    return response.json();
}

export async function DatasetGetter(datasetName: string) {
    const url = new URL(dataset_get);
    url.searchParams.append('dataset', datasetName);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to send files to backend');
    return response.json();
}

export async function AutomaticSave(datasetName: string) {
    const url = new URL(save_get);
    url.searchParams.append('datasetName', datasetName);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to save dataset');
}

export async function GetDatasetAndSave(datasetName: string) {
    const dataset = await DatasetGetter(datasetName);
    await AutomaticSave(datasetName);
    return dataset;
}



export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    try {
        await fsPromises.writeFile(`./public/${file.name}`, buffer);
    } catch (error) {
        console.error('Error writing file:', error);
    }
    revalidatePath("/");
}
