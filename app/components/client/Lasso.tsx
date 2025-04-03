import path from 'path';
import React, { useState, useRef, useEffect } from 'react';
import useStore from "../../store/dsStore";

interface LassoDrawerProps {
  children: React.ReactNode;
}

const LassoDrawer: React.FC<LassoDrawerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  //const lassoMode = useStore((state) => state.lazoMode);
  const [lassoMode,setLassoMode] = useState<boolean>(true)

  useEffect(() => {
    console.log("USEEFFECT",lassoMode)
    setPoints([])
  }, [lassoMode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setLassoMode(false)
    console.log("LASSO IN",lassoMode)
    if (!lassoMode) return;
    if (!containerRef.current) return;
    if (e.button!==1) return;
    console.log("QUI")
    console.log(lassoMode)
    console.log("QUI2")
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPoints([{ x, y }]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!lassoMode) return;
    if (!isDrawing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPoints(prev => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    setLassoMode(true)
    console.log("LASSO OUT",lassoMode)
    if (!lassoMode) return;
    setIsDrawing(false);
  };

  // Generate SVG path from points
  const generatePath = () => {
    if (points.length < 2) return '';
    return points.reduce((path, point, index) => {
      return index === 0 
        ? `M ${point.x} ${point.y}` 
        : `${path} L ${point.x} ${point.y}`;
    }, '');
  };

  const lassoStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 100,
  };

  const svgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  };

  return (
    <div 
      ref={containerRef}
      style={{ position: 'relative' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
      {points.length > 0 && (
        <div style={lassoStyle}>
          <svg style={svgStyle}>
            <path
              d={generatePath()}
              fill="none"
              stroke="rgba(232, 11, 11, 0.8)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default LassoDrawer;import {ReactNode,FC,CSSProperties} from 'react';
import style from 'styled-jsx/style';
import {fill} from 'three/src/extras/TextureUtils';
