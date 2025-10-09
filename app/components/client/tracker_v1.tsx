import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

/**
 * AsyncTaskTracker - A reusable component for tracking Ray task progress
 * 
 * @param {Object} props
 * @param {string} props.startEndpoint - The endpoint to start the task (e.g., "/actions/embedder")
 * @param {Object} props.startParams - Query parameters for the start request
 * @param {Object} props.startBody - Request body for the start request (optional)
 * @param {string} props.progressEndpoint - The endpoint to check progress (e.g., "/embedder/progress")
 * @param {number} props.pollInterval - Polling interval in ms (default: 2000)
 * @param {Function} props.onComplete - Callback when task completes successfully
 * @param {Function} props.onError - Callback when task errors
 * @param {React.ReactNode} props.children - Render prop function or trigger button
 */

interface AsyncTaskTrackerProps {
  startEndpoint: string;
  startParams: Record<string, any>;
  startBody: any;
  progressEndpoint: string;
  pollInterval: number;
  onComplete: (result: any) => void;
  onError: (error: Error) => void;
  children: React.ReactNode;
}
const AsyncTaskTracker = ({ startEndpoint, startParams, startBody, progressEndpoint, pollInterval, onComplete, onError, children }: AsyncTaskTrackerProps) => {
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Start the task
  const startTask = useCallback(async () => {
    try {
      setStatus('starting');
      setError(null);
      setProgress(0);
      setMessage('Initiating task...');

      // Build query string
      const queryString = new URLSearchParams(startParams).toString();
      const url = `${startEndpoint}${queryString ? `?${queryString}` : ''}`;

      // Make request
      const options = {
        method: startBody ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (startBody) {
        options.body = JSON.stringify(startBody);
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Failed to start task: ${response.statusText}`);
      }

      const data = await response.json();
      setTaskId(data.task_id);
      setStatus('started');
      setMessage(data.message || 'Task started');
    } catch (err) {
      setStatus('error');
      setError(err.message);
      setMessage('Failed to start task');
      if (onError) onError(err);
    }
  }, [startEndpoint, startParams, startBody, onError]);

  // Poll for progress
  useEffect(() => {
    if (!taskId || status === 'complete' || status === 'error') {
      return;
    }

    const pollProgress = async () => {
      try {
        const url = `${progressEndpoint}?task_id=${taskId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch progress: ${response.statusText}`);
        }

        const data = await response.json();
        
        setStatus(data.status);
        setProgress(data.progress || 0);
        setMessage(data.message || '');
        
        if (data.status === 'complete') {
          setResult(data.result);
          if (onComplete) onComplete(data.result);
        } else if (data.status === 'error') {
          setError(data.error);
          if (onError) onError(new Error(data.error));
        }
      } catch (err) {
        setStatus('error');
        setError(err.message);
        if (onError) onError(err);
      }
    };

    const intervalId = setInterval(pollProgress, pollInterval);
    pollProgress(); // Poll immediately

    return () => clearInterval(intervalId);
  }, [taskId, status, progressEndpoint, pollInterval, onComplete, onError]);

  // Reset function
  const reset = useCallback(() => {
    setTaskId(null);
    setStatus('idle');
    setProgress(0);
    setMessage('');
    setError(null);
    setResult(null);
  }, []);

  // If children is a function, use render props pattern
  if (typeof children === 'function') {
    return children({
      startTask,
      reset,
      status,
      progress,
      message,
      error,
      result,
      taskId,
      isRunning: status === 'started' || status === 'processing' || status === 'starting',
      isComplete: status === 'complete',
      isError: status === 'error',
      isIdle: status === 'idle'
    });
  }

  // Default UI
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {status === 'idle' && (
        <button
          onClick={startTask}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {children || 'Start Task'}
        </button>
      )}

      {(status === 'starting' || status === 'started' || status === 'processing' || status === 'projecting' || status === 'loading_model') && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {message || 'Processing...'}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Task ID: {taskId}
          </div>
        </div>
      )}

      {status === 'complete' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-medium">{message || 'Task completed successfully!'}</span>
          </div>
          {result && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <pre className="text-xs text-gray-700 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          <button
            onClick={reset}
            className="w-full px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Start New Task
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600">
            <XCircle className="w-6 h-6" />
            <span className="font-medium">Task failed</span>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">{error || 'An unknown error occurred'}</p>
          </div>
          <button
            onClick={reset}
            className="w-full px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

// Example usage component
const ExampleUsage = () => {
  const [selectedExample, setSelectedExample] = useState('embedder');

  const examples = {
    embedder: {
      startEndpoint: '/actions/embedder',
      startParams: {
        datasetName: 'my_dataset',
        featureName: 'images',
        modelUsed: 'apple/DFN5B-CLIP-ViT-H-14-378'
      },
      progressEndpoint: '/embedder/progress'
    },
    completeness: {
      startEndpoint: '/metrics/getCompleteness',
      startParams: {
        datasetName: 'my_dataset',
        featureName: 'images'
      },
      startBody: {
        requirements: ['cats', 'dogs', 'birds']
      },
      progressEndpoint: '/metrics/progress'
    },
    duplicates: {
      startEndpoint: '/metrics/getDuplicates',
      startParams: {
        datasetName: 'my_dataset',
        featureName: 'images'
      },
      startBody: {
        threshold: 0.95
      },
      progressEndpoint: '/metrics/progress'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Async Task Tracker Demo
          </h1>
          <p className="text-gray-600">
            A reusable component for tracking long-running Ray tasks with progress monitoring
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Example
          </label>
          <select
            value={selectedExample}
            onChange={(e) => setSelectedExample(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="embedder">Embedder Task</option>
            <option value="completeness">Completeness Metric</option>
            <option value="duplicates">Duplicates Metric</option>
          </select>
        </div>

        <AsyncTaskTracker
          key={selectedExample}
          {...examples[selectedExample]}
          onComplete={(result) => console.log('Task completed:', result)}
          onError={(error) => console.error('Task failed:', error)}
        >
          Start {selectedExample} Task
        </AsyncTaskTracker>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Using Render Props Pattern</h3>
          <p className="text-sm text-blue-800 mb-4">
            For more control, use the render props pattern:
          </p>
          <pre className="bg-white p-4 rounded text-xs overflow-auto">
{`<AsyncTaskTracker
  startEndpoint="/actions/embedder"
  startParams={{ datasetName: 'test', featureName: 'images' }}
  progressEndpoint="/embedder/progress"
>
  {({ startTask, status, progress, message, reset, isComplete }) => (
    <div>
      {status === 'idle' && <button onClick={startTask}>Start</button>}
      {status === 'processing' && <div>{message} - {progress}%</div>}
      {isComplete && <button onClick={reset}>Reset</button>}
    </div>
  )}
</AsyncTaskTracker>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;