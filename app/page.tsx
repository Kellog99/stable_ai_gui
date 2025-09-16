"use client";
import styles from '@/styles/Header.module.css';
import './page.css';
import { HomePageProps } from "./interfaces/NNInterfaces";
import HomePageDrop from "./components/client/homepage/HomePageDrop";
import HomePageTask from "./components/client/homepage/HomePageTask";



const HomePage: React.FC<HomePageProps> = ({
  dataset,
  model,
  onFileSelect,
  onTaskSelect }) => {

  return (
    <div className={styles.homecontainer}>
      <HomePageDrop
        dataset={dataset}
        model={model}
        onFileSelect={onFileSelect}
        onTaskSelect={onTaskSelect} />

      <div className={styles.task}>
        <div className="sectionheader">
          <h2 className="sectiontitle">
            Analysis Tasks
          </h2>
          <p className="sectionsubtitle">
            Select an analysis task to begin
          </p>
        </div>

        <HomePageTask />
      </div>
    </div>
  );
}

export default HomePage