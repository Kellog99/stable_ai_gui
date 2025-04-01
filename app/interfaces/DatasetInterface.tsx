export default interface Dataset {
    name: string;
    n_samples: number;
    task: string;
    features: {
        type: string;
        name: string;
        datas: string[];
        is_logic: boolean;
        description?: string;
        label_dict?: any;
      };
    prototype: {
        type: string;
        name: string;
        datas: string[];
        is_logic: boolean
        description?: string;
        label_dict?: any;
      };  
    n_classes: number;
    samples_per_class?: number;
    description?: string
  }