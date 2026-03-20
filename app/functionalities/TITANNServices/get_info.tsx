import { ModelInfo, DatasetInfo } from "@/interfaces/homePageInterface";
import { RegisterObjectProps } from "@/interfaces/NNInterfaces";

import { ModelReportProps } from "@/interfaces/reportInterfaces";

// ################################# TITANN #################################
// get all the models saved
export async function getAttacksList(
  hostname: string,
  port: string
): Promise<{ [key: string]: RegisterObjectProps }> {
  try {
    const response = await fetch(`http://${hostname}:${port}/info/attacks`);
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
export async function getMetricsList(
  hostname: string,
  port: string
): Promise<{ [key: string]: RegisterObjectProps }> {
  try {
    const response = await fetch(`http://${hostname}:${port}/info/metrics`);
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

// ###########################################################################

// ################################# MODEL and DATASET #################################
export async function getCoreElements(
  hostname: string,
  port: string,
  repository: string,
  file_checker: string,
): Promise<ModelInfo[] | DatasetInfo[] | ModelReportProps[]> {

  // This function calls the `get_info` function in the BackEnd
  // It fetches all the `repository` that have been already saved in the repository.

  const response = await fetch(`http://${hostname}:${port}/repository/getList?file_checker=${file_checker}&repo_path=${repository}`);

  if (!response.ok) throw new Error('Failed to get model info from the backend');

  const listElements = await response.json();
  console.log(listElements)
  return listElements
}
// #####################################################################################
