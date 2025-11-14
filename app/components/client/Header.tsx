"use client"

import { CheckCircle, Circle, Shield } from 'lucide-react';
import '@/styles/Header.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { title } from '@/page';


const Header = () => {

  const [currentPage, setCurrentPage] = useState('home');
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const [datasetLoaded, setDatasetLoaded] = useState<boolean>(false);

  const router = useRouter()
  return (
    <header className="app-header">
      <div className="header-nav">
        <button
          onClick={() => router.push("/")}
          className="sidebar-brand">
          <div className="brand-icon">
            <Shield size={25} className="text-white" />
          </div>
          <span className="brand-name">{title}</span>
        </button>
      </div>

      <div className="header-status">
        <div className="status-indicator">
          {modelLoaded ? (
            <CheckCircle size={20} className="var(--affermative)" />
          ) :
            <>
              <Circle size={20} color="var(--warning)" />
              <span>No Model</span>
            </>
          }
        </div>
        <div className="status-divider"></div>
        <div className="status-indicator">
          {datasetLoaded ? (
            <CheckCircle size={20} className="var(--affermative)" />
          ) :
            <>
              <Circle size={20} color="var(--warning)" />
              <span>No Dataset</span>
            </>
          }

        </div>
      </div>
    </header>
  );
}


export default Header;