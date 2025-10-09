import useStore from '@/store/dsStore';
import styles from '@/styles/AsyncTracker.module.css';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';


/**
 * AsyncTaskTracker - A reusable component for tracking Ray task progress
 * 
 * @param {Object} props
 * @param {string} props.startEndpoint - The endpoint to start the task (e.g., "/actions/embedder")
 * @param {Object} props.startParams - Query parameters for the start request
 * @param {Object} props.startBody - Request body for the start request (optional)
 * @param {string} props.progressEndpoint - The endpoint to check progress (e.g., "/embedder/progress")
 * @param {number} props.pollInterval - Polling interval in ms (default: 2000)
 * @param {boolean} props.progressDisplayMode - If true, show progress bar; if false, show spinner (default: true)
 * @param {Function} props.onComplete - Callback when task completes successfully
 * @param {Function} props.onError - Callback when task errors
 * @param {React.ReactNode} props.children - Render prop function or trigger button
 */

interface AsyncTaskTrackerProps
{
  startEndpoint: string;
  startParams: Record<string, any>;
  startBody: any;
  progressEndpoint: string;
  pollInterval: number;
  progressDisplayMode: boolean;
  onComplete?: ( result: any ) => void;
  onError?: ( error: Error ) => void;
}
export default function AsyncTaskTracker ( { startEndpoint, startParams, startBody, progressEndpoint, pollInterval, progressDisplayMode = true, onComplete, onError }: AsyncTaskTrackerProps )
{
  const [ status, setStatus ] = useState( 'idle' );
  const [ progress, setProgress ] = useState( 0 );
  const [ message, setMessage ] = useState( '' );
  const [ error, setError ] = useState( null );
  const [ result, setResult ] = useState( null );
  const startedRef = useRef( false );

  const activeTask = useStore( ( state ) => state.activeTask );
  const setActiveTask = useStore( ( state ) => state.setActiveTask );


  const startTask = async () =>
  {

    try {
      setStatus( 'starting' );
      setError( null );
      setProgress( 0 );
      setMessage( 'Initiating task...' );


      const queryString = new URLSearchParams( startParams ).toString();
      const url = `${startEndpoint}${queryString ? `?${queryString}` : ''}`;

      // Make request
      const options = {
        method: startBody ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: startBody ? JSON.stringify( startBody ) : undefined,
      }

      const response = await fetch( url, options );

      if ( !response.ok ) {
        throw new Error( `Failed to start task: ${response.statusText}` );
      }

      const data = await response.json();
      setActiveTask( data.task_id );
      setStatus( 'started' );
      setMessage( data.message || 'Task started' );
    } catch ( err: any ) {
      setStatus( 'error' );
      setError( err.message );
      setMessage( 'Failed to start task' );
      if ( onError ) onError( err );
    }
  };

  const pollProgress = async () =>
  {
    try {
      const url = `${progressEndpoint}?task_id=${activeTask}`;
      const response = await fetch( url );

      if ( !response.ok ) {
        throw new Error( `Failed to fetch progress: ${response.statusText}` );
      }

      const data = await response.json();

      setStatus( data.status );
      setProgress( data.progress || 0 );
      setMessage( data.message || '' );

      if ( data.status === 'complete' ) {
        setResult( data.result );
        setActiveTask( "" );
        setStatus( 'complete' );
      }
    } catch ( err: any ) {
      setStatus( 'error' );
      setError( err.message );
    
    }
  };


  

  useEffect( () =>
  {
    if ( startedRef.current ) return;
    startedRef.current = true;

    if ( activeTask === "" ) {
      startTask();
    } else {
      pollProgress();
    }
  }, [] );


  useEffect( () =>
  {
    if ( activeTask && status !== 'complete' && status !== 'error' ) {
      pollProgress();
    }
  }, [ activeTask, status ] );

  
  useEffect( () =>
  {
    const intervalId = setInterval( pollProgress, pollInterval );
    return () => clearInterval( intervalId );
  }, [ activeTask, status, progressEndpoint, pollInterval ] );



console.log("STATUS", status)
  return (
    <div className={ styles.container }>
      { ( status === 'starting' ||
        status === 'started' ||
        status === 'processing' ||
        status === 'projecting' ||
        status === 'loading_model' ) && (
          <div className={ styles.statusSection }>
            { progressDisplayMode ? (
              <div className={ styles.progressBarContainer }>
                <Loader2 className={ styles.spinnerSmall } />
                <div className={ styles.progressContent }>
                  <div className={ styles.progressHeader }>
                    <span className={ styles.progressMessage }>
                      { message || 'Processing...' }
                    </span>
                    <span className={ styles.progressPercent }>{ progress }%</span>
                  </div>
                  <div className={ styles.progressTrack }>
                    <div
                      className={ styles.progressFill }
                      style={ { width: `${progress}%` } }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className={ styles.spinnerMode }>
                <Loader2 className={ styles.spinnerLarge } />
                <span className={ styles.spinnerMessage }>
                  { message || 'Processing...' }
                </span>
              </div>
            ) }
            <div className={ styles.taskId }>Task ID: { activeTask }</div>
          </div>
        ) }

      { status === 'complete' && (
        <div className={ styles.statusSection }>
          <div className={ styles.successHeader }>
            <CheckCircle2 className={ styles.iconSuccess } />
            <span className={ styles.successText }>
              { message || 'Task completed successfully!' }
            </span>
          </div>
          { result && (
            <div className={ styles.resultBox }>
              <pre className={ styles.resultText }>
                { JSON.stringify( result, null, 2 ) }
              </pre>
            </div>
          ) }
        </div>
      ) }

      { status === 'error' && (
        <div className={ styles.statusSection }>
          <div className={ styles.errorHeader }>
            <XCircle className={ styles.iconError } />
            <span className={ styles.errorText }>Task failed</span>
          </div>
          <div className={ styles.errorBox }>
            <p className={ styles.errorMessage }>
              { error || 'An unknown error occurred' }
            </p>
          </div>
        </div>
      ) }
    </div>
  );
};