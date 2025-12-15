const host = process.env.API_HOST || "localhost";
const port = process.env.API_PORT || "8082";


console.log("@@@@@@@@@@@@@")
console.log(`http://${host}:${port}`)

export const uploadModel_check = `http://${host}:${port}/model/upload/check`
export const uploadModel = `http://${host}:${port}/model/upload`
export const models_get = `http://${host}:${port}/model/getModels`
export const getAllNNReports = `http://${host}:${port}/job/report/getReports`
export const uploadJsonReport_NN = `http://${host}:${port}/job/report/upload`

export const reportFetch_get = `http://${host}:${port}/job/report/getResult`
export const benchmarkFetch_get = `http://${host}:${port}/job/benchmark/getResult`
export const getJobsProgress = `http://${host}:${port}/job/getJobs`
export const getInfoAttacks = `http://${host}:${port}/info/attacks/getInfo`
export const getInfoMetrics = `http://${host}:${port}/info/metrics/getInfo`

export const startJob = `http://${host}:${port}/job/start`
export const startAttack = `http://${host}:${port}/job/attack`


//////////////////////// DAL BE DATAQUALITY ---> SONO DA CAMBIARE /////////////////////////

export const uploadDataset_check = `http://${host}:${port}/upload_folder/check`
export const uploaderDataset = `http://${host}:${port}/upload_folder`
export const datasets_get = `http://${host}:${port}/dataset/getDatasets`
export const dataset_get = `http://${host}:${port}/getDataset`
export const save_get = `http://${host}:${port}/save`

export const wsUrl = `ws://${host}:8085`
