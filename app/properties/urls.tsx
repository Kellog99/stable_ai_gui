export const dataset_post = 'http://localhost:8000/process'
export const feature_post = 'http://localhost:8000/getFeature'
export const data_get = "http://localhost:8000/embeddings/getUmap"
export const datasets_get = "http://localhost:8000/getDatasets"
export const dataset_get = "http://localhost:8000/getDataset"
export const prototypes_get= "http://localhost:8000/metrics/getPrototypes"
export const duplicates_start = "http://localhost:8000/metrics/getDuplicates"

export const outliers_start = "http://localhost:8000/metrics/getOutliers"
export const completeness_start = "http://localhost:8000/metrics/getCompleteness"
export const retrieve_get = "http://localhost:8000/embeddings/retrieve"
export const upload_post = "http://localhost:8000/upload_folder"
export const cropper_get = "http://localhost:8000/actions/cropper"
export const save_get = "http://localhost:8000/save"
export const model_info_get = "http://localhost:8000/inference_server/model_info"
export const report_post = "http://localhost:8000/report"
export const completenessOK_get ="http://localhost:8000/checkModelCompleteness"
export const root_folder = "/home/roberta/Desktop/Projects/data-quality_gui/public/datasets"


/// POLLING NEW ////
export const metrics_progress = "http://localhost:8000/metrics/progress"

export const embedder_start = "http://localhost:8000/actions/embedder"
export const embedder_progress = "http://localhost:8000/embedder/progress"
export const cleaner_start= "http://localhost:8000/actions/cleaner"
export const cleaner_progress = "http://localhost:8000/cleaner/progress"