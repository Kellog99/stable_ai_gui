export default interface Dataset {
    name: string;
    n_samples: number;
    task: string;
    features: {
        type: string;
        name: string;
        datas: string[];
        is_logic: boolean
      };
    prototype: {
        type: string;
        name: string;
        datas: string[];
        is_logic: boolean
      };  
    n_classes: number;
    samples_per_class?: number;
    label_dict?: any;
  }