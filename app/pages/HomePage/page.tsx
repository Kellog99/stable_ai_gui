import './HomePage.css';
import HomePageTask from "./HomePageTask";
import HomePageDrop from "./HomePageDrop";
import { HomePageProps } from "@/interfaces/NNInterfaces";





const HomePage: React.FC<HomePageProps> = ({
  dataset,
  model,
  onFileSelect,
  onTaskSelect }) => {
  // Button state logic
  const canUseAnalysis = dataset !== null;
  const canUseOtherTasks = dataset !== null && model !== null;


  return (
    <div className="home-container">
      <HomePageDrop
        dataset={dataset}
        model={model}
        onFileSelect={onFileSelect}
        onTaskSelect={onTaskSelect} />


      
      <div className='task'>
        <div className="section-header">
          <h2 className="section-title">
            Analysis Tasks
          </h2>
          <p className="section-subtitle">
            Select an analysis task to begin
          </p>
        </div>

        <HomePageTask />
      </div>
    </div>
  );
}

export default HomePage