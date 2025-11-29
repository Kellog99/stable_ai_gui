const host = "localhost"
const port = 8082

export const getInfoAttacks = `http://${host}:${port}/info/attacks/getInfo`
export const getInfoMetrics = `http://${host}:${port}/info/metrics/getInfo`

export const getListModels = `http://${host}:${port}/model/getModels`
export const getListDataset = `http://${host}:${port}/dataset/getDatasets`

// report repository
export const getListModelsReport = `http://${host}:${port}/job/report/getReports`

export const uploadModel_check = `http://${host}:${port}/model/upload/check`
export const uploadModel = `http://${host}:${port}/model/upload`

export const uploadJsonReport_NN = `http://${host}:${port}/job/report/upload`

export const reportFetch_get = `http://${host}:${port}/job/report/getResult`
export const benchmarkFetch_get = `http://${host}:${port}/job/benchmark/getResult`
export const getJobsProgress = `http://${host}:${port}/job/getJobs`

export const startJob = `http://${host}:${port}/job/start`
export const startSingleAttack = `http://${host}:${port}/job/attack`


/////////////////////////////////////////////////////////////
export const dataset_upload = `http://${host}:${port}/dataset/upload`

export const start_job = `http://${host}:${port}/job/start`
export const jobsId_get = `http://${host}:${port}/job/getJobsId`

export const jobProgress_get = `http://${host}:${port}/job/getJobs`