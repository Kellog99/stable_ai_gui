export default interface Dataset {
    name: string;
    n_samples: number;
    task: string;
    features: {
        type: string;
        name: string;
        depth: number,
        datas: string[] | number[];
        is_logic: boolean;
        description?: string;
        label_dict?: any;
      };
    prototype: {
        type: string;
        name: string;
        depth: number,
        datas: string[] | number[];
        is_logic: boolean
        description?: string;
        label_dict?: any;
      };  
    edges: [string, string][];
    n_classes: number;
    samples_per_class?: number;
    description?: string
  }

export interface FeatureSchema{
    type: string;
    name: string;
    depth: number;
}