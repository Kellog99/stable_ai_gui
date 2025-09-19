"use client";

import useStore from '@/store/dsStore';
import useNNTrustStore from '@/store/nnTrustStore';
import { Brain, Database, FileText, Home, LucideIcon, Option } from 'lucide-react';
import styles from '@/styles/Header.module.css';

import { useRouter } from "next/navigation";
import { useState } from 'react';


// available buttons to display on the head bar
interface HeaderButtonProps {
  id: string,
  Icon: LucideIcon,
  href: string,
  name: string
}

const btns: HeaderButtonProps[] = [
  {
    id: 'HomePage',
    Icon: Home,
    href: "/",
    name: "home"
  },
  {
    id: 'ReportPage',
    Icon: FileText,
    href: "/pages/report",
    name: "report"
  }
]
type Option = typeof btns[number]['id'];
const possiblePages: Option[] = btns.map((btn) => btn.id);


const Header = () => {
  const [page, setPage] = useState<string>(possiblePages[0])
  const datasetName = useStore((state) => state.datasetUsed)?.name;
  const modelName = useNNTrustStore((state) => state.modelName);

  const router = useRouter();


  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        {btns.map((btnprops) =>
          <button
            className={`${styles.button} ${page === btnprops.id ? styles.active : styles.inactive}`}
            onClick={() => {
              setPage(btnprops.id);
              router.push(btnprops.href);
            }}>
            <btnprops.Icon />
            <p>{btnprops.name.charAt(0).toUpperCase() + btnprops.name.slice(1)}</p>
          </button>)}
      </div>

      {/* Title */}
      <div className={styles.title}>
        <h1 >TrustWorthy</h1>
        <img
          src="/logo_leonardo.png"
          alt="logo"
          className={styles.logo}
        />
      </div>

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

export default Header