"use client"

import { useState } from 'react';
import useStore from '../../../store/dsStore';


export default function MetricsAddedDisplayer() {
    
    const configs = useStore((state) => state.metricsConfig)
    const [openItems, setOpenItems] = useState({});
    
    const toggleAccordion = (index) => {
        setOpenItems(prev => ({
          ...prev,
          [index]: !prev[index]
        }));
      };
    
    return(
        <>
        {configs.map((config, index) => ()}
    </>)

}