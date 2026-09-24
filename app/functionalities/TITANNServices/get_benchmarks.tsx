import { BenchmarkDataProps } from "@/interfaces/reportInterfaces";

export async function startNewJob(
  hostname: string,
  port: string,
  jobConfig: object
): Promise<void> {
  const response = await fetch(`http://${hostname}:${port}/report/benchmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobConfig),
  });
  if (!response.ok) throw new Error('Failed to start new benchmark job');
}

export async function getJobsId(
  hostname: string,
  port: string
): Promise<string[]> {
  const response = await fetch(`http://${hostname}:${port}/job/getJobsId`);
  if (!response.ok) throw new Error('Failed to get jobs ids from the backend');
  return response.json();
}

export async function getBenchmarkList(
  hostname: string,
  port: string,
  id?: string
): Promise<BenchmarkDataProps[]> {
  let url = `http://${hostname}:${port}/report/benchmarks`;
  if (id) {
    url += `?id=${id}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to get benchmark list from the backend');
  return response.json();
}