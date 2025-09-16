"use client"

import { CheckCircle, Database, File, FileX, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import styles from '../../styles/FileDropZone.module.css';

import DatasetsLoader from '@/functionalities/DatasetsLoader';
import { FileDropZoneProps } from '@/interfaces/NNInterfaces';
import useStore from '@/store/dsStore';
import { Loader, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import DatasetBT from '../server/DatasetBT';
import ZipUploader from "./Uploader";
import SelectionButton from './utils/SelectionButtons';
import ModelUploader from './ModelUploader';

const FileDropZone: React.FC<FileDropZoneProps> = ( {
  title,
  Icon,
  onFileSelect,
  acceptedTypes,
  description,
  isLoaded,
  loadedFileName,
} ) =>
{


  const datasets = useStore( ( state ) => ( state.datasets ) );
  const setDatasets = useStore( ( state ) => state.setDatasets )
  const [ isLoading, setIsLoading ] = useState<boolean>( false )
  const [ opened, { open, close } ] = useDisclosure( false );

  useEffect( () =>
  {
    setIsLoading( true )
    DatasetsLoader().then( fetchedData =>
    {
      setDatasets( fetchedData );
    } ).finally( () =>
    {
      setIsLoading( false )
    } );
  }, [] );


  console.log( "Server Response:", datasets )
  const query = useStore( ( state ) => ( state.queryDataset ) );

  const [ isDragOver, setIsDragOver ] = useState( false );
  const [ isError, setIsError ] = useState( false );

  const handleDragOver = useCallback( ( e: React.DragEvent ) =>
  {
    e.preventDefault();
    setIsDragOver( true );
  }, [] );

  const handleDragLeave = useCallback( ( e: React.DragEvent ) =>
  {
    e.preventDefault();
    setIsDragOver( false );
  }, [] );

  const validateFile = ( file: File ) =>
  {
    const extension = '.' + file.name.split( '.' ).pop()?.toLowerCase();
    return acceptedTypes.includes( extension );
  };

  const handleDrop = useCallback( ( e: React.DragEvent ) =>
  {
    e.preventDefault();
    setIsDragOver( false );
    setIsError( false );

    const files = Array.from( e.dataTransfer.files );
    if ( files.length > 0 ) {
      const file = files[ 0 ];
      if ( validateFile( file ) ) {
        onFileSelect( file );
      } else {
        setIsError( true );
        setTimeout( () => setIsError( false ), 3000 );
      }
    }
  }, [ onFileSelect, acceptedTypes ] );

  const handleClickInput = ( ( e: React.MouseEvent ) =>
  {
    const inputFile = document.getElementById( `file-${title.toLowerCase()}` )
    inputFile?.click()
  } )
  const getDropZoneClasses = () =>
  {
    // Changing the class 
    if ( isError ) {
      return styles.dropzone_error;
    }
    else {
      if ( isLoaded ) {
        return styles.loaded;
      }
      else if ( isDragOver ) {
        return styles.dragOvver;
      }
      else {
        return styles.dropzone;
      }
    }
  };
  const [ selection, setSelection ] = useState<"selection" | "repository">( "selection" )

  const btns = [
    {
      id: "selection",
      name: "Select Dataset",
      Icon: File,
      currentPage: selection,
      onClickHandle: () => setSelection( "selection" ),
    },
    {
      id: 'repository',
      name: "Dataset Repository",
      Icon: Database,
      currentPage: selection,
      onClickHandle: () => setSelection( "repository" ),
    }
  ]

  const renderLoadingPage = () =>
  {

    switch ( selection ) {
      case 'selection':
        // this is the case where the selected element is the drag and drop element
        return (
          <>
          
            <div
              className={ getDropZoneClasses() }
            >
              {/*
              <div
                onClick={ handleClickInput }
                onDragOver={ handleDragOver }
                onDragLeave={ handleDragLeave }
                onDrop={ handleDrop }
              >
                <input
                  type="file"
                  id={ `file-${title.toLowerCase()}` }
                  accept={ acceptedTypes.join( ',' ) }
                  className={ styles.inputFile }
                />

                <div className={ styles.dropzone_content }>
                  { isLoaded ? (
                    <CheckCircle className={ styles.dropzone_icon } />
                  ) : isError ? (
                    <FileX className={ styles.dropzone_icon } />
                  ) : (
                    <Upload className={ styles.dropzone_icon } />
                  ) }

                  <div>
                    <div className={ styles.dropzone_title }>
                      <Icon />
                      <h3 >{ title }</h3>
                    </div>

                    <p className={ styles.dropzone_description }>{ description }</p>
                    { isLoaded && loadedFileName && (
                      <p className={ styles.dropzone_filename }>
                        ✓ { loadedFileName }
                      </p>
                    ) }
                    { !isLoaded && !isError && (
                      <p className={ styles.dropzone_accepted }>
                        Accepted: { acceptedTypes.join( ', ' ) }
                      </p>
                    ) }
                  </div>
                </div>
              </div>
              */}

              { title === "Dataset" ? <ZipUploader />  : <ModelUploader /> }
            </div>

          </>

        );
      case 'repository':
        return (
          <div className={ styles.repositoryContainer }>
            { isLoading ? (
              <div className={ styles.flexLoading }>
                <Text>Loading...</Text>
                <Loader />
              </div>
            ) : (
              <DatasetBT query={ query } datasets={ datasets } />
            ) }
          </div>
        );
      default:
        return null;
    }
  }
  return (
    <div className={ styles.containerDropzone }>
      <div className={ styles.buttons }>
        { btns.map( ( btnprop ) =>
          <SelectionButton key={ btnprop.id } { ...btnprop } /> ) }
      </div>
      { renderLoadingPage() }
    </div>
  );
}

export default FileDropZone