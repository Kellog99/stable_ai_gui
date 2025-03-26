'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import DeckGL from '@deck.gl/react';
import { PointCloudLayer } from '@deck.gl/layers';
import { OrbitView } from '@deck.gl/core';
import getData from '../../functionalities/Utils';
import useStore from "../../store/dsStore";

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
  position: [number, number, number];
  color: [number, number, number, number];
}

interface Info {
  index: number;
  object: any;
}

export async function getDataPoints(): Promise<Point[]> {
  const points = await getData();
  return points;
}

export function PointCloudVisualization(){
  const deckRef = useRef<any>(null);
  const [data, setData] = useState<Point[] | null>(null);

  useEffect(() => {
    getData().then(fetchedData => {
      setData(fetchedData);
    });
  }, []);

  const [viewState, setViewState] = useState<OrbitViewState>({
    target: [0, 0, 0],
    rotationX: 0,
    rotationOrbit: 0,
    zoom: 0,
  });

  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [lassoMode, setLassoMode] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  const setSelectedIndexes = useStore((state) => state.setSelectedIndexes);

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

  const handleDragStart = (info: any, event: any): void => {
    if (!lassoMode) return;
    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      setDragStart({ x: info.x, y: info.y });
      setDragCurrent({ x: info.x, y: info.y });
    }
  };

  const handleDrag = (info: any, event: any): void => {
    if (!lassoMode || !dragStart) return;
    setDragCurrent({ x: info.x, y: info.y });
  };

  const handleDragEnd = (info: any, event: any): void => {
    if (!lassoMode || !dragStart) return;

    const start = dragStart;
    const end = { x: info.x, y: info.y };

    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    const deckInstance = deckRef.current?.deck;
    if (!deckInstance) return;
    const viewports = deckInstance.getViewports();
    if (!viewports || viewports.length === 0) return;
    const viewport = viewports[0];

    const selected: number[] = [];
    data?.forEach((point, index) => {
      const screenPos = viewport.project(point.position);
      const [screenX, screenY] = screenPos;
      if (screenX >= minX && screenX <= maxX && screenY >= minY && screenY <= maxY) {
        selected.push(index);
      }
    });

    setSelectedPoints(selected);
    setSelectedIndexes(selected);
    setDragStart(null);
    setDragCurrent(null);
    isDraggingRef.current = false;
  };

  const toggleLassoMode = (): void => {
    setLassoMode((prev) => !prev);
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
            views={new OrbitView({ fovy: 50 })}
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
          {lassoMode && dragStart && dragCurrent && (
            <div style={lassoStyle} />
          )}
        </div>
      </Suspense>

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
          cursor: 'pointer',
        }}
      >
        {lassoMode ? 'Exit Lasso Mode' : 'Enter Lasso Mode'}
      </button>
    </>
  );
}
