'use client';

import React, { useState, useRef, useEffect, Suspense} from 'react';
import DeckGL from '@deck.gl/react';
import { PointCloudLayer } from '@deck.gl/layers';
import { OrbitView } from '@deck.gl/core';
import IndexHandler from './IndexHandler';
import getData from '../../functionalities/Utils';
import  useStore  from "../../store/dsStore";



export async function getDataPoints(){
  const points = await getData()
  return points;
}

export function PointCloudVisualization() {
  const deckRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    getData().then(fetchedData => {
      setData(fetchedData); 
    });
  }, []); 

  const [viewState, setViewState] = useState({
    target: [0, 0, 0],
    rotationX: 0,
    rotationOrbit: 0,
    zoom: 0,
    
  });
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [lassoMode, setLassoMode] = useState<boolean>(false);
  const isDraggingRef = useRef(false);

  const setSelectedIndexes = useStore((state) => state.setSelectedIndexes)

  const handlePointClick = (info) => {
    if (info.index !== -1 && !lassoMode) {
      // Filter points outside of the setSelectedPoints function
      const filteredPoints = selectedPoints.includes(info.index)
        ? selectedPoints.filter((i) => i !== info.index)
        : [...selectedPoints, info.index];
      
      // Pass the filtered points to setSelectedPoints
      setSelectedPoints(filteredPoints);
      setSelectedIndexes(filteredPoints)
    }
  };

  const layer = new PointCloudLayer({
    id: 'point-cloud-layer',
    data,
    pickable: true,
    pointSize: 2,
    getPosition: (d: Point) => d.position,
    getColor: (d: Point) => d.color,
    onClick: (info) => {handlePointClick(info)},
  });

  const handleDragStart = (info: any, event: any) => {
    if (!lassoMode) return;
    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      console.log('Lasso drag started:', info, event);
      setDragStart({ x: info.x, y: info.y });
      setDragCurrent({ x: info.x, y: info.y }); // Initialize dragCurrent to the starting point
    }
  };

  const handleDrag = (info: any, event: any) => {
    if (!lassoMode || !dragStart) return;
    // Update the current drag coordinates
    setDragCurrent({ x: info.x, y: info.y });
  };

  const handleDragEnd = (info: any, event: any) => {
    if (!lassoMode || !dragStart) return;
    console.log('Lasso drag ended:', info, event);

    const start = dragStart;
    const end = { x: info.x, y: info.y };

    // Calculate the selection bounding box in screen coordinates
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    // Get the deck instance and the current viewport to project points
    const deckInstance = deckRef.current?.deck;
    if (!deckInstance) return;
    const viewports = deckInstance.getViewports();
    if (!viewports || viewports.length === 0) return;
    const viewport = viewports[0];

    const selected: number[] = [];
    data.forEach((point, index) => {
      // Use the viewport's project method to convert world coordinates to screen coordinates
      const screenPos = viewport.project(point.position);
      const [screenX, screenY] = screenPos;
      if (screenX >= minX && screenX <= maxX && screenY >= minY && screenY <= maxY) {
        selected.push(index);
      }
    });

    setSelectedPoints(selected);
    setSelectedIndexes(selected)
    // Reset drag state
    setDragStart(null);
    setDragCurrent(null);
    isDraggingRef.current = false;
  };

  const toggleLassoMode = () => {
    setLassoMode((prev) => !prev);
  };

  // Compute the rectangle style if a drag is in progress
  let lassoStyle: React.CSSProperties = {};
  if (dragStart && dragCurrent) {
    const left = Math.min(dragStart.x, dragCurrent.x);
    const top = Math.min(dragStart.y, dragCurrent.y);
    const width = Math.abs(dragCurrent.x - dragStart.x);
    const height = Math.abs(dragCurrent.y - dragStart.y);
    lassoStyle = {
      position: 'absolute',
      pointerEvents: 'none',
      border: '2px dashed rgba(232, 11, 11, 0.8)', // White border with good visibility
      backgroundColor: 'rgba(255, 255, 255, 0.15)',  // Slightly more visible but still transparent
      left,
      top,
      width,
      height,
      zIndex: 100,
    };
    
  }

  
  //const setter = useStore().setSelectedIndexes
  //setter(selectedPoints)
  //const indexes = useStore((state) => state.indexes)
  //console.log(indexes)
  //setSelectedIndexes(selectedPoints)

  return (
    <>
      <Suspense fallback={<div>TEST SUSPENSE</div>}>
      <div id="deckgl-container" style={{width: '800px', height: '800px', position: 'relative', border: '2px solid black'  }}>
        <DeckGL
          ref={deckRef}
          views={new OrbitView({ fov: 50 })}
          viewState={viewState}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          layers={[layer]}
          parameters={{
            clearColor: [0.1, 0.1, 0.1, 1],
          }}
          controller={
            lassoMode
              ? {
                  scrollZoom: false,
                  dragRotate: false,
                  dragPan: false,
                  doubleClickZoom: false,
                }
              : {
                  scrollZoom: true,
                  dragRotate: true,
                  dragPan: true,
                  doubleClickZoom: false,
                }
          }
          enableEvents={true}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        />
        {/* Lasso rectangle visualization */}
        {lassoMode && dragStart && dragCurrent && (
          <div style={lassoStyle} />
        )}

      </div>
      </Suspense>

      {/* Toggle button placed outside the DeckGL container */}
      <button
        onClick={toggleLassoMode}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '6px 12px',
          borderRadius: '4px',
          backgroundColor: lassoMode ? '#dc2626' : '#16a34a',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {lassoMode ? 'Exit Lasso Mode' : 'Enter Lasso Mode'}
      </button>
    </>
  );
}
