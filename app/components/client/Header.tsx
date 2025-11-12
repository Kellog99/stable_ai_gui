"use client"

import { Home, FileText, CheckCircle, Circle } from 'lucide-react';
import '@/styles/Header.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const Header = () => {

  const [currentPage, setCurrentPage] = useState('home');
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const [datasetLoaded, setDatasetLoaded] = useState<boolean>(false);

  const router = useRouter()
  return (
    <header className="app-header">
      <div className="header-nav">

        <button
          onClick={() => {
            setCurrentPage('home')
            router.push('/pages/tasks')
          }}
          className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
        >
          <Home size={18} />
          <span>Home</span>
        </button>
        <button
          onClick={() => {
            setCurrentPage('report')
            router.push('/pages/report')
          }}
          className={`nav-button ${currentPage === 'report' ? 'active' : ''}`}
        >
          <FileText size={18} />
          <span>Report</span>
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