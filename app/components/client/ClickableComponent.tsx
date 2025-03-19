'use client';
import React from "react";
import { useRouter } from "next/navigation";
import  useStore  from "../../store/dsStore";

interface Dataset {
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


interface ClickableImageProps {
  name: string;
  dataset: Dataset
}

export default function ClickableComponent({ 
  name, 
  dataset,
  children
}: React.PropsWithChildren<ClickableImageProps>) {
  
  const router = useRouter();
  const { datasetUsed, setData } = useStore();



  function clicked(name: string, dataset: Dataset) {
    console.log(`clicked on ${name}!`);
    router.push("/pages/prova");
    setData(dataset)
  }
  
  return (
    <div onClick={() => clicked(name, dataset)}>
      {children}
    </div>
  );
}