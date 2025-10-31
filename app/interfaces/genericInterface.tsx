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

export const datasetMock: Dataset = {
  name: "animals",
  n_samples: 1000,
  task: "classification",
  features: [
    {
      type: "image",
      name: "image",
      depth: 0,
      datas: [],
      is_logic: false,
      description: "Image of the animal",
    },
    {
      type: "text",
      name: "text",
      depth: 1,
      datas: [],
      is_logic: false,
      description: "Textual description of the animal"}],
  prototype: {
    type: "image",
    name: "image",
    depth: 0,
    datas: ["/datasets/animals/data/antelope/0a37838e99.jpg"],
    is_logic: true,
    description: "Image of the animal",
  },
  edges: [["image", "text"]],
  n_classes: 5,
  samples_per_class: { 0: 200, 1: 200, 2: 200, 3: 200, 4: 200 }
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

export interface UploadConfig {
  fileType: 'zip' | 'pth';
  accept: string; //ex: ".zip" 
  title: string; //ex: "Upload Dataset"
  description: string; //ex: "Select a .zip file from your computer to upload"
  uploadEndpoint: string; //where to connect the backend
  formFieldName: string; //ex: "file_zip"
  icon: React.ReactNode;
  refreshFunction: () => Promise<any>; //ex: "DatasetsLoader" is the function the reloads the data with the new upload
  setRefreshData: (data: any) => void; //ex: "setDatasets" is the variable from the store where are stored the data
  showArrowSwitch?: boolean; //for the dataset upload
  showModeSelect?: boolean;  //for the dataset upload
  showTypeSelect?: boolean;  //for the dataset upload
  showJsonConfig?: boolean;  //for the dataset upload
  
}
