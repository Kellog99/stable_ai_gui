const host = "localhost"

export const uploadModel_check = `http://${host}:8082/model/upload/check`
export const uploadModel = `http://${host}:8082/model/upload`
export const models_get = `http://${host}:8082/model/getModels`

export const getAllNNReports = `http://${host}:8082/job/report/getReports`
export const uploadJsonReport_NN = `http://${host}:8082/job/report/upload`

export const reportFetch_get = `http://${host}:8082/job/report/getResult`
export const benchmarkFetch_get = `http://${host}:8082/job/benchmark/getResult`
export const getJobsProgress = `http://${host}:8082/job/getJobs`
export const getInfoAttacks = `http://${host}:8082/info/attacks/getInfo`
export const getInfoMetrics = `http://${host}:8082/info/metrics/getInfo`

export const startJob = `http://${host}:8082/job/start`
export const startAttack = `http://${host}:8082/job/attack`



/////////////////////////////////////////////////////////////

export const datasets_get = "http://localhost:8082/dataset/getDatasets"
export const dataset_upload = "http://localhost:8082/dataset/upload"

export const start_job ="http://localhost:8082/job/start"
export const jobsId_get = "http://localhost:8082/job/getJobsId"
export const jobProgress_get ="http://localhost:8082/job/getProgress"