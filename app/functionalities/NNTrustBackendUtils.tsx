import { datasets_get, models_get } from "@/properties/urlsNNTrust";

export async function getDatasets() {

  const response = await fetch(`${datasets_get}`);

  if (!response.ok) throw new Error('Failed to get model info from the backend');

  const datasetsList = await response.json();
  return datasetsList
}


export async function getModels() {

  const response = await fetch(`${models_get}`);

  if (!response.ok) throw new Error('Failed to get model info from the backend');

  const modelsList = await response.json();
  return modelsList
}