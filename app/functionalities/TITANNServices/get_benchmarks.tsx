import { BenchmarkDataProps } from "@/interfaces/reportInterfaces";

export async function startNewJob(
  hostname: string,
  port: string,
  jobConfig: Object
) {
  await fetch(`http://${hostname}:${port}/report/benchmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // binary content type
    body: JSON.stringify(jobConfig),
  });


}

export async function getJobsId(
  hostname: string,
  port: string
) {

  const response = await fetch(`http://${hostname}:${port}/job/getJobsId`);

  if (!response.ok) throw new Error('Failed to get jobs ids from the backend');

  const jobsIds = await response.json();
  return jobsIds
}


export async function getBenchmarkList(
  hostname: string,
  port: string,
  id?: string
) {
  const url = `http://${hostname}:${port}/report/benchmarks`
  if (id) {
    url.concat("", `?id=${id}`)
  }

  const response = await fetch(url);

  if (!response.ok) throw new Error('Failed to get NNTrust reports from the backend');

  const benchmarklist: Promise<BenchmarkDataProps[]> = await response.json();
  console.log("report list ", benchmarklist)
  return benchmarklist
}