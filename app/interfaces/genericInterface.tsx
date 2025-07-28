export interface FeatureDTO
{
  type: string;
  name: string;
  depth: number,
  datas: any[];
  is_logic: boolean;
  description?: string;
  label_dict?: { [ key: number ]: string };
  model_name?: string; 
}



export default interface Dataset
{
  name: string;
  n_samples: number;
  task: string;
  features: FeatureDTO[];
  prototype: {
    type: string;
    name: string;
    depth: number,
    datas: any[];
    is_logic: boolean
    description?: string;
    label_dict?: any;
  };
  edges: [ string, string ][];
  n_classes: number;
  samples_per_class?: { [ key: number ]: number };
  description?: string;
  bboxes_areas?: number[];
  bboxes_per_sample?: number[];
  default_embedding_model?:string
}

export interface FeatureSchema
{
  type: string;
  name: string;
  depth: number;
  model_name?: string;
}


export interface Configs
{
  metricName: string
  featureName: string,
  outliersMode?: string,
  labelFeatureName?: string,
  internalConfigs: any,
  results: Object
}

export interface ReportMetric {
  internalConfigs: any,
  results: Object
}


export interface ModelInfo {
  name: string;
  model_type: string;
  architecture: string;
  supports_text: boolean;
  supports_images: boolean;
  supports_audio: boolean;
  embedding_dim: number;
  max_length: number;
}

export interface PrototypesData
{
    data: any,
    label_data: number
}
export interface PrototypesInt
{
    type: string,
    datas: PrototypesData[]
}