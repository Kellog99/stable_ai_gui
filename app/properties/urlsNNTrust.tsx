const host = "localhost"
const port = 8082

const reportsModelPath = `/home/andrea/Desktop/TITANN/model`
// upload report
export const uploadRepo = `http://${host}:${port}/report/upload/model?report_path=${reportsModelPath}`

export const reportFetch_get = `http://${host}:${port}/job/report/getResult`
export const benchmarkFetch_get = `http://${host}:${port}/job/benchmark/getResult`

// this is for retriving the status of all the jobs in the background
export const jobProgress_get = `http://${host}:${port}/job/getJobs`

export const wsUrl = `ws://${host}:${port}`
