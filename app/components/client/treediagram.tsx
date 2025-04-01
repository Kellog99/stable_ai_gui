import React, { useState, useEffect } from "react";
import Tree from "react-d3-tree";

interface Feature {
  type: string;
  name: string;
}

interface Node {
  name: string;
  children?: Node[];
  nodeSvgShape?: any;
}

interface Props {
  features: Feature[];
  connections: [number, number][];
  labelColorMap: Record<string, string>;
}

const TreeVisualization: React.FC<Props> = ({ features, connections, labelColorMap }) => {
  const [treeData, setTreeData] = useState<Node | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Update dimensions when component mounts
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    const nodesMap = new Map<number, Node>();
    
    // Create nodes with proper color mapping
    features.forEach((feature, index) => {
      nodesMap.set(index, {
        name: feature.name,
        nodeSvgShape: {
          shape: "circle",
          shapeProps: {
            r: 20,
            fill: labelColorMap[feature.type] || "#FFABAB", // Using feature.type for color mapping
            stroke: "black",
            strokeWidth: 1,
          },
        },
      });
    });
    
    const root = nodesMap.get(0);
    if (!root) return;
    
    connections.forEach(([parentIdx, childIdx]) => {
      const parent = nodesMap.get(parentIdx);
      const child = nodesMap.get(childIdx);
      if (parent && child) {
        if (!parent.children) parent.children = [];
        parent.children.push(child);
      }
    });
    
    setTreeData(root);
  }, [features, connections, labelColorMap]);

  if (!treeData) return <div>Loading...</div>;

  return (
    <div 
      ref={containerRef} 
      style={{ width: "100%", height: "500px" }}
    >
      <Tree
        data={treeData}
        orientation="horizontal"
        translate={{ x: 100, y: 250 }}
        zoomable={true}
        draggable={true}
        collapsible={false}
        separation={{ siblings: 2, nonSiblings: 2.5 }} // Increase separation between nodes
        pathFunc="diagonal" // Can use "diagonal" or "step" for different path styles
        nodeSize={{ x: 200, y: 100 }} // Explicitly set node size to prevent overlapping
      />
    </div>
  );
};

export default TreeVisualization;