"use client";
import './pages/HomePage/HomePage.css';
import { HomePageProps } from "./interfaces/NNInterfaces";
import HomePageDrop from "./pages/HomePage/HomePageDrop";
import HomePageTask from "./pages/HomePage/HomePageTask";
import Benchmark from './pages/nntrust/RedTeam/page';
import { useState } from 'react';
import ReportPage from './pages/nntrust/ReportPage/page';
import SecurityReport from './pages/nntrust/ReportPage/ReportTITANN/page';


const HomePage: React.FC<HomePageProps> = ({
  dataset,
  model,
  onFileSelect,
  onTaskSelect }) => {

  return (
    // <div className="home-container">
    //   <HomePageDrop
    //     dataset={dataset}
    //     model={model}
    //     onFileSelect={onFileSelect}
    //     onTaskSelect={onTaskSelect} />

    //   <div className='task'>
    //     <div className="section-header">
    //       <h2 className="section-title">
    //         Analysis Tasks
    //       </h2>
    //       <p className="section-subtitle">
    //         Select an analysis task to begin
    //       </p>
    //     </div>

    //     <HomePageTask />
    //   </div>
    // </div>
    // <Benchmark/>
    // <ReportPage/>
    <SecurityReport/>
  );
}

export default HomePage