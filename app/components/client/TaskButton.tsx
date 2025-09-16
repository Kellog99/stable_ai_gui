import React from 'react';
import styles from '../../styles/TaskButton.module.css'
import { ChevronRight } from 'lucide-react';
//import { useNavigate } from "react-router-dom";
import { Task } from '@/interfaces/NNInterfaces';

const TaskButton: React.FC<Task> = ({
  Icon,
  title,
  description,
  footer,
  color }) => {
  //const navigate = useNavigate();


  return (
    <div className={styles.card}
      onClick={() => {/*navigate("/redtool")*/}}>
      <div className={styles.card_header}>
        <div className={styles.card_icon} style={{ background: color }}>
          <Icon style={{ width: "2vw" }} />
        </div>
        <p className={styles.card_title}>{title}</p>
      </div>
      <p className={styles.card_description}>{description}</p>
      <div className={styles.card_link}>
        <p>{footer}</p>
        <ChevronRight />
      </div>
    </div>
  );
}

export default TaskButton