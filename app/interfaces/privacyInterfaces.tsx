export interface PrivacyDatasetInfo {
  id: string
  root?: string
  task_attr?: string
  use_embeddings?: boolean
  num_classes?: number
}

export interface PrivacyModelInfo {
  id: string
  description?: string
  use_embeddings?: boolean
}

export interface PrivacyArtifactRef {
  artifact_id: string
  filename: string
  media_type: string
  metadata: { [key: string]: unknown }
}

export interface PrivacyAttackOutput {
  metrics: { [key: string]: number | string | boolean | null | { [key: string]: unknown } }
  reconstructions?: string[]
  artifacts: PrivacyArtifactRef[]
  attack_metadata: { [key: string]: unknown }
  target_metadata: { [key: string]: unknown }
  dataset_metadata: { [key: string]: unknown }
}
