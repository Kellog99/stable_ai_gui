import React, { useState, useRef, useEffect } from 'react';
import tinycolor from 'tinycolor2';

interface Feature {
  type: string;
  name: string;
}

interface SchemaVisualizationProps {
  features: Feature[];
  connections: [number, number][];
  labelColorMap: Record<string, string>;
}

const SchemaVisualization: React.FC<SchemaVisualizationProps> = ({
  features,
  connections,
  labelColorMap,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({
          width,
          height: Math.max(400, width * 0.5),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const maxRadius = features.reduce((max, feature) => {
    const nameParts = feature.name.includes("_") ? feature.name.split("_") : [feature.name];
    const estimatedWidth = Math.max(...nameParts.map(part => part.length)) * 6;
    return Math.max(max, estimatedWidth / 2 + 10);
  }, 20);

  // Improved positioning logic for non-crossing straight lines
  const getNodesPositions = () => {
    const positions: { x: number, y: number }[] = [];
    
    if (features.length === 0) return positions;
    
    // Place the first node (center node) in the middle-left
    const centerX = dimensions.width * 0.25;
    const centerY = dimensions.height / 2;
    positions[0] = { x: centerX, y: centerY };
    
    // If there's only one node, we're done
    if (features.length === 1) return positions;
    
    // For a radial layout with straight lines, we need to ensure nodes are placed
    // with enough angular separation to avoid line crossings
    
    // Find all nodes connected to the center node
    const connectedToCenter = connections
      .filter(([from, to]) => from === 0 || to === 0)
      .map(([from, to]) => from === 0 ? to : from);
    
    // Create a graph representation for all connections
    const graph: Record<number, number[]> = {};
    for (let i = 0; i < features.length; i++) {
      graph[i] = [];
    }
    
    for (const [from, to] of connections) {
      graph[from].push(to);
      graph[to].push(from);
    }
    
    // Create a layered layout approach:
    // Layer 1: The center node (already placed)
    // Layer 2: Nodes directly connected to center
    // Layer 3+: Subsequent connections arranged to avoid crossings
    
    // Place layer 2 nodes in a half-circle on the right
    const rightX = centerX + dimensions.width * 0.25;
    const layer2Radius = dimensions.height * 0.35;
    
    if (connectedToCenter.length > 0) {
      const angleStep = Math.PI / (connectedToCenter.length + 1);
      
      // Sort nodes by their number of connections to improve layout
      const sortedConnected = [...connectedToCenter].sort((a, b) => 
        graph[b].length - graph[a].length
      );
      
      sortedConnected.forEach((nodeIndex, i) => {
        const angle = -Math.PI / 2 + angleStep * (i + 1);
        positions[nodeIndex] = {
          x: rightX + layer2Radius * Math.cos(angle),
          y: centerY + layer2Radius * Math.sin(angle)
        };
      });
    }
    
    // Place remaining nodes (those not directly connected to center)
    const remainingNodes = Array.from({ length: features.length })
      .map((_, i) => i)
      .filter(i => i !== 0 && !connectedToCenter.includes(i));
    
    if (remainingNodes.length > 0) {
      // Group remaining nodes by what they connect to
      const nodeGroups: number[][] = [];
      const visited = new Set<number>();
      
      // Helper to find connected components in the graph
      const dfs = (node: number, group: number[]) => {
        visited.add(node);
        group.push(node);
        
        for (const neighbor of graph[node]) {
          if (!visited.has(neighbor) && remainingNodes.includes(neighbor)) {
            dfs(neighbor, group);
          }
        }
      };
      
      // Find connected components
      for (const node of remainingNodes) {
        if (!visited.has(node)) {
          const group: number[] = [];
          dfs(node, group);
          nodeGroups.push(group);
        }
      }
      
      // Place each group in a vertical column
      const totalWidth = dimensions.width - rightX - maxRadius * 2;
      const columnWidth = totalWidth / (nodeGroups.length || 1);
      
      nodeGroups.forEach((group, groupIndex) => {
        const groupX = rightX + columnWidth * (groupIndex + 0.5);
        const totalHeight = dimensions.height - maxRadius * 4;
        const rowHeight = totalHeight / (group.length || 1);
        
        group.forEach((nodeIndex, i) => {
          const y = maxRadius * 2 + rowHeight * (i + 0.5);
          positions[nodeIndex] = { x: groupX, y };
        });
      });
    }
    
    return positions;
  };

  const nodePositions = getNodesPositions();

  const darkenHexColor = (color: string): string => {
    return tinycolor(color).darken(40).toString();
  };

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
      >
        {connections.map(([from, to], idx) => {
          if (!nodePositions[from] || !nodePositions[to]) return null;
          
          const fromPos = nodePositions[from];
          const toPos = nodePositions[to];
          
          return (
            <line
              key={`connection-${idx}`}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke="#CBD5E1"
              strokeWidth="2"
            />
          );
        })}

        {features.map((feature, idx) => {
          if (!nodePositions[idx]) return null;
          
          const { x, y } = nodePositions[idx];
          const baseColor = labelColorMap[feature.name] || '#FFABAB';
          const textColor = darkenHexColor(baseColor);
          const nameParts = feature.name.includes("_")
            ? feature.name.split("_").map(part => part === "embeddings" ? "embs" : part)
            : [feature.name === "embeddings" ? "embs" : feature.name];

          return (
            <g 
              key={`feature-${idx}`}
            >
              <circle
                cx={x}
                cy={y}
                r={maxRadius}
                fill={baseColor}
                stroke={textColor}
                strokeWidth="2"
                className="transition-all duration-200 cursor-pointer"
              />
              {nameParts.map((part, index) => (
                <text
                  key={index}
                  x={x}
                  y={y + (index - (nameParts.length - 1) / 2) * 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={textColor}
                  className="text-sm font-medium select-none"
                >
                  {part}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

//export default SchemaVisualization;