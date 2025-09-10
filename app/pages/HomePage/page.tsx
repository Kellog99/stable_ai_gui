import { LoadedFile, Task, TaskType, FileDropZoneProps } from "@/app/types";
import './HomePage.css';
import HomePageTask from "./HomePageTask";
import HomePageDrop from "./HomePageDrop";
import { HomePageProps } from "@/app/types";




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


      {/* Task Section */}
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