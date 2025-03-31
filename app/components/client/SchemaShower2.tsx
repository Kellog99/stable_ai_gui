import React from 'react';
import { ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
  Position,
  useEdgesState,
  useNodesState,
  Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { HoverCard, Text } from '@mantine/core';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 250, y: 100 },
    data: { label: 'Image' },
    type: 'customNode',
  },
  {
    id: '2',
    position: { x: 250, y: 300 },
    data: { label: 'Label' },
    type: 'customNode',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
];

const CustomNode = ({ data }: { data: { label: string } }) => {
    return (
      <div style={{ position: 'relative' }}>
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#555' }}
        />
        <HoverCard width={280} shadow="md">
          <HoverCard.Target>
            <div
              style={{
                background: '#fff',
                padding: '10px',
                borderRadius: '50%',
                width: '100px',
                height: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px solid #ddd',
              }}
            >
              {data.label}
            </div>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">
              This is additional information about {data.label} that appears on hover.
              You can add any content here!
            </Text>
          </HoverCard.Dropdown>
        </HoverCard>
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: '#555' }}
        />
      </div>
    );
  };

const nodeTypes = {
  customNode: CustomNode,
};

function Schema() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
  );
}

export default Schema;