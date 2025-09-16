"use client";

import useStore from '@/store/dsStore';
import useNNTrustStore from '@/store/nnTrustStore';
import { Brain, Database, FileText, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import styles from '../../styles/Header.module.css';
import './utils/utils.css';



interface HeaderProps
{
  currentPage: 'home' | 'report';
  onPageChange: ( page: 'home' | 'report' ) => void;
  datasetName?: string;
  modelName?: string;
}


export default function Header ()
{

  const pathName = usePathname();
  const isNNTrust = pathName.includes( '/nntrust' );
  const datasetName = useStore( ( state ) => state.datasetUsed )?.name;
  const modelName = useNNTrustStore( ( state ) => state.modelName );
  console.log("datasetName", datasetName)


  const btns = [
    {
      id: 'HomePage',
      Icon: Home,
      href: "/",
      name: "home"
    },
    {
      id: 'ReportPage',
      Icon: FileText,
      href: "/pages/dataquality/report",
      name: "report"
    }
  ]



  // custom font for the Header Title
  useEffect( () =>
  {
    // Load Google Fonts
    const link = document.createElement( 'link' );
    link.href = 'https://fonts.googleapis.com/css2?family=Monoton&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild( link );

    // Preconnect links for better performance
    const preconnect1 = document.createElement( 'link' );
    preconnect1.href = 'https://fonts.googleapis.com';
    preconnect1.rel = 'preconnect';
    document.head.appendChild( preconnect1 );

    const preconnect2 = document.createElement( 'link' );
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.rel = 'preconnect';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild( preconnect2 );

    // Cleanup function
    return () =>
    {
      document.head.removeChild( link );
      document.head.removeChild( preconnect1 );
      document.head.removeChild( preconnect2 );
    };
  }, [] );

  const getStyle = ( id: string ) =>
  {

    if ( pathName.includes( id ) || pathName === '/' && id === 'HomePage' ) {
      return `button active`;
    } else {
      return `button inactive`;
    }
  }

  return (
    <div className={ styles.container }>
      <div className={ styles.buttons }>
        <img
          src="/logo_leonardo.png"
          alt="logo"
          className={styles.logo}
        />
        { btns.map( ( btnprops ) =>
          <Link
            key={ btnprops.href }
            href={ btnprops.href }
            style={ { textDecoration: 'none', color: 'inherit' } }
          >
            <button className={ getStyle( btnprops.id ) }>
              <btnprops.Icon />
              <p>{ btnprops.name.charAt( 0 ).toUpperCase() + btnprops.name.slice( 1 ) }</p>
            </button>
          </Link> ) }
      </div>
      {/* Title */ }
      <h1 className={ styles.title }>TrustWorthy</h1>
      {/* Status indicator */ }
      <div className={ styles.indicators }>
        <div className={ `${styles.item} ${modelName ? styles.loaded : ''}` }>
          <Brain />
          <span className={ styles.text }>
            { modelName || 'No model' }
          </span>
        </div>
        <div className={ `${styles.item} ${datasetName ? styles.loaded : ''}` }>
          <Database />
          <span className={ styles.text }>
            { datasetName || 'No dataset' }
          </span>
        </div >
      </div >
    </div >
  );
}