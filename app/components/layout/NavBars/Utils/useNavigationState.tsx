"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationState {
  visualVisible: boolean;
  metricVisible: boolean;
  actionVisible: boolean;
}

export function useNavigationState() {
  const [state, setState] = useState<NavigationState>({
    visualVisible: false,
    metricVisible: false,
    actionVisible: false,
  });

  const pathname = usePathname();

  useEffect(() => {
    const newState = {
      visualVisible: [
        '/pages/dataquality/embeddings',
        '/pages/dataquality/prototypes'
      ].includes(pathname),
      
      metricVisible: [
        '/pages/dataquality/metrics/duplicates',
        '/pages/dataquality/metrics/outliers',
        '/pages/dataquality/metrics/completeness'
      ].includes(pathname),
      
      actionVisible: [
        '/pages/dataquality/actions/embeddings',
        '/pages/dataquality/actions/cleanDuplicates',
        '/pages/dataquality/actions/cropping'
      ].includes(pathname),
    };

    setState(newState);
  }, [pathname]);

  const toggleSection = (section: keyof NavigationState) => {
    setState(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return { ...state, toggleSection };
}