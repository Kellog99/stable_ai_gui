import { Task } from '@/interfaces/NNInterfaces';
import useStoreDQ from '@/store/dsStore';
import useStore from '@/store/nnTrustStore';
import styles from '@/styles/TaskButton.module.css';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';


const TaskButton: React.FC<Task> = ( {
  Icon,
  title,
  description,
  footer,
  color,
  href
} ) =>
{
  const router = useRouter();

  const isModel = useStore( ( state ) => state.modelName ) !== null
  const isDataset = useStoreDQ( ( state ) => state.datasetUsed ) !== null

  const handleClick = ( e: React.MouseEvent<HTMLElement> ) =>
  {
    e.preventDefault()
    router.push( href )
  }


  return (
    <button
      className={ styles.card }
      onClick={ handleClick }
      disabled={
        ( ( title === "Test" || title === "Benchmark" ) && ( !isModel || !isDataset ) ) ||
        ( title === "Data Quality Tool" && !isDataset )
      }>
      <div className={ styles.card_header }>
        <div className={ styles.card_icon } style={ { background: color } }>
          <Icon style={ { width: "2vw" } } />
        </div>
        <p className={ styles.card_title }>{ title }</p>
      </div>
      <p className={ styles.card_description }>{ description }</p>
      <div className={ styles.card_link } >
        { footer }
        <ChevronRight />
      </div>
    </button>
  );
}

export default TaskButton