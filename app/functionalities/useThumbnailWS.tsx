// useThumbnailWebSocket.ts
import { image_type } from "@/properties/types";
import { wsUrl } from "@/properties/urlsNNTrust";

import { useCallback, useEffect, useRef, useState } from "react";

export function useThumbnailWS ( featureType: string, featureData: string[] | string )
{
    const [ thumbnails, setThumbnails ] = useState<Map<string, string>>( new Map() );
    const [ connectionStatus, setConnectionStatus ] = useState( "disconnected" );
    const requestedPaths = useRef<Set<string>>( new Set() );
    const wsRef = useRef<WebSocket | null>( null );

    // Normalize featureData to always be an array internally
    const normalizedData = Array.isArray( featureData ) ? featureData : [ featureData ];
    console.log( "connection status", connectionStatus )
    useEffect( () =>
    {
        if ( featureType !== image_type ) return;

        const ws = new WebSocket( wsUrl );
        console.log( "ws", ws )
        ws.binaryType = "arraybuffer";
        wsRef.current = ws;

        if ( ws.readyState === WebSocket.OPEN ) {
            console.log("already connected")
            setConnectionStatus( "connected" );
        } else {
            setConnectionStatus( "connecting" );
        }

        ws.onopen = () => setConnectionStatus( "connected" );
        ws.onerror = () => setConnectionStatus( "error" );
        ws.onclose = () => setConnectionStatus( "disconnected" );

        ws.onmessage = ( event ) =>
        {
            if ( event.data instanceof ArrayBuffer ) {
                const view = new DataView( event.data );
                const jsonLen = view.getUint32( 0 );
                const jsonText = new TextDecoder().decode( new Uint8Array( event.data, 4, jsonLen ) );
                const meta = JSON.parse( jsonText );
                const imageBytes = new Uint8Array( event.data, 4 + jsonLen );
                const blob = new Blob( [ imageBytes ], { type: meta.mime } );
                const url = URL.createObjectURL( blob );
                setThumbnails( ( prev ) => new Map( prev ).set( meta.path, url ) );
            } else {
                try {
                    const msg = JSON.parse( event.data );
                    if ( msg.type === "thumb_error" ) console.error( "Thumbnail error:", msg.path, msg.error );
                } catch {
                    console.warn( "Non-JSON message:", event.data );
                }
            }
        };

        return () => ws.close();
    }, [ ] );

    // Request multiple thumbnails
    const requestThumbnails = useCallback(
        ( visibleIndices: number[] ) =>
        {
            if ( !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN ) return;

            const pathsToSend = visibleIndices
                .map( ( i ) => normalizedData[ i ] )
                .filter( ( p ) => p && !requestedPaths.current.has( p ) );

            if ( pathsToSend.length === 0 ) return;

            pathsToSend.forEach( ( p ) => requestedPaths.current.add( p ) );
            wsRef.current.send( JSON.stringify( { type: "request_images", paths: pathsToSend } ) );
            console.log( `📩 Requested ${pathsToSend.length} thumbnails` );
        },
        [ normalizedData ]
    );

    // Request a single thumbnail
    const requestThumbnail = useCallback( ( path: string ) =>
    {
        if ( !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN ) return;
        if ( requestedPaths.current.has( path ) ) return;

        requestedPaths.current.add( path );
        wsRef.current.send( JSON.stringify( { type: "request_images", paths: [ path ] } ) );
        console.log( `📩 Requested thumbnail for ${path}` );
    }, [] );

    return { thumbnails, connectionStatus, requestThumbnails, requestThumbnail };
}
