import { ModelInfo, DatasetInfo } from "@/interfaces/homePageInterface";
import { RegisterObjectProps } from "@/interfaces/NNInterfaces";
import { PrivacyAttackOutput, PrivacyDatasetInfo, PrivacyModelInfo } from "@/interfaces/privacyInterfaces";
import { ModelReportProps } from "@/interfaces/reportInterfaces";

// ################################# TITANN #################################

async function fetchInfoList<T>(
  hostname: string,
  port: string,
  path: string,
  label: string
): Promise<T> {
  try {
    const response = await fetch(`http://${hostname}:${port}${path}`);
    if (!response.ok) {
      throw new Error(`HTTP error for ${label}! Status: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    console.error(err instanceof Error ? err.message : "An unknown error occurred");
    throw err;
  }
}

export function getAttacksList(
  hostname: string,
  port: string
): Promise<{ [key: string]: RegisterObjectProps }> {
  return fetchInfoList(hostname, port, "/info/attacks", "attacks list");
}

export function getMetricsList(
  hostname: string,
  port: string
): Promise<{ [key: string]: RegisterObjectProps }> {
  return fetchInfoList(hostname, port, "/info/metrics", "metrics list");
}

export async function getPrivacyDatasetsList(
  hostname: string,
  port: string
): Promise<PrivacyDatasetInfo[]> {
  const response = await fetch(`http://${hostname}:${port}/info/privacy/datasets`);
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return response.json();
}

export async function getPrivacyModelsList(
  hostname: string,
  port: string
): Promise<PrivacyModelInfo[]> {
  const response = await fetch(`http://${hostname}:${port}/info/privacy/models`);
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return response.json();
}

export async function startPrivacyJob(
  hostname: string,
  port: string,
  body: object,
  device: 'cpu' | 'cuda' = 'cuda'
): Promise<{ job_id: string }> {
  const response = await fetch(`http://${hostname}:${port}/privacy/run?device=${device}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return response.json();
}

export async function getPrivacyJobStatus(
  hostname: string,
  port: string,
  jobId: string
): Promise<{ status: string; [key: string]: unknown }> {
  const response = await fetch(`http://${hostname}:${port}/privacy/status/${jobId}`);
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return response.json();
}

export async function getPrivacyJobResult(
  hostname: string,
  port: string,
  jobId: string
): Promise<PrivacyAttackOutput> {
  const response = await fetch(`http://${hostname}:${port}/privacy/result/${jobId}`);
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return response.json();
}

// ###########################################################################

// ################################# MODEL and DATASET #################################
export async function getCoreElements(
  hostname: string,
  port: string,
  repository: string,
  model_type: string,
): Promise<ModelInfo[] | DatasetInfo[] | ModelReportProps[]> {
  const response = await fetch(`http://${hostname}:${port}/repository/getList?model_type=${model_type}&repo_path=${repository}`);
  if (!response.ok) throw new Error('Failed to get model info from the backend');
  return response.json();
}
// #####################################################################################
