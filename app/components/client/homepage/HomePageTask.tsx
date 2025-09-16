import React from 'react'

import styles from '@/styles/HomePage.module.css';
import { BarChart3, Brain, Database, FileText, TestTube } from 'lucide-react';
import { Task } from '@/interfaces/NNInterfaces';
import TaskButton from '@/components/client/TaskButton';


// major information about the tasks
const tasks: Task[] = [
  {
    title: "Red Team Tool",
    Icon: BarChart3,
    footer: "Start Benchmark",
    color: "linear-gradient(to bottom right, #3b82f6, red)",
    description: 'Test all the possible vulnerabilities and generate a detailed performance reports across multiple attack vectors.'
  },
  {
    title: "Test",
    Icon: TestTube,
    description: 'Test individual adversarial attacks with custom parameters and visualize the results.',
    footer: "Execute Test",
    color: "linear-gradient(to bottom right, #9333ea, #7c3aed)"
  },
  {
    title: "Data Quality Tool",
    Icon: FileText,
    description: 'View the analysis on the loaded dataset.',
    footer: "See Analysis",
    color: "linear-gradient(to bottom right, #059669, #533A71)"
  }
]


const HomePageTask = () => {
  // Since this is component almost indepenent from the page
  // in order to have a better readebility it has been created another file
  return (
    <div className={styles.taskgrid}>
      {tasks.map((task) => <TaskButton key={task.title} {...task} />)}
    </div>
  )
}

export default HomePageTask