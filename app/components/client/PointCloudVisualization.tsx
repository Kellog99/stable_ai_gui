'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import DeckGL from '@deck.gl/react';
import { PointCloudLayer } from '@deck.gl/layers';
import { OrbitView} from '@deck.gl/core';
import getData from '../../functionalities/BackendUtils';
import useStore from "../../store/dsStore";
import { Flex } from '@mantine/core';

interface OrbitViewState
{
  target: [ number, number, number ]; // This ensures 'target' has exactly 3 elements
  rotationX?: number;
  rotationOrbit?: number;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  minRotationX?: number;
  maxRotationX?: number;
}

interface Point
{
  position: [ number, number, number ];
  color: [ number, number, number, number ];
}

interface Info
{
  index: number;
  object: any;
}

export async function getDataPoints (): Promise<Point[]>
{
  const points = await getData();
  return points;
}

export default function PointCloudVisualization ()
{
  const deckRef = useRef<any>( null );
  const isDraggingRef = useRef<boolean>( false );

  const setSelectedIndexes = useStore( ( state ) => state.setSelectedIndexes );
  const lassoMode = useStore( ( state ) => state.lazoMode );

  const [ data, setData ] = useState<Point[] | null>( null );
  const [ isLoading, setIsLoading ] = useState( true );
  const [ viewState, setViewState ] = useState<OrbitViewState>( {
    target: [ 0, 0, 0 ],
    rotationX: 0,
    rotationOrbit: 0,
    zoom: 0,
  } );
  const [ selectedPoints, setSelectedPoints ] = useState<number[]>( [] );
  const [ dragStart, setDragStart ] = useState<{ x: number; y: number } | null>( null );
  const [ dragCurrent, setDragCurrent ] = useState<{ x: number; y: number } | null>( [] );

  useEffect( () =>
  {
    getData()
      .then( fetchedData =>
      {
        setData( fetchedData );
      } )
      .finally( () =>
      {
        setIsLoading( false );
      } );
  }, [] );

  if ( isLoading ) {

    return <Flex
      mih={ 150 }
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
      style={ { width: '100%' } }
    >Loading...</Flex>;
  }

  if ( !data ) {
    return <Flex
      mih={ 150 }
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
      style={ { width: '100%' } }
    >No data available</Flex>;
  }

  const handlePointClick = ( info: Info ): void =>
  {
    if ( info.index !== -1 && !lassoMode ) {
      const filteredPoints = selectedPoints.includes( info.index )
        ? selectedPoints.filter( ( i ) => i !== info.index )
        : [ ...selectedPoints, info.index ];

      setSelectedPoints( filteredPoints );
      setSelectedIndexes( filteredPoints );
    }
  };

  const layer = new PointCloudLayer( {
    id: 'point-cloud-layer',
    data,
    pickable: true,
    pointSize: 2,
    getPosition: ( d: Point ) => d.position,
    getColor: ( d: Point ) => d.color,
    onClick: ( info: any ) => handlePointClick( info ),
  } );

  const isPointInPolygon = ( point: Point, polygon: Point[] ): boolean =>
  {
    let inside = false;
    const n = polygon.length;

    for ( let i = 0, j = n - 1; i < n; j = i++ ) {
      const pi = polygon[ i ];
      const pj = polygon[ j ];

      const intersect =
        ( ( pi.y > point.y ) !== ( pj.y > point.y ) ) &&
        ( point.x < ( pj.x - pi.x ) * ( point.y - pi.y ) / ( pj.y - pi.y ) + pi.x );

      if ( intersect ) inside = !inside;
    }

    return inside;
  }

  const handleDragStart = ( info: any, event: any ): void =>
  {
    if ( !lassoMode ) return;
    if ( !isDraggingRef.current ) {
      isDraggingRef.current = true;
      setDragStart( { x: info.x, y: info.y } );
      setDragCurrent( prev => [ ...prev, { x: info.x, y: info.y } ] );
    }
  };

  const handleDrag = ( info: any, event: any ): void =>
  {
    if ( !lassoMode || !dragStart ) return;
    setDragCurrent( prev => [ ...prev, { x: info.x, y: info.y } ] );
  };

  const handleDragEnd = ( info: any, event: any ): void =>
  {
    if ( !lassoMode || !dragStart ) return;

    const start = dragStart;
    const end = { x: info.x, y: info.y };

    // Polygon points defining the lasso area
    const polygon = dragCurrent

    const deckInstance = deckRef.current?.deck;
    if ( !deckInstance ) return;

    const viewports = deckInstance.getViewports();
    if ( !viewports || viewports.length === 0 ) return;

    const viewport = viewports[ 0 ];
    const selected: number[] = [];

    data?.forEach( ( point, index ) =>
    {
      const screenPos = viewport.project( point.position );
      const [ screenX, screenY ] = screenPos;

      // Check if the point is inside the polygon
      if ( isPointInPolygon( { x: screenX, y: screenY }, polygon ) ) {
        selected.push( index );
      }
    } );

    setSelectedPoints( selected );
    setSelectedIndexes( selected );
    setDragStart( null );
    setDragCurrent( [] );
    isDraggingRef.current = false;
  };

  let lassoStyle: React.CSSProperties = {};
  if ( dragStart && dragCurrent ) {
    const left = Math.min( dragStart.x, dragCurrent.x );
    const top = Math.min( dragStart.y, dragCurrent.y );
    const width = Math.abs( dragCurrent.x - dragStart.x );
    const height = Math.abs( dragCurrent.y - dragStart.y );
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
      <Suspense fallback={ <div>Loading...</div> }>
        <div id="deckgl-container" style={ { width: "100%", height: '600px', borderTop: '2px solid #9a9a9a', borderBottom: '2px solid #9a9a9a', background: '#f0f0f0' } }>
          <DeckGL
            ref={ deckRef }
            views={ new OrbitView( { fovy: 50 } ) }
            viewState={ viewState }
            onViewStateChange={ ( { viewState } ) => setViewState( viewState ) }
            layers={ [ layer ] }
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
            onDragStart={ handleDragStart }
            onDrag={ handleDrag }
            onDragEnd={ handleDragEnd }
          />
        </div>
      </Suspense>
    </>
  );
}
