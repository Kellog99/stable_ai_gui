import { ChevronRight } from 'lucide-react';
import React from 'react';
import styles from '@/styles/TaskButton.module.css';
import { Task } from '@/interfaces/NNInterfaces';
import RouterButton from './buttons/RouterButton';

const TaskButton: React.FC<Task> = ({
  Icon,
  title,
  description,
  footer,
  color,
  href
}) => {

  // #TODO: change the route 

  return (
    <RouterButton
      name={"Animals"}
      route={href ? href : ''}>
      <div className={styles.card}>
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
    </RouterButton>
  );
}

export default TaskButton