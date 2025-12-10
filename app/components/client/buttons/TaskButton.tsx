import { Task } from '@/interfaces/NNInterfaces';
import useStore from '@/store/nnTrustStore';
import styles from '@/styles/TaskButton.module.css';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';


const TaskButton: React.FC<Task> = ({
  Icon,
  title,
  description,
  footer,
  color,
  href
}) => {
  const router = useRouter();

  const isModel = useStore((state) => state.modelName) !== null
  const isDataset = useStore((state) => state.datasetUsed) !== null

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    router.push(href)
  }


  return (
    <button
      className={styles.card}
      onClick={handleClick}
      disabled={
        ((title === "Custom Attack" || title === "RedTeaming Tool") && (!isModel || !isDataset)) ||
        (title === "Data Quality" && !isDataset)}
    >
      <div className={styles.card_header}>
        <div
          className={styles.card_icon}
          style={{ background: color }}>
          <Icon style={{ width: "2vw" }} />
        </div>
        <p className={styles.card_title}>{title}</p>
      </div>
      <p className={styles.card_description}>{description}</p>
      <div className={styles.card_link} >
        {footer}
        <ChevronRight size={"2vw"} />
      </div>
    </button>
  );
}

export default TaskButton