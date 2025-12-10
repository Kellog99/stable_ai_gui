import { getInfoAttacks, getInfoMetrics, jobsId_get, getListModels, start_job, getListDataset, getListModelsReport } from "@/properties/urlsNNTrust";
import { ModelInfo, RegisterObjectProps } from "@/interfaces/NNInterfaces";
import { BenchmarkDataProps, ReportAttacksProps } from "@/interfaces/reportInterfaces";

// get all the models saved
export async function getAttacksList(): Promise<{ [key: string]: RegisterObjectProps }> {
  try {
    const response = await fetch(getInfoAttacks);
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

// get all the models saved
export async function getMetricsList(): Promise<{ [key: string]: RegisterObjectProps }> {
  try {
    const response = await fetch(getInfoMetrics);
    if (!response.ok) {
      throw new Error(`HTTP error for the attacks' list! Status: ${response.status}`);
    }
    const listMetrics: { [key: string]: RegisterObjectProps } = await response.json();
    return listMetrics
  } catch (err) {
    console.error(err instanceof Error ? err.message : "An unknown error occurred");
    throw err; // Re-throw so the caller can handle it
  }
}

export async function getDatasetsList() {

  const response = await fetch(getListDataset);

  if (!response.ok) throw new Error('Failed to get model info from the backend');

  const datasetsList = await response.json();
  return datasetsList
}

// get all the models saved
export async function getModelsList(): Promise<ModelInfo[]> {

  const response = await fetch(getListModels);

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


// get all the reports from the 
export async function getReports(url: string) {
  const response = await fetch(url);

  if (!response.ok) throw new Error('Failed to get NNTrust reports from the backend');

  const reportsList: Promise<ReportAttacksProps[]> = await response.json();
  console.log("report list ", reportsList)
  return reportsList
}

export async function uploadReport(url: string, file: File) {
  console.log("file = ", file)
  const fileContents = await file.text(); // or file.arrayBuffer() then decode
  const jsonData = JSON.parse(fileContents);

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(jsonData),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  if (!response.ok) throw new Error('Failed to get NNTrust reports from the backend');
  const report = await response.json();
  return report
}

export async function getBenchmarkList() {
  const response = await fetch(getListModelsReport);
  if (!response.ok) throw new Error('Failed to get NNTrust reports from the backend');

  const benchmarklist: Promise<BenchmarkDataProps[]> = await response.json();

  console.log("report list ", benchmarklist)
  return benchmarklist
}