import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface DataPoint {
  x: number;
  y: number;
  z: number;
  value?: number;
}

interface ScatterPlot3DProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  pointSize?: number;
  colorScale?: 'viridis' | 'rainbow' | 'category';
  onPointClick?: (index: number) => void;
}

const ScatterPlot3D: React.FC<ScatterPlot3DProps> = ({
  data = [],
  width = 800,
  height = 600,
  pointSize = 5,
  colorScale = 'viridis',
  onPointClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  useEffect(() => {
    if (!containerRef.current || !data.length) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;

    // Geometry and Material setup
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    const normalizeData = (values: number[]) => {
      const min = Math.min(...values);
      const max = Math.max(...values);
      return values.map(val => (val - min) / (max - min) * 2 - 1);
    };

    const normalizedData = {
      x: normalizeData(data.map(d => d.x)),
      y: normalizeData(data.map(d => d.y)),
      z: normalizeData(data.map(d => d.z)),
    };

    data.forEach((point, i) => {
      positions.push(normalizedData.x[i], normalizedData.y[i], normalizedData.z[i]);
      const color = new THREE.Color().setHSL(i / data.length, 1, 0.5);
      colors.push(color.r, color.g, color.b);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: pointSize / 100,
      vertexColors: true,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    // Raycaster setup
    raycasterRef.current = new THREE.Raycaster();

    // Mouse click event listener
    const onClick = (event: MouseEvent) => {
      if (event.button === 0) { // Left click
        // Update mouse position
        const rect = renderer.domElement.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;

        // Update raycaster
        raycasterRef.current?.setFromCamera(mouseRef.current, camera);

        // Check for intersections
        const intersects = raycasterRef.current?.intersectObject(points);
        if (intersects?.length) {
          const index = intersects[0].index;
          console.log(`Point clicked at index: ${index}`);
          if (onPointClick) {
            onPointClick(index);
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', onClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('click', onClick);
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [data, width, height, pointSize, colorScale, onPointClick]);

  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  return <div ref={containerRef} className="border border-gray-300 rounded-lg" />;
};

export default ScatterPlot3D;
