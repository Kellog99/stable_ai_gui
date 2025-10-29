"use client";
import TaskButton from '@/components/client/buttons/TaskButton';
import styles from '@/styles/HomePage.module.css';
import HomePageDrop from './pages/HomePage/HomePageDrop';
import { AvailableTasks } from '@/components/layout/config';
// major information about the tasks


const HomePage: React.FC = ({ }) => {
  return (
    <div className={styles.homecontainer}>

      <HomePageDrop />
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
            AvailableTasks.map((task) =>
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