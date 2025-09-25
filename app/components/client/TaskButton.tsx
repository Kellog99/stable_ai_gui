import { ChevronRight } from 'lucide-react';
import React from 'react';
import styles from '@/styles/TaskButton.module.css';
import { Task } from '@/interfaces/NNInterfaces';
import { useRouter } from 'next/navigation';

const TaskButton: React.FC<Task> = ({
  Icon,
  title,
  description,
  footer,
  color,
  href
}) => {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    router.push(href)
  }
  return (
    <button
      className={styles.card}
      onClick={handleClick}>
      <div className={styles.card_header}>
        <div className={styles.card_icon} style={{ background: color }}>
          <Icon style={{ width: "2vw" }} />
        </div>
        <p className={styles.card_title}>{title}</p>
      </div>
      <p className={styles.card_description}>{description}</p>
      <div className={styles.card_link} >
        {footer}
        <ChevronRight />
      </div>
    </button>
  );
}

export default TaskButton