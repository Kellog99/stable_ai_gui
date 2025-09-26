'use client';

import featureLoader from '@/functionalities/FeatureLoader';
import { IconLayer, ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { Box, Flex, Loader, Slider, Text, Textarea } from '@mantine/core';
import { OrthographicView, OrthographicViewState } from 'deck.gl';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import getData, { getModelInfo, RetrieveSamples } from '../../functionalities/BackendUtils';
import useStore from "../../store/dsStore";

import { ModelInfo } from '@/interfaces/genericInterface';
import { image_type, text_type } from '@/properties/types';
import { Search } from 'lucide-react';
import Link from "next/link";
import classes from "../../pages/dataquality/embeddings/page.module.css";
import { AlertCust } from './AlertCustom';
import LassoDrawer from './Lasso';
// No need for 'style' from 'styled-jsx/style' if not used for actual styling


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
  layer: { id: string };
}

interface propsTypes
{
  datasetName: string,
  featureName: string,
  modelUsed?: string,
  labelFeatureName?: string,
  show_uq: boolean
}

export default function ScatterPlotVisualization ( props: propsTypes )
{
  const deckRef = useRef<any>( null );
  const textareaRef = useRef<HTMLTextAreaElement>( null ); // Ref for the textarea
  const [ isTextareaFocused, setIsTextareaFocused ] = useState<boolean>( false ); // New state to track textarea focus

  const isDraggingRef = useRef<boolean>( false );

  const [ data, setData ] = useState<Point[] | null>( null );
  const [ queryData, setQueryData ] = useState<Point[] | null>( null );

  const setColorMap = useStore( ( state ) => state.setColorMap )

  const [ labelDict, setLabelDict ] = useState<Object | null>( null )
  const isLoading = useStore( ( state ) => state.isLoadingEmbs )
  const setIsLoading = useStore( ( state ) => state.setIsLoadingEmbs )
  const [ isLoadingRetr, setIsLoadingRetr ] = useState<boolean>( false )
  const [ noEmbAvailable, setNoEmbAvailable ] = useState<boolean>( false )
  const [ viewState, setViewState ] = useState<OrthographicViewState>( {
    target: [ 0, 0, 0 ],
    zoom: -5,
  } );
  const selectedPoints = useStore( ( state ) => state.selectedPoints )
  const setSelectedPoints = useStore( ( state ) => state.setSelectedPoints )
  const [ enableTextArea, setEnableTextArea ] = useState<boolean>( false );
  const [ dragStart, setDragStart ] = useState<{ x: number; y: number } | null>( null );
  const [ dragCurrent, setDragCurrent ] = useState<{ x: number; y: number }[]>( [] );
  const [ originalColors, setOriginalColors ] = useState<Map<number, [ number, number, number ]>>( new Map() );
  const setUqColors = useStore( ( state ) => state.setUqColors )


  const [ contextMenu, setContextMenu ] = useState( { visible: false, x: 0, y: 0 } );

  const setSelectedIndexes = useStore( ( state ) => state.setSelectedIndexes );
  const selectedIndexes = useStore( ( state ) => state.selectedIndexes )
  const hoverIndex = useStore( ( state ) => state.hoverIndex )
  const setHoverIndex = useStore( ( state ) => state.setHoverIndex );
  const datasetUsed = useStore( ( state ) => state.datasetUsed )

  const lassoMode = useStore( ( state ) => state.lazoMode );
  const lazoModeSetter = useStore( ( state ) => state.setLazoMode );
  const filteredLabels = useStore( ( state ) => state.filteredLabels )

  const [ queryRetrieve, setQueryRetrieve ] = useState<string>( "" )
  const [ queryTop_k, setQueryTop_k ] = useState<number>( 10 )

  const [ queries, setQueries ] = useState<string[]>( [] )


  function getAllKeysByValues ( object: any, valuesList: any[] )
  {
    return valuesList.flatMap( value =>
      Object.keys( object ).filter( key => object[ key ] === value )
    );
  }


  useEffect( () =>
  {
    setSelectedIndexes( [] );
    setSelectedPoints( [] )
    setIsLoading( true );
    try {
      getData( props.datasetName, props.featureName, props.show_uq, props.labelFeatureName, getAllKeysByValues( labelDict, filteredLabels as string[] ), props.modelUsed, queries )
        .then( ( fetched ) =>
        {
          if ( fetched.points.length != 0 ) {
            setData( fetched.points );
            setColorMap( fetched.color_map );
            setOriginalColors( new Map( fetched.points.map( ( item: any, index: number ) => [ index, item.color ] ) ) );
            const colors = Array.isArray( fetched.points )
              ? fetched.points.map( ( item: Point ) => item.color )
              : [];
            setUqColors( colors )
            setQueryData( fetched.query_points )
            setNoEmbAvailable( false )
            const enable = !checkMultiModalCompatibility( modelInfo, props.featureName );
            setEnableTextArea( enable );
          } else {
            setData( null )
            setNoEmbAvailable( true )
            setEnableTextArea( false );
          }
        } )
        .finally( () =>
        {
          setIsLoading( false );
        } )
    }
    catch ( error ) {
      console.log( "Failed to get data from backend" )
    }
  }, [ props.datasetName, props.featureName, props.labelFeatureName, filteredLabels, props.show_uq, props.modelUsed, setColorMap, setUqColors, setIsLoading, setSelectedIndexes, setSelectedPoints ] ); // Added all dependencies

  useEffect( () =>
  {
    if ( props.labelFeatureName ) {
      const loadFeature = async () =>
      {
        try {
          const featureLoaded = await featureLoader( props.datasetName, props.labelFeatureName as string );
          setLabelDict( featureLoaded.label_dict )
        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };
      loadFeature();
    }
  }, [ props.labelFeatureName ] );

  useEffect( () =>
  {
    const handleMouseDown = ( event: MouseEvent ) =>
    {
      if ( event.button === 1 ) { // Middle mouse button
        event.preventDefault(); // Prevent default browser behavior (e.g., autoscroll)
        lazoModeSetter( true );
      }
    };

    const handleMouseUp = ( event: MouseEvent ) =>
    {
      if ( event.button === 1 ) { // Middle mouse button
        event.preventDefault();
        lazoModeSetter( false );
      }
    };

    document.addEventListener( 'mousedown', handleMouseDown );
    document.addEventListener( 'mouseup', handleMouseUp );

    return () =>
    {
      document.removeEventListener( 'mousedown', handleMouseDown );
      document.removeEventListener( 'mouseup', handleMouseUp );
    };
  }, [ lazoModeSetter ] ); // Dependency on lazoModeSetter

  // Lasso mode logging - useful for debugging, keep if desired
  useEffect( () =>
  {
    console.log( "lassoMode changed:", lassoMode );
  }, [ lassoMode ] );

  const handlePointClick = useCallback( ( info: any ): void =>
  {
    // Only allow clicks if not in lasso mode and not focusing the textarea
    const index = info.index;
    if ( index !== undefined && index !== -1 && !lassoMode && !isTextareaFocused ) {
      const newSelectedPoints = selectedPoints.includes( index )
        ? selectedPoints.filter( ( i ) => i !== index )
        : [ ...selectedPoints, index ];

      setSelectedPoints( newSelectedPoints );
      setSelectedIndexes( newSelectedPoints );
    }
  }, [ lassoMode, isTextareaFocused, selectedPoints, setSelectedPoints, setSelectedIndexes ] );

  //useEffect(() => {
  //  if (queryRetrieve !== "") {
  //    setSelectedIndexes([]);
  //    setSelectedPoints([])
  //
  //    let loadingTimeout = setTimeout(() => {
  //      setIsLoadingRetr(true);
  //    }, 500);
  //
  //    // Use a Set to avoid duplicate queries, then convert back to array
  //    setQueries(prevQueries => Array.from(new Set([...prevQueries, queryRetrieve])));
  //    RetrieveSamples(props.datasetName, props.featureName, queryRetrieve, queryTop_k, props.modelUsed as string)
  //      .then((fetched) => {
  //        setSelectedIndexes(fetched.indexes);
  //      })
  //      .finally(() => {
  //        clearTimeout(loadingTimeout);
  //        setIsLoadingRetr(false);
  //      });
  //  }
  //}, [queryRetrieve, queryTop_k]);

  useEffect( () =>
  {
    const highlightIndicesSet = new Set<number>( selectedIndexes );
    if ( data ) {
      const updatedData = data.map( ( item, index ) =>
      {
        const originalColor = originalColors.get( index ) ?? item.color;

        if ( selectedIndexes.length === 0 ) {
          return { ...item, color: originalColor };
        }

        if ( highlightIndicesSet.has( index ) ) {
          return { ...item, color: originalColor };
        }

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


  const BASE_RADIUS_METERS = 3.5;
  const HIGHLIGHT_RADIUS_METERS = BASE_RADIUS_METERS * 3;
  const STROKE_WIDTH = 0.8;
  const HIGHLIGHT_STROKE_WIDTH = 2.5;
  const HIGHLIGHT_STROKE_COLOR = [ 0, 0, 0, 255 ];
  const TRANSITION_DURATION = 300;

  const layer = new ScatterplotLayer<Point>( {
    id: 'scatterplot-layer-hover-effect',
    data,
    pickable: true,
    stroked: true,
    filled: true,
    radiusUnits: 'pixels',
    radiusScale: 1,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,

    getPosition: ( d: Point ) => d.position,
    getRadius: ( d: Point, { index }: { index: number } ) =>
      index === hoverIndex ? HIGHLIGHT_RADIUS_METERS : BASE_RADIUS_METERS,
    getFillColor: ( d: Point ) => d.color,
    getLineColor: ( d: Point, { index }: { index: number } ) =>
      index === hoverIndex
        ? new Uint8ClampedArray( HIGHLIGHT_STROKE_COLOR )
        : new Uint8ClampedArray( d.color ),
    getLineWidth: ( d: Point, { index }: { index: number } ) =>
      index === hoverIndex ? HIGHLIGHT_STROKE_WIDTH : STROKE_WIDTH,
    onClick: handlePointClick,
    transitions: {
      getRadius: { duration: TRANSITION_DURATION },
      getLineWidth: { duration: TRANSITION_DURATION },
      getLineColor: { duration: TRANSITION_DURATION }
    },
    updateTriggers: {
      getRadius: [ hoverIndex ],
      getLineWidth: [ hoverIndex ],
      getLineColor: [ hoverIndex ]
    },
  } );

  const iconMapping = {
    star: {
      x: 0, y: 0, width: 24, height: 24, anchorY: 12, mask: false
    }
  };

  const queryLayer = new IconLayer<Point>( {
    id: 'icon-layer',
    data: queryData,
    iconAtlas: '/crosshairs-target-star.svg',
    iconMapping,
    getIcon: ( d: Point ) => "star",
    getPosition: ( d: Point ) => d.position,
    getSize: 25,
    getColor: ( d: Point ) => d.color,
    pickable: true
  } );

  const isPointInPolygon = ( point: { x: number; y: number }, polygon: { x: number; y: number }[] ): boolean =>
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

  const handleDragStart = ( info: any ): void =>
  {
    if ( !lassoMode ) return;
    if ( !isDraggingRef.current ) {
      isDraggingRef.current = true;
      setDragStart( { x: info.x, y: info.y } );
      setDragCurrent( [ { x: info.x, y: info.y } ] ); // Initialize dragCurrent as an array
    }
  };

  const handleDrag = ( info: any ): void =>
  {
    if ( !lassoMode || !dragStart ) return;
    setDragCurrent( prev => [ ...( prev || [] ), { x: info.x, y: info.y } ] ); // Ensure prev is an array
  };

  const handleDragEnd = ( info: any ): void =>
  {
    if ( !lassoMode || !dragStart || !dragCurrent ) return; // Ensure dragCurrent is not null

    const polygon = dragCurrent;

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

      if ( isPointInPolygon( { x: screenX, y: screenY }, polygon as { x: number; y: number }[] ) ) { // Cast polygon for safety
        selected.push( index );
      }
    } );

    setSelectedPoints( selected );
    setSelectedIndexes( selected );

    setDragStart( null );
    setDragCurrent( [] );
    isDraggingRef.current = false;
  };

  // Lasso style is conditional on dragStart and dragCurrent, and doesn't directly impact the DeckGL interaction issue.
  // Kept as is.
  let lassoStyle: React.CSSProperties = {};
  if ( dragStart && dragCurrent ) {
    const left = Math.min( dragStart.x, dragCurrent[ 0 ]?.x || 0 ); // Use first point for initial x
    const top = Math.min( dragStart.y, dragCurrent[ 0 ]?.y || 0 ); // Use first point for initial y
    const width = Math.abs( ( dragCurrent[ dragCurrent.length - 1 ]?.x || 0 ) - dragStart.x ); // Use last point for width
    const height = Math.abs( ( dragCurrent[ dragCurrent.length - 1 ]?.y || 0 ) - dragStart.y ); // Use last point for height
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

  // Context menu logic
  useEffect( () =>
  {
    document.addEventListener( 'click', handleClick );
    return () =>
    {
      document.removeEventListener( 'click', handleClick );
    };
  }, [ contextMenu.visible ] );

  const handleContextMenu = ( e: React.MouseEvent ) =>
  {
    e.preventDefault();
    setContextMenu( { visible: true, x: e.pageX, y: e.pageY } );
  };

  const menuItems = [
    {
      label: 'Clear indexes',
      action: () =>
      {
        setSelectedIndexes( [] );
        setSelectedPoints( [] );
        setContextMenu( { ...contextMenu, visible: false } ); // Close context menu
      }
    }
  ];

  // Modified: Textarea event handling - simplified to focus/blur
  // This useEffect previously tried to stop propagation which might be redundant
  // when pointer-events are managed. We need onFocus/onBlur for `isTextareaFocused`.
  useEffect( () =>
  {
    const textarea = textareaRef.current;
    if ( !textarea ) return;

    // These styles are fine as they ensure the textarea is interactive
    textarea.style.pointerEvents = 'auto';
    textarea.style.touchAction = 'auto';

    // The core issue is DeckGL capturing events.
    // We handle focus/blur directly to manage DeckGL's controller.
  }, [] );

  // Updated handleClick to just handle context menu closure
  const handleClick = ( e: MouseEvent ) =>
  {
    if ( contextMenu.visible ) {
      setContextMenu( { ...contextMenu, visible: false } );
    }
  };

  const [ inputValue, setInputValue ] = useState( queryRetrieve );
  const [ inputTopK, setInputTopK ] = useState( queryTop_k )
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>( null );

  // Update queryRetrieve after user stops typing for 500ms
  useEffect( () =>
  {
    if ( typingTimeoutRef.current ) {
      clearTimeout( typingTimeoutRef.current );
    }
    typingTimeoutRef.current = setTimeout( () =>
    {
      setQueryRetrieve( inputValue );
      setQueryTop_k( inputTopK )
    }, 1 ); // adjust delay as needed
  }, [ inputValue, inputTopK ] );

  console.log( "queries saved:", queries )

  useEffect( () =>
  {
    if ( queryRetrieve === "" ) {
      setSelectedIndexes( [] )
      setSelectedPoints( [] )
    }
  }, [ queryRetrieve ] )

  const handleClearSearch = () =>
  {
    setInputValue( "" );
    setSelectedIndexes( [] )
    setSelectedPoints( [] )
    setQueryRetrieve( "" )
  }

  const handleKeyDown = ( event: React.KeyboardEvent<HTMLTextAreaElement> ) =>
  {
    if ( event.key === 'Enter' && !event.shiftKey ) {
      event.preventDefault(); // Prevent new line if needed
      if ( queryRetrieve !== "" ) {
        setSelectedIndexes( [] );
        setSelectedPoints( [] )

        let loadingTimeout = setTimeout( () =>
        {
          setIsLoadingRetr( true );
        }, 500 );

        // Use a Set to avoid duplicate queries, then convert back to array
        setQueries( prevQueries => Array.from( new Set( [ ...prevQueries, queryRetrieve ] ) ) );
        RetrieveSamples( props.datasetName, props.featureName, queryRetrieve, queryTop_k, props.modelUsed as string )
          .then( ( fetched ) =>
          {
            setSelectedIndexes( fetched.indexes );
          } )
          .finally( () =>
          {
            clearTimeout( loadingTimeout );
            setIsLoadingRetr( false );
          } );
      }
    }
  };

  console.log( "INDEXES:", selectedIndexes )
  console.log( "POINTS:", selectedPoints )
  // const [hoverInfo, setHoverInfo] = useState(null); // No longer needed, as hoverIndex is from store
  const [ modelInfo, setModelInfo ] = useState<ModelInfo | null>( null )

  useEffect( () =>
  {
    if ( props.modelUsed ) {
      try {
        getModelInfo( props.modelUsed as string )
          .then( ( fetched ) =>
          {
            setModelInfo( fetched );
          } )
      }
      catch ( error ) {
        console.log( "Failed to load model info" )
      }
    }
  }, [ props.modelUsed ] );

  function checkMultiModalCompatibility ( modelInfo: ModelInfo | null, featureName: string )
  {
    if ( Array.isArray( datasetUsed?.features ) && modelInfo ) {
      const feature = datasetUsed.features.find( f => f.name === featureName );
      const type = feature?.type;
      if ( type === image_type && modelInfo.supports_images == true && modelInfo.supports_text == true ) { // Removed `&& modelInfo.supports_text == true` for image_type

        return true;
      } else if ( type === text_type && modelInfo.supports_text == true ) {

        return true;
      }
    }

    return false; // Default return if conditions are not met
  }

  // New: Handlers for textarea focus/blur
  const handleTextareaFocus = useCallback( () =>
  {
    setIsTextareaFocused( true );
  }, [] );

  const handleTextareaBlur = useCallback( () =>
  {
    setIsTextareaFocused( false );
  }, [] );

  // New: Dynamic controller based on lassoMode and isTextareaFocused
  const deckGLController =
    lassoMode || isTextareaFocused
      ? {
        scrollZoom: false,
        dragRotate: false,
        dragPan: false,
        doubleClickZoom: false,
        keyboard: false, // Disables keyboard navigation for DeckGL when textarea is focused
      }
      : {
        scrollZoom: true,
        dragRotate: true,
        dragPan: true,
        doubleClickZoom: false, // Keep double click zoom disabled if that's the desired default
        keyboard: true,
      };

  return (
    <>


      { isLoading ? (
        <Flex
          mih={ 150 }
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          style={ { width: '100%' } }
        >
          <Text>Loading...</Text>
          <Loader />
        </Flex>
      ) : noEmbAvailable === true ? (
        <Text> No Embs Available </Text>
      )
        : ( <>
          { !data ? (
            <Flex
              mih={ 150 }
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
              style={ { width: '100%' } }
            >
              <AlertCust result={ 'error' }
                textToDisplay={
                  <>
                    Something occured while trying to get the data. Check if the embeddings are correctly loaded to the dataset. Otherwise you can compute them { " " }
                    <Link
                      href={ {
                        pathname: "/pages/dataquality/actions/embeddings",
                        query: { datasetName: datasetUsed?.name }
                      } }
                      style={ { color: 'blue' } }
                    >
                      here
                    </Link>.
                  </> } />
            </Flex> ) : (
            <>
              <Flex direction="row" justify="space-between" align="start">
                <div style={ { width: '80%', height: '600px', position: 'relative' } }>
                  <Suspense>
                    <LassoDrawer>
                      <div id="deckgl-container"
                        onContextMenu={ handleContextMenu }
                        style={ {
                          width: '100%',
                          height: '100%',
                          border: '2px solid #9a9a9a',
                          background: 'white',
                          overflow: 'hidden',
                          zIndex: 10,
                          // The pointerEvents on the container might need to be dynamic
                          // but for now, let's rely on the controller prop for interaction.
                          pointerEvents: 'auto', // Keep this as auto, controller will manage disabling
                        } }>
                        <DeckGL
                          ref={ deckRef }
                          views={ new OrthographicView() }
                          viewState={ viewState }
                          onViewStateChange={ ( { viewState } ) => setViewState( viewState ) }
                          onHover={ info =>
                          {
                            // Only update hoverIndex if the textarea is NOT focused
                            if ( !isTextareaFocused ) {
                              if ( info.index !== undefined && info.index !== -1 ) {
                                setHoverIndex( info.index );
                              } else {
                                setHoverIndex( null ); // Clear hover when not on an object
                              }
                            } else {
                              setHoverIndex( null ); // Explicitly clear hover if textarea is focused
                            }
                          } }
                          getTooltip={ () =>
                            hoverIndex !== null && data && data[ hoverIndex ] && !isTextareaFocused // Also check isTextareaFocused for tooltip visibility
                              ? {
                                html: `<div class="custom-tooltip">Index: ${hoverIndex}</div>`, // Use hoverIndex from store
                                style: {
                                  borderRadius: '10px',
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                  color: '#fff',
                                  padding: '8px',
                                  pointerEvents: 'none',
                                }
                              }
                              : null
                          }
                          layers={ [ layer, queryLayer ] }
                          controller={ deckGLController } // Dynamically set controller
                          onDragStart={ handleDragStart }
                          onDrag={ handleDrag }
                          onDragEnd={ handleDragEnd }
                          style={ { zIndex: "100" } } />
                      </div>
                    </LassoDrawer>
                  </Suspense>
                </div>

                <div className={ classes.featureBox } style={ { height: "600px", marginLeft: "20px" } }>
                  { datasetUsed?.name !== "military" ? (
                    <Flex
                      direction="column"
                      align="start"
                      justify="center">
                      <Box style={ { width: "300px" } }>
                        <div className={ classes.tooltipBox }>
                          <Search className={ classes.tooltipIcon } />
                          <span>Semantic Search</span>
                        </div>
                        <Text size="sm" style={ { textAlign: 'center', width: '100%', marginTop: "1px" } }>Search something you're interested in finding</Text>

                        <Textarea
                          id="search-input"
                          ref={ textareaRef }
                          placeholder="Write something..."
                          radius="md"
                          value={ inputValue }
                          onChange={ ( event ) => setInputValue( event.currentTarget.value ) }
                          disabled={ !enableTextArea }
                          onFocus={ handleTextareaFocus } // New: Set focus state
                          onBlur={ handleTextareaBlur }   // New: Clear focus state
                          onKeyDown={ handleKeyDown }
                          style={ {
                            width: "100%",
                            pointerEvents: 'auto', // Ensure textarea can capture events
                            touchAction: 'auto',
                            paddingRight: "6px",
                            marginTop: "6px",
                            zIndex: 1000 // Ensure textarea is above DeckGL canvas
                          } }
                        // The onClick and onFocus here were remnants of previous attempts to stop propagation.
                        // With dynamic controller and z-index, they might be redundant or counterproductive.
                        // Removing them for cleaner event flow.

                        />
                        { queryRetrieve !== "" ?

                          ( <>
                            <Text size="sm" style={ { marginBottom: 0, marginTop: "20px" } }>Number of best guesses</Text>
                            <Slider
                              defaultValue={ 10 }
                              min={ 0 }
                              max={ data?.length || 100 } // Added null check for data.length
                              step={ 1 }
                              marks={ [
                                { value: 0, label: '0' },
                                { value: data?.length || 100, label: `${data?.length || 100}` }, // Added null check
                              ] }
                              value={ inputTopK }
                              onChange={ ( value ) => setInputTopK( value ) }
                            /> </> ) : null }

                      </Box>
                      { isLoadingRetr ? ( <><Text style={{marginTop:"20px"}}>Initializing</Text> <Loader type="dots" size="sm"></Loader></> ) : null }
                    </Flex>
                  ) : null }
                </div>
              </Flex>

            </>
          ) }


          { contextMenu.visible && (
            <div style={ { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' } }>
              <div
                style={ {
                  position: 'absolute',
                  top: contextMenu.y,
                  left: contextMenu.x,
                  zIndex: 2000,
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