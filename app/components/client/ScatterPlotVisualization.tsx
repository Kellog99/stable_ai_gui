'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, PointCloudLayer } from '@deck.gl/layers';
import { log, OrbitView, project } from '@deck.gl/core';
import getData, { RetrieveSamples } from '../../functionalities/Utils';
import useStore from "../../store/dsStore";
import { OrthographicView } from 'deck.gl';
import { Flex, Loader, Menu, MenuDropdown, MenuItem, MultiSelect, Textarea } from '@mantine/core';
import featureLoader from '@/functionalities/FeatureLoader';
import style from 'styled-jsx/style';
import { type } from 'os';


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
  position: [ number, number ];
  color: [ number, number, number ];
}

interface Info
{
  index: number;
  object: any;
}

{/*
export async function getDataPoints(): Promise<Point[]> {
  const points = await getData();
  return points;
}
*/}

interface propsTypes
{
  datasetName: string,
  featureName: string,
  labelFeatureName?: string
}

export default function ScatterPlotVisualization ( props: propsTypes )
{


  const deckRef = useRef<any>( null );
  const isDraggingRef = useRef<boolean>( false );

  //const [lassoMode, setLassoMode] = useState<boolean>(false);

  const [ data, setData ] = useState<Point[] | null>( null );
  const [ colorMap, setColorMap ] = useState<Object>( {} )
  const [ labelDict, setLabelDict ] = useState<Object | null>( null )
  //const [ isLoading, setIsLoading ] = useState( true );
  const isLoading = useStore( ( state ) => state.isLoadingEmbs )
  const setIsLoading = useStore( ( state ) => state.setIsLoadingEmbs )

  const [ viewState, setViewState ] = useState<OrbitViewState>( {
    target: [ 0, 0, 0 ],
    rotationX: 0,
    rotationOrbit: 0,
    zoom: -5,
  } );
  const [ selectedPoints, setSelectedPoints ] = useState<number[]>( [] );
  const [ dragStart, setDragStart ] = useState<{ x: number; y: number } | null>( null );
  const [ dragCurrent, setDragCurrent ] = useState<{ x: number; y: number } | null>( [] );
  const [ originalColors, setOriginalColors ] = useState<Map<number, [ number, number, number ]>>( new Map() );
  const [ contextMenu, setContextMenu ] = useState( { visible: false, x: 0, y: 0 } );

  const setSelectedIndexes = useStore( ( state ) => state.setSelectedIndexes );
  const selectedIndexes = useStore( ( state ) => state.selectedIndexes )
  const hoverIndex = useStore( ( state ) => state.hoverIndex )

  const lassoMode = useStore( ( state ) => state.lazoMode );
  const lazoModeSetter = useStore( ( state ) => state.setLazoMode );
  const inputRef = useRef( null );
  const [ filteredLabels, setFilteredLabels ] = useState<string[] | null>( [] )
  const [ queryRetrieve, setQueryRetrieve ] = useState<string>( "" )

  useEffect( () =>
  {
    setSelectedIndexes( [] );
    setIsLoading( true );

    getData( props.datasetName, props.featureName, props.labelFeatureName )
      .then( ( fetched ) =>
      {
        setData( fetched.points ); // Only set the points in setData
        setColorMap( fetched.color_map ); // Set colorMap separately
        setOriginalColors( new Map( fetched.points.map( ( item, index ) => [ index, item.color ] ) ) );
      } )
      .finally( () =>
      {
        setIsLoading( false );
      } );
  }, [ props.featureName, props.labelFeatureName ] );


  useEffect( () =>
  {
    if ( props.labelFeatureName ) {
      const loadFeature = async () =>
      {

        try {
          const featureLoaded = await featureLoader( props.datasetName, props.labelFeatureName as string );
          console.log( "FEATURE LOADED:", featureLoaded );
          setLabelDict( featureLoaded.label_dict )
        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };
      loadFeature();
    }
  }, [ props.labelFeatureName ] );

  console.log( "LABEL DICT", labelDict )
  console.log( "COLORMAP", colorMap )

  const labelsList: string[] = labelDict ? Object.values( labelDict ) : [];

  useEffect( () =>
  {
    // Handler for mouse down events
    //console.log("BASE",lassoMode)
    const handleMouseDown = ( event ) =>
    {
      // Middle mouse button has button value of 1
      event.preventDefault()
      if ( event.button === 1 ) {
        event.preventDefault()
        lazoModeSetter( true )
        console.log( "I AM MOUSE DOWN" )
        //console.log('Mouse wheel button pressed down',lassoMode);
      }
    };

    // Handler for mouse up events
    const handleMouseUp = ( event ) =>
    {
      event.preventDefault()
      if ( event.button === 1 ) {
        lazoModeSetter( false )
        console.log( "I AM MOUSE UP" )
        //console.log('Mouse wheel button released',!lassoMode);
      }
    };

    // Add event listeners to the entire document
    document.addEventListener( 'mousedown', handleMouseDown );
    document.addEventListener( 'mouseup', handleMouseUp );

    // Cleanup function to remove event listeners
    return () =>
    {
      document.removeEventListener( 'mousedown', handleMouseDown );
      document.removeEventListener( 'mouseup', handleMouseUp );
    };
  }, [] ); // Empty dependency array means this effect runs once on mount

  useEffect( () =>
  {
    console.log( "lassoMode changed:", lassoMode );
  }, [ lassoMode ] );



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

  useEffect( () =>
    {
      setSelectedIndexes( [] );
      
  
      RetrieveSamples( props.datasetName, props.featureName, queryRetrieve )
        .then( ( fetched ) =>
        {
          setSelectedIndexes(fetched.indexes)
        } )
    }, [ queryRetrieve ] );

  // *******************************************************************************************************************************************

  useEffect( () =>
  {
    const highlightIndicesSet = new Set<number>( selectedIndexes );
    if ( data ) {
      const updatedData = data.map( ( item, index ) =>
      {
        const originalColor = originalColors.get( index ) ?? item.color;

        // If selectedIndexes is empty, use original colors for all points
        if ( selectedIndexes.length === 0 ) {
          return { ...item, color: originalColor };
        }

        // If this point is selected, use its original color
        if ( highlightIndicesSet.has( index ) ) {
          return { ...item, color: originalColor };
        }

        // Otherwise fade the non-selected points
        const fadedColor: [ number, number, number ] = originalColor.map(
          ( channel ) => Math.min( 255, Math.floor( channel + ( 255 - channel ) * 0.8 ) )
        ) as [ number, number, number ];

        return {
          ...item,
          color: fadedColor,
        };
      } );
      setData( updatedData );
    }
  }, [ selectedIndexes ] );


  const BASE_RADIUS_METERS = 3.5; // Base size of points in meters or pixels
  const HIGHLIGHT_RADIUS_METERS = BASE_RADIUS_METERS * 3; // Size of the hovered point
  const STROKE_WIDTH = 0.8; // Default border width for non-hovered points
  const HIGHLIGHT_STROKE_WIDTH = 2.5; // Thicker border for hovered point
  const HIGHLIGHT_STROKE_COLOR = [ 0, 0, 0, 255 ];; // Yellow highlight border (RGBA)
  const TRANSITION_DURATION = 300; // Milliseconds for the transition

  const layer = new ScatterplotLayer<Point>( {
    id: 'scatterplot-layer-hover-effect',
    data,
    pickable: true,
    // --- Style ---
    stroked: true, // Enable borders
    filled: true,
    radiusUnits: 'pixels', // Or 'meters' if your positions are lng/lat
    radiusScale: 1,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,

    // --- Accessors ---
    getPosition: ( d: Point ) => d.position,

    // Keep the size increase behavior
    getRadius: ( d: Point, { index }: { index: number } ) =>
      index === hoverIndex ? HIGHLIGHT_RADIUS_METERS : BASE_RADIUS_METERS,

    // Color accessor - keep original fill color for all points
    getFillColor: ( d: Point ) => d.color,

    // Stroke color accessor - highlight color for hovered point
    getLineColor: ( d: Point, { index }: { index: number } ) =>
      index === hoverIndex ? HIGHLIGHT_STROKE_COLOR : d.color,

    // Stroke width accessor - thicker for hovered point
    getLineWidth: ( d: Point, { index }: { index: number } ) =>
      index === hoverIndex ? HIGHLIGHT_STROKE_WIDTH : STROKE_WIDTH,

    // --- Interactivity ---
    onClick: ( info: any ) => handlePointClick( info ),

    // --- Transitions ---
    transitions: {
      getRadius: { duration: TRANSITION_DURATION },
      getLineWidth: { duration: TRANSITION_DURATION },
      getLineColor: { duration: TRANSITION_DURATION }
    },

    // --- Updates ---
    updateTriggers: {
      getRadius: [ hoverIndex ],
      getLineWidth: [ hoverIndex ],
      getLineColor: [ hoverIndex ]
    },
  } );

  // Remember to include this layer in the 'layers' array passed to your <DeckGL> component.
  // Ensure the component re-renders when 'hoverIndex' changes.

  {/*
  const layer = new PointCloudLayer( {
    id: 'point-cloud-layer',
    data,
    pickable: true,
    pointSize: 3.5,
    getPosition: ( d: Point ) => d.position,
    getColor: ( d: Point ) => d.color,
    onClick: ( info: any ) => handlePointClick( info ),
  } );
  */}

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

  const handleClick = () =>
  {
    if ( contextMenu.visible ) {
      setContextMenu( { ...contextMenu, visible: false } );
    }
  };

  useEffect( () =>
  {
    document.addEventListener( 'click', handleClick );
    return () =>
    {
      document.removeEventListener( 'click', handleClick );
    };
  }, [ contextMenu.visible ] );


  const handleContextMenu = ( e ) =>
  {
    e.preventDefault();
    setContextMenu( { visible: true, x: e.pageX, y: e.pageY } );
  };

  const menuItems = [
    { label: 'Clear indexes', action: () => setSelectedIndexes( [] ) }
  ];


  useEffect( () =>
  {
    // Create a container for our input that captures events before they reach deck.gl
    const setupInputCapture = () =>
    {
      if ( !inputRef.current ) return;

      // Make sure the input can receive mouse events
      inputRef.current.style.pointerEvents = 'auto';

      // Add event listeners that stop propagation to prevent deck.gl from capturing them
      const stopPropagation = ( e ) =>
      {
        e.stopPropagation();
      };

      inputRef.current.addEventListener( 'mousedown', stopPropagation );
      inputRef.current.addEventListener( 'click', stopPropagation );
      inputRef.current.addEventListener( 'touchstart', stopPropagation );

      // Clean up
      return () =>
      {
        if ( inputRef.current ) {
          inputRef.current.removeEventListener( 'mousedown', stopPropagation );
          inputRef.current.removeEventListener( 'click', stopPropagation );
          inputRef.current.removeEventListener( 'touchstart', stopPropagation );
        }
      };
    };

    return setupInputCapture();
  }, [] );


  return (
    <>
      { isLoading ? (
        <>
          <Flex
            mih={ 150 }
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            style={ { width: '100%' } }
          >
            <p>Loading...</p>
            <Loader />
          </Flex>
        </>
      ) : ( <>
        { !data ? ( <Flex
          mih={ 150 }
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          style={ { width: '100%' } }
        >No data available</Flex> ) : (
          <>
            <div style={ { position: 'relative', width: '1830px', height: '600px' } }>
              { props.labelFeatureName ? ( <div style={ { position: 'absolute', top: '10px', left: '20px', zIndex: 10 } }>
                <MultiSelect
                  radius="md"
                  size='xs'
                  label="Labels"
                  placeholder="Choose one or more labels to visualize"
                  data={ labelsList }
                  value={ filteredLabels as string[] }
                  onChange={ ( value ) => setFilteredLabels( value ) }
                  searchable
                  clearable
                />
              </div> ) : null }





              <Suspense>
                <div
                  id="deckgl-container"
                  onContextMenu={ handleContextMenu }
                  style={ {
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    border: '2px solid #9a9a9a',
                    background: 'white',
                    overflow: 'hidden',
                  } }
                >

                  <DeckGL
                    ref={ deckRef }
                    views={ new OrthographicView( { fovy: 50 } ) }
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
            </div>


            <Textarea
              id="search-input"
              ref={ inputRef }
              label="Semantic Search"
              placeholder="Write something you're interested in finding"
              radius="md"
              value={ queryRetrieve }
              onChange={ ( event ) => setQueryRetrieve( event.currentTarget.value ) }
              style={ {
                width: "400px",
                pointerEvents: 'auto',
                marginTop:"6px"
              } }
              onClick={ ( e ) =>
              {
                e.stopPropagation();
                e.target.focus();
              } }
              onFocus={ ( e ) => e.stopPropagation() }
            />
          </>
        ) }

        { contextMenu.visible && (
          <div style={ { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' } }>
            <div
              style={ {
                position: 'absolute',
                top: contextMenu.y,
                left: contextMenu.x,
                zIndex: 1000,
                pointerEvents: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: 'white',
                minWidth: '150px',
              } }
            >
              { menuItems.map( ( item, index ) => (
                <div
                  key={ index }
                  onClick={ item.action }
                  style={ {
                    padding: '8px 12px',
                    cursor: 'pointer',
                  } }
                  onMouseOver={ ( e ) => e.currentTarget.style.backgroundColor = '#f5f5f5' }
                  onMouseOut={ ( e ) => e.currentTarget.style.backgroundColor = 'transparent' }
                >
                  { item.label }
                </div>
              ) ) }
            </div>
          </div>
        ) }
      </>
      ) }
    </>
  );
}
