// collection of fixed possibilities for the metrics configurations

export const backend_duplicates = [ 'faiss', 'scikit' ]
export const metric_duplicates = [ 'euclidean', 'cosine' ]
export const outliers_modes = [ "mahalanobis", "isolation forest", "lunar", "LOF", "KNN" ]
export const model_type_LUNAR = ["WEIGHT", "SCORE"]
export const negative_sampling_LUNAR = ["MIXED", "UNIFORM", "SUBSPACE"]

