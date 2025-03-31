"use client";

import React from "react";
import { ReactFlow, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Popover, Text, Paper } from "@mantine/core";

// Custom Node Component
const CustomNode = ({ data }: any) => {
  return (
    <Popover width={200} position="top" withArrow shadow="md">
      <Popover.Target>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#228be6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            position: "relative",
          }}
        >
          {data.label}
          <Handle type="source" position={Position.Right} />
          <Handle type="target" position={Position.Left} />
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <Paper shadow="xs" p="sm">
          <Text size="sm">{data.info}</Text>
        </Paper>
      </Popover.Dropdown>
    </Popover>
  );
};

// Nodes & Edges
const initialNodes = [
  { id: "1", position: { x: 100, y: 100 }, data: { label: "Image", info: "This is an image node" }, type: "custom" },
  { id: "2", position: { x: 300, y: 100 }, data: { label: "Label", info: "This is a label node" }, type: "custom" },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }];

const SchemaFlow = () => {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={{ custom: CustomNode }}
        fitView
      />
    </div>
  );
};

export default SchemaFlow;
