"use client"

import { CheckCircle, Circle, Shield } from 'lucide-react';
import '@/styles/Header.css';
import { useRouter } from 'next/navigation';
import { title } from '@/page';

import useNNTrustStore from '@/store/nnTrustStore';
import useStore from '@/store/dsStore';

const Header = () => {

  const { model } = useNNTrustStore()
  const { dataset } = useStore()
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
          {model?.name ? (
            <>
              <CheckCircle size={"calc(var(--icon-size) / 1.5)"} color="var(--affermative)" />
              <span>{model?.name}</span>
            </>
          ) :
            <>
              <Circle size={"calc(var(--icon-size) / 1.5)"} color="var(--warning)" />
              <span>No Model</span>
            </>
          }
        </div>
        <div className="status-divider"></div>
        <div className="status-indicator">
          {dataset ? (
            <>
              <CheckCircle size={"calc(var(--icon-size) / 1.5)"} color="var(--affermative)" />
              <span>{dataset.name}</span>
            </>
          ) :
            <>
              <Circle size={"calc(var(--icon-size) / 1.5)"} color="var(--warning)" />
              <span>No Dataset</span>
            </>
          }

        </div>
      </div>
    </header>
  );
}


export default Header;