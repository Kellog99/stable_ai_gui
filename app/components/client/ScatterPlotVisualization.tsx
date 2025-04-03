'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, PointCloudLayer } from '@deck.gl/layers';
import { log, OrbitView, project } from '@deck.gl/core';
import getData from '../../functionalities/Utils';
import useStore from "../../store/dsStore";
import LassoOverlay, {LassoDrawing} from './Lasso';
import LassoDrawer from './Lasso';
import deck from '@deck.gl/core/dist/lib/deck';
import {MapView} from '@deck.gl/core';
import {OrthographicView} from 'deck.gl';

interface OrbitViewState {
  target: [number, number, number]; // This ensures 'target' has exactly 3 elements
  rotationX?: number;
  rotationOrbit?: number;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  minRotationX?: number;
  maxRotationX?: number;
}

interface Point {
  position: [number, number];
  color: [number, number, number];
}

interface Info {
  index: number;
  object: any;
}

export async function getDataPoints(): Promise<Point[]> {
  const points = await getData();
  return points;
}

export default function ScatterPlotVisualization(){
  const deckRef = useRef<any>(null);
  const isDraggingRef = useRef<boolean>(false);

  const [lassoMode, setLassoMode] = useState<boolean>(false);
  const [data, setData] = useState<Point[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewState, setViewState] = useState<OrbitViewState>({
    target: [0, 0, 0],
    rotationX: 0,
    rotationOrbit: 0,
    zoom: -5,
  });
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>([]);

  const setSelectedIndexes = useStore((state) => state.setSelectedIndexes);
  const lazoModeSetter = useStore((state) => state.setLazoMode);

  useEffect(() => {
    getData()
      .then(fetchedData => {
        setData(fetchedData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Handler for mouse down events
    //console.log("BASE",lassoMode)
    const handleMouseDown = (event) => {
      // Middle mouse button has button value of 1
      if (event.button === 1) {
        setLassoMode(true)
        console.log("I AM MOUSE DOWN")
        //console.log('Mouse wheel button pressed down',lassoMode);
      }
    };

    // Handler for mouse up events
    const handleMouseUp = (event) => {
      if (event.button === 1) {
        setLassoMode(false)
        console.log("I AM MOUSE UP")
        //console.log('Mouse wheel button released',!lassoMode);
      }
    };

    // Add event listeners to the entire document
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    console.log("lassoMode changed:", lassoMode);
  }, [lassoMode]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

 

  const handlePointClick = (info: Info): void => {
    if (info.index !== -1 && !lassoMode) {
      const filteredPoints = selectedPoints.includes(info.index)
        ? selectedPoints.filter((i) => i !== info.index)
        : [...selectedPoints, info.index];

      setSelectedPoints(filteredPoints);
      setSelectedIndexes(filteredPoints);
    }
  };

  const layer = new PointCloudLayer({
    id: 'point-cloud-layer',
    data,
    pickable: true,
    pointSize: 2,
    getPosition: (d: Point) => d.position,
    getColor: (d: Point) => d.color,
    onClick: (info: any) => handlePointClick(info),
  });

  const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
    let inside = false;
    const n = polygon.length;
    
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const pi = polygon[i];
      const pj = polygon[j];
      
      const intersect = 
        ((pi.y > point.y) !== (pj.y > point.y)) && 
        (point.x < (pj.x - pi.x) * (point.y - pi.y) / (pj.y - pi.y) + pi.x);
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  }

  const handleDragStart = (info: any, event: any): void => {
    if (!lassoMode) return;
    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      setDragStart({ x: info.x, y: info.y });
      setDragCurrent(prev => [...prev, { x: info.x, y: info.y }]); 
    }
  };

  const handleDrag = (info: any, event: any): void => {
    if (!lassoMode || !dragStart) return;
    setDragCurrent(prev => [...prev, { x: info.x, y: info.y }]); 
  };

  const handleDragEnd = (info: any, event: any): void => {
    if (!lassoMode || !dragStart) return;
    
    const start = dragStart;
    const end = { x: info.x, y: info.y };
    
    // Polygon points defining the lasso area
    const polygon = dragCurrent
    
    const deckInstance = deckRef.current?.deck;
    if (!deckInstance) return;
    
    const viewports = deckInstance.getViewports();
    if (!viewports || viewports.length === 0) return;
    
    const viewport = viewports[0];
    const selected: number[] = [];
    
    data?.forEach((point, index) => {
      const screenPos = viewport.project(point.position);
      const [screenX, screenY] = screenPos;
      
      // Check if the point is inside the polygon
      if (isPointInPolygon({ x: screenX, y: screenY }, polygon)) {
        selected.push(index);
      }
    });
    
    setSelectedPoints(selected);
    setSelectedIndexes(selected);
    setDragStart(null);
    setDragCurrent([]);
    isDraggingRef.current = false;
  };

  let lassoStyle: React.CSSProperties = {};
  if (dragStart && dragCurrent) {
    const left = Math.min(dragStart.x, dragCurrent.x);
    const top = Math.min(dragStart.y, dragCurrent.y);
    const width = Math.abs(dragCurrent.x - dragStart.x);
    const height = Math.abs(dragCurrent.y - dragStart.y);
    lassoStyle = {
      position: 'absolute',
      pointerEvents: 'none',
      border: '2px dashed rgba(232, 11, 11, 0.8)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      left,
      top,
      width,
      height,
      zIndex: 100,
    };
  }
  
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div id="deckgl-container" style={{ width: '800px', height: '800px', position: 'relative', border: '2px solid black' }}>
          <DeckGL
            ref={deckRef}
            views={new OrthographicView({ fovy: 50 })}
            viewState={viewState}
            onViewStateChange={({ viewState }) => setViewState(viewState)}
            layers={[layer]}
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
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          />
        </div>
      </Suspense>
    </>
  );
}
