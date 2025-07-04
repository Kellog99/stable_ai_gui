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
  description?: string
}

export interface FeatureSchema
{
  type: string;
  name: string;
  depth: number;
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