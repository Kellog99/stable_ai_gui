"use client";

import { FeatureSchema } from "@/interfaces/genericInterface";
import
{
  Edge,
  Node,
  NodeChange,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useNodesInitialized,
  useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useEffect, useRef } from "react";
import tinycolor from "tinycolor2";
import useStore from "../../store/dsStore";
import { labelColorMapType } from "@/properties/static";


interface SchemaVisualizationProps
{
  features: FeatureSchema[];
  connections: [ string, string ][];
  labelColorMap: Record<string, string>;
  clickable?: boolean;
}


const darkenHexColor = ( color: string ): string =>
{
  return tinycolor( color ).darken( 40 ).toString();
};


const buildTreeLayout = ( { features, connections, labelColorMap, clickable }: SchemaVisualizationProps ) =>
{
  const nodeSize = 80;
  const horizontalSpacing = 160; // Fixed horizontal spacing between nodes
  const verticalSpacing = 120;

  console.log( "features:", features )
  console.log( "EDGES:", connections )
  const depthGroups: Record<number, string[]> = {};
  features.forEach( ( feature ) =>
  {
    if ( !depthGroups[ feature.depth ] ) {
      depthGroups[ feature.depth ] = [];
    }
    depthGroups[ feature.depth ].push( feature.name );
  } );

  const nodes: Node[] = features.map( ( feature ) =>
  {
    const depthIndex = depthGroups[ feature.depth ].indexOf( feature.name );
    const x = feature.depth * horizontalSpacing;
    const y = ( depthIndex - ( depthGroups[ feature.depth ].length - 1 ) / 2 ) * verticalSpacing;

    let featureName = feature.name;
    const modelName = feature.model_name;
    console.log(JSON.stringify(features, null, 2));


    const umapMatch = featureName.match( /(umap)_\d+$/ );
    if ( umapMatch ) {
      featureName = featureName.replace( /(_\d+)$/, "" );
    }
    const nameParts = featureName.includes( "_" ) ? featureName.split( "_" ) : [ featureName ];
    const formattedParts = nameParts.map( part => part.includes( "embeddings" ) ? part.replace( "embeddings", "embs" ) : part );

    const backgroundColor = labelColorMapType[ feature.type ] || "#FFF5BA";
    const darkerColor = darkenHexColor( backgroundColor );



    return {
      id: feature.name,
      position: { x, y },
      data: {
      label: (
        <div
          {...(modelName ? { title: `Model: ${modelName}` } : {})}
          style={ {
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            fontSize: "small",
            pointerEvents: "auto"
          } }
        >
          { formattedParts.map( ( part, index ) => (
            <span key={ index }>{ part }</span>
          ) ) }
        </div>
      )
    },
      style: {
        background: backgroundColor,
        width: `${nodeSize}px`,
        height: `${nodeSize}px`,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        textAlign: "center",
        fontSize: "1rem",
        color: "black",
        border: `2px solid ${darkerColor}`,
        pointerEvents: "auto",
        cursor: clickable ? "pointer" :  "default",
        //cursor: "pointer"
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      draggable: false, // Prevent dragging
      selectable: false, // Prevent selection
      connectable: false
    };
  } );

  const edges: Edge[] = connections.map( ( [ source, target ] ) => ( {
    id: `${source}-${target}`,
    source,
    target,
    animated: false,
    sourcePosition: Position.Left,
    targetPosition: Position.Right,
    style: { strokeWidth: 1, stroke: "black" },
    interactionWidth: 0 // Disable interaction with edges
  } ) );

  const maxX = Math.max( ...nodes.map( node => node.position.x ) ) + nodeSize + horizontalSpacing;
  const maxY = Math.max( ...nodes.map( node => Math.abs( node.position.y ) ) ) * 2 + nodeSize + verticalSpacing;

  return { nodes, edges, dimensions: { width: maxX, height: maxY } };
};



const SchemaGraph: React.FC<{
  nodes: Node[],
  edges: Edge[],
  dimensions: { width: number, height: number }
}> = ( { nodes, edges, dimensions } ) =>
  {
    const reactFlowInstance = useReactFlow();
    const nodesInitialized = useNodesInitialized();
    const fitViewCalled = useRef( false );

    const setFeatureToDisplay = useStore( ( state ) => state.setFeatureToDisplay );


    const onNodesChange = useCallback( ( changes: NodeChange[] ) =>
    {
      if ( !fitViewCalled.current && changes.length > 0 ) {
        fitViewCalled.current = true;
        reactFlowInstance.fitView( {
          padding: 0.2,
          includeHiddenNodes: true,
          duration: 0
        } );
      }
    }, [ reactFlowInstance ] );

    useEffect( () =>
    {
      if ( nodesInitialized && !fitViewCalled.current ) {
        fitViewCalled.current = true;
        reactFlowInstance.fitView( {
          padding: 0.2,
          includeHiddenNodes: true,
          duration: 0
        } );
      }
    }, [ nodesInitialized, reactFlowInstance ] );

    const handleNodeClick = useCallback( ( event: React.MouseEvent, node: Node ) =>
    {
      setFeatureToDisplay( node.id ); // Logs the name of the clicked node (id in this case)
    }, [] );

    return (
      <div style={ {
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        background: "transparent",
        margin: "0 auto"
      } }>
        <ReactFlow
          nodes={ nodes }
          edges={ edges }
          onNodesChange={ onNodesChange }
          fitView
          fitViewOptions={ {
            padding: 0.2,
            includeHiddenNodes: true,
            duration: 0
          } }
          minZoom={ 1 }
          maxZoom={ 1 }
          nodesDraggable={ false }
          zoomOnScroll={ false }
          panOnDrag={ false }
          elementsSelectable={ false }
          preventScrolling={ true }
          style={ { pointerEvents: "none" } }
          onNodeClick={ handleNodeClick }
          proOptions={{ hideAttribution: true }}
        />
      </div>
    );
  };

const HorizontalTreeSchema: React.FC<SchemaVisualizationProps> = ( { features, connections, labelColorMap, clickable } ) =>
{
  const { nodes, edges, dimensions } = buildTreeLayout( { features, connections, labelColorMap, clickable } );

  return (
    <ReactFlowProvider>
      <SchemaGraph nodes={ nodes } edges={ edges } dimensions={ dimensions } />
    </ReactFlowProvider>
  );
};

export default HorizontalTreeSchema;
