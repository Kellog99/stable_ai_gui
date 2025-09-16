import { Brain, Database, Home, FileText } from 'lucide-react';
import styles from './Header.module.css';
import {  useEffect } from 'react';
import SelectionButton from './utils/SelectionButtons';
import { ButtonProps } from '@/app/types/index';

interface HeaderProps {
  currentPage: 'home' | 'report';
  onPageChange: (page: 'home' | 'report') => void;
  datasetName?: string;
  modelName?: string;
}


export default function Header({
  currentPage,
  onPageChange,
  datasetName,
  modelName }: HeaderProps) {
  const btns: ButtonProps[] = [
    {
      id:'home',
      Icon: Home,
      onClickHandle: () => onPageChange('home'),
      name: "home",
      currentPage: currentPage
    },
    {
      id:'report',
      Icon: FileText,
      onClickHandle: () => onPageChange('report'),
      name: "report",
      currentPage: currentPage
    }
  ]

  // custom font for the Header Title
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Monoton&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Preconnect links for better performance
    const preconnect1 = document.createElement('link');
    preconnect1.href = 'https://fonts.googleapis.com';
    preconnect1.rel = 'preconnect';
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.rel = 'preconnect';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    // Cleanup function
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(preconnect1);
      document.head.removeChild(preconnect2);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        {btns.map((btnprops) => <SelectionButton {...btnprops} />)}
      </div>
      {/* Title */}
      <h1 className={styles.title}>TrustWorthy</h1>
      {/* Status indicator */}
      <div className={styles.indicators}>
        <div className={`${styles.item} ${modelName ? styles.loaded : ''}`}>
          <Brain />
          <span className={styles.text}>
            {modelName || 'No model'}
          </span>
        </div>
        <div className={`${styles.item} ${datasetName ? styles.loaded : ''}`}>
          <Database />
          <span className={styles.text}>
            {datasetName || 'No dataset'}
          </span>
        </div >
      </div >
    </div >
  );
}