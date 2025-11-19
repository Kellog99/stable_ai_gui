import { datasets_get, getAllNNReports, jobProgress_get, jobsId_get, models_get, start_job } from "@/properties/urlsNNTrust";

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