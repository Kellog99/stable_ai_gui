"use client";
import TaskButton from '@/components/client/buttons/TaskButton';
import { Task } from '@/interfaces/NNInterfaces';
import styles from '@/styles/HomePage.module.css';
import { BarChart3, Brain, Database, FileText, TestTube } from 'lucide-react';
import { FileDropZoneProps } from "./interfaces/NNInterfaces";
import HomePageDrop from './pages/HomePage/HomePageDrop';

// major information about the tasks
const tasks: Task[] = [
  {
    title: "Data Quality",
    Icon: FileText,
    description: 'View the analysis on the loaded dataset.',
    footer: "See Analysis",
    color: "linear-gradient(to bottom right, #059669, #533A71)",
    href: "/pages/tasks/dataquality/datasets",
  },
  {
    title: "RedTeaming Tool",
    Icon: BarChart3,
    footer: "Start Benchmark",
    color: "linear-gradient(to bottom right, #3b82f6, red)",
    description: 'Allows a vulnerability assesment on the selected model and generates a detailed performance reports across multiple attack vectors.',
    href: "/pages/tasks/redteam/benchmark"
  },
  {
    title: "Custom Attack",
    Icon: TestTube,
    description: 'Test individual adversarial attacks with custom parameters and visualize the results.',
    footer: "Execute Test",
    color: "linear-gradient(to bottom right, #9333ea, #7c3aed)",
    href: "/pages/tasks/redteam/test"
  }
]

const HomePage: React.FC = ({ }) => {
  return (
    <div className={ styles.homecontainer }>


      <HomePageDrop />
      {/* This part has to deal with the Task part */ }
      <div className={ styles.task }>
        <div className={ styles.sectionheader }>
          <h2 className={ styles.sectiontitle }>
            Analysis Tasks
          </h2>
          <p className={ styles.sectionsubtitle }>
            Select an analysis task to begin
          </p>
        </div>

        <div className={ styles.taskgrid }>
          {
            tasks.map( ( task ) =>
              <TaskButton
                key={ task.title }
                { ...task } /> )
          }
        </div>
      </div>
    </div>
  );
}

export default HomePage