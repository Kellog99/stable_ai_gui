"use client";
import styles from '@/styles/HomePage.module.css';
import { FileDropZoneProps } from "./interfaces/NNInterfaces";
import { BarChart3, Brain, Database, FileText, TestTube } from 'lucide-react';
import { Task } from '@/interfaces/NNInterfaces';
import TaskButton from '@/components/client/TaskButton';
import FileDropZone from '@/components/client/FileDropZone';


// major information about the tasks
const tasks: Task[] = [
  {
    title: "Benchmark",
    Icon: BarChart3,
    footer: "Start Benchmark",
    color: "linear-gradient(to bottom right, #3b82f6, red)",
    description: 'Test all the possible vulnerabilities and generate a detailed performance reports across multiple attack vectors.',
    href: "/pages/tasks/redteam/benchmark"
  },
  {
    title: "Test",
    Icon: TestTube,
    description: 'Test individual adversarial attacks with custom parameters and visualize the results.',
    footer: "Execute Test",
    color: "linear-gradient(to bottom right, #9333ea, #7c3aed)",
    href: "/pages/tasks/redteam/test"
  },
  {
    title: "Data Quality Tool",
    Icon: FileText,
    description: 'View the analysis on the loaded dataset.',
    footer: "See Analysis",
    color: "linear-gradient(to bottom right, #059669, #533A71)",
    href: "/pages/tasks/dataquality/datasets",
  }
]


// information about the Drop components.
const homePageDropZones: FileDropZoneProps[] = [
  {
    id: "drop1",
    title: "Dataset",
    Icon: Database,
    description: "Upload your dataset in ZIP format",
    acceptedTypes: ['.zip'],
    isLoaded: false,
    loadedFileName: "dataset?.name",
  },
  {
    id: "drop2",
    title: "Model",
    Icon: Brain,
    description: "Upload your model in a `.pth` format",
    acceptedTypes: ['.zip'],
    isLoaded: false,
    loadedFileName: "dataset?.name",
  }]


const HomePage: React.FC = ({ }) => {
  return (
    <div className={styles.homecontainer}>

      {/* This part has to deal with the drop zone Elements */}
      <div className={styles.filegrid}>
        {
          homePageDropZones.map((dropElement: FileDropZoneProps) => (
            <FileDropZone
              key={dropElement.id}
              {...dropElement} />
          ))
        }
      </div>

      {/* This part has to deal with the Task part */}
      <div className={styles.task}>
        <div className={styles.sectionheader}>
          <h2 className={styles.sectiontitle}>
            Analysis Tasks
          </h2>
          <p className={styles.sectionsubtitle}>
            Select an analysis task to begin
          </p>
        </div>

        <div className={styles.taskgrid}>
          {
            tasks.map((task) =>
              <TaskButton
                key={task.title}
                {...task} />)
          }
        </div>
      </div>
    </div>
  );
}

export default HomePage