import { getAllNNReports, jobProgress_get, jobsId_get, models_get, start_job } from "@/properties/urlsNNTrust";
import { CardProps } from '@/components/client/repository/Card';
import { ModelInfo, RegisterObjectProps } from "@/interfaces/NNInterfaces";

// get all the models saved
export async function getAttacksList(): Promise<{ [key: string]: RegisterObjectProps }> {
  try {
    const response = await fetch('http://127.0.0.1:8000/attacks/getInfo');
    if (!response.ok) {
      throw new Error(`HTTP error for the attacks' list! Status: ${response.status}`);
    }
    const listAttacks: { [key: string]: RegisterObjectProps } = await response.json();
    return listAttacks
  } catch (err) {
    console.error(err instanceof Error ? err.message : "An unknown error occurred");
    throw err; // Re-throw so the caller can handle it
  }
}

export async function getDatasetsList() {

  const response = await fetch('http://127.0.0.1:8000/repository/dataset');

  if (!response.ok) throw new Error('Failed to get model info from the backend');

  const datasetsList = await response.json();
  return datasetsList
}

// get all the models saved
export async function getModelsList(): Promise<ModelInfo[]> {

  const response = await fetch('http://127.0.0.1:8000/repository/model');

  if (!response.ok) throw new Error('Failed to get model info from the backend');

  const modelsList = await response.json();
  console.log(modelsList)
  return modelsList
}

export async function startNewJob(jobConfig: Object) {
  await fetch(start_job, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // binary content type
    body: JSON.stringify(jobConfig),
  });


}

export async function getJobsId() {

  const response = await fetch(`${jobsId_get}`);

  if (!response.ok) throw new Error('Failed to get jobs ids from the backend');

  const jobsIds = await response.json();
  return jobsIds
}

export async function getProgress(id: number) {
  const response = await fetch(`${jobProgress_get}?id=${encodeURIComponent(id)}`);

  if (!response.ok) throw new Error('Failed to get jobs ids from the backend');

  const jobsIds = await response.json();
  return jobsIds
}


export async function getReports() {
  const response = await fetch(`${getAllNNReports}`);

  if (!response.ok) throw new Error('Failed to get NNTrust reports from the backend');

  const reportsList = await response.json();
  return reportsList
}