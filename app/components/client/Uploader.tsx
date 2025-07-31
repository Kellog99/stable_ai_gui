import DatasetsLoader from '@/functionalities/DatasetsLoader';
import { upload_post } from '@/properties/urls';
import useStore from '@/store/dsStore';
import
{
  Alert,
  Button,
  Center,
  Container,
  Divider,
  FileInput,
  Group,
  Paper,
  Progress,
  Select,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import
{
  IconCheck,
  IconCloudUpload,
  IconFileText,
  IconFileZip,
  IconSettings,
  IconUpload,
  IconX
} from '@tabler/icons-react';
import { useState } from 'react';

const ZipUploadComponent = () =>
{
  const [ file, setFile ] = useState<File | null>( null );
  const [ jsonFile, setJsonFile ] = useState<File | null>( null );
  const [ mode, setMode ] = useState<string>( '' ); // or a union type if limited values: useState<'edit' | 'view' | ''>('')
  const [ type, setType ] = useState<string>( '' ); // or a union type if limited values: useState<'image' | 'text' | ''>('')
  const [ description, setDescription ] = useState<string>( '' );
  const [ labelDict, setLabelDict ] = useState<Record<string, string>>( {} );
  const [ message, setMessage ] = useState<string>( '' );
  const [ loading, setLoading ] = useState<boolean>( false );
  const setDatasets = useStore( ( state ) => state.setDatasets )
  const [ uploadStatus, setUploadStatus ] = useState<string | null>( null ); // 'success', 'error', null
  const [ arrowAv, setArrowAv ] = useState<boolean>( true ); // Default to true, can be changed by user

  const handleJsonFileChange = async ( selectedFile: File ) =>
  {
    if ( !selectedFile ) {
      setJsonFile( null );
      setDescription( '' );
      setLabelDict( {} );
      return;
    } else if ( selectedFile.type !== 'application/json' && !selectedFile.name.endsWith( '.json' ) ) {
      setMessage( 'Please select a .json file.' );
      setUploadStatus( 'error' );
      return;
    }

    setJsonFile( selectedFile );

    try {
      const text = await selectedFile.text();
      const jsonData = JSON.parse( text );

      if ( jsonData.description ) {
        setDescription( jsonData.description );
      }

      if ( jsonData.label_dict ) {
        setLabelDict( jsonData.label_dict );
      }

      setMessage( `JSON file loaded: ${selectedFile.name}` );
      setUploadStatus( null );
    } catch ( error ) {
      setMessage( `Error reading JSON file: ${error}` );
      setUploadStatus( 'error' );
    }
  };

  const handleFileChange = async ( selectedFile: File ) =>
  {
    console.log( "Selected file:", selectedFile );
    if ( !selectedFile ) {
      setMessage( 'No file selected.' );
      setUploadStatus( null );
      return;
    }

    if ( selectedFile.type !== 'application/zip' && !selectedFile.name.endsWith( '.zip' ) ) {
      setMessage( 'Please select a .zip file.' );
      setUploadStatus( 'error' );
      return;
    }

    setFile( selectedFile );
    setMessage( `Selected file: ${selectedFile.name}. Ready to upload.` );
    setUploadStatus( null );
  };

  const handleUpload = async () =>
  {
    if ( !file ) {
      setMessage( 'Please select a zip file first.' );
      setUploadStatus( 'error' );
      return;
    }

    setMessage( `Uploading ${file.name}...` );
    setLoading( true );
    setUploadStatus( null );

    const formData = new FormData();
    formData.append( 'folder_zip', file );

    // Build query parameters
    const queryParams = new URLSearchParams();

    if ( description ) {
      queryParams.append( 'description', description );
    }

    if ( Object.keys( labelDict ).length > 0 ) {
      queryParams.append( 'label_dict', JSON.stringify( labelDict ) );
    }

    if ( mode ) {
      queryParams.append( 'mode', mode );
    }
    if ( type ) {
      queryParams.append( 'type', type );
    }

    const uploadUrl = queryParams.toString() ?
      `${upload_post}?${queryParams.toString()}` :
      upload_post;

    try {
      const response = await fetch( uploadUrl, {
        method: 'POST',
        body: formData,
      } );

      if ( response.ok ) {
        const data = await response.json();
        setMessage( `Upload successful: ${data.message}` );
        setUploadStatus( 'success' );
      } else {
        setMessage( `Upload failed: ${response.statusText}` );
        setUploadStatus( 'error' );
      }
    } catch ( error ) {
      console.error( 'Error uploading:', error );
      setMessage( `An error occurred: ${error}` );
      setUploadStatus( 'error' );
    } finally {
      DatasetsLoader().then( fetchedData =>
      {
        setDatasets( fetchedData );
      } )
      setLoading( false );
    }
  };

  const getStatusColor = () =>
  {
    if ( uploadStatus === 'success' ) return 'green';
    if ( uploadStatus === 'error' ) return 'red';
    return 'red';
  };

  const getStatusIcon = () =>
  {
    if ( uploadStatus === 'success' ) return <IconCheck size={ 20 } />;
    if ( uploadStatus === 'error' ) return <IconX size={ 20 } />;
    return <IconUpload size={ 20 } />;
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Stack gap="lg">
          <Center>
            <ThemeIcon size={ 60 } radius="xl" variant="light" color="red">
              <IconFileZip size={ 30 } />
            </ThemeIcon>
          </Center>

          <Center>
            <Title order={ 2 } ta="center" c="dark">
              Upload Zip File
            </Title>
          </Center>

          <Text size="sm" c="dimmed" ta="center">
            Select a .zip file from your computer to upload
          </Text>

          <FileInput
            label="Choose zip file"
            placeholder="Click to select file"
            accept=".zip,application/zip"
            value={ file }
            onChange={ ( file ) => handleFileChange( file as File ) }
            leftSection={ <IconFileZip size={ 14 } /> }
            clearable
            size="md"
            required
          />

          <Switch
            defaultChecked
            color="gray"
            label="Arrow available"
            onChange={ ( e ) => setArrowAv( e.currentTarget.checked ) }
          />

          { !arrowAv && (
            <>
              <Select
                label="Processing Mode"
                placeholder="Select processing mode"
                value={ mode }
                onChange={ ( mode ) => setMode( mode as string ) }
                data={ [
                  { value: 'single_feature', label: 'Single Feature' },
                  { value: 'classification', label: 'Classification' },
                  { value: 'object detection', label: 'Object Detection' },
                ] }
                leftSection={ <IconSettings size={ 14 } /> }
                clearable
                size="md"
                required
              />

              { mode != "object detection" && mode != ""?

                <Select
                  label="Type of the main feature"
                  placeholder="Select type"
                  value={ type }
                  onChange={ ( type ) => setType( type as string ) }
                  data={ [
                    { value: 'image', label: 'Image' },
                    { value: 'text', label: 'Text' },
                  ] }
                  leftSection={ <IconSettings size={ 14 } /> }
                  clearable
                  size="md"
                  required
                /> : null }

            </>
          ) }

          <Divider label="Optional Configuration" labelPosition="center" />

          <FileInput
            label="Configuration JSON file (optional)"
            placeholder="Click to select JSON file"
            accept=".json,application/json"
            value={ jsonFile }
            onChange={ ( jsonFile ) => handleJsonFileChange( jsonFile as File ) }
            leftSection={ <IconFileText size={ 14 } /> }
            clearable
            size="md"
            description="Upload a JSON file containing description and label_dict"
          />



          { file && (
            <Alert
              icon={ <IconFileZip size={ 16 } /> }
              title="File Selected"
              color="blue"
              variant="light"
            >
              <Text size="sm" fw={ 500 }>
                { file.name }
              </Text>
              <Text size="xs" c="dimmed">
                Size: { ( file.size / 1024 / 1024 ).toFixed( 2 ) } MB
              </Text>
            </Alert>
          ) }

          { loading && (
            <Stack gap="xs">
              <Progress value={ 100 } animated color="red" />
              <Text size="sm" c="dimmed" ta="center">
                Uploading file...
              </Text>
            </Stack>
          ) }

          { message && !loading && (
            <Alert
              icon={ getStatusIcon() }
              title={ uploadStatus === 'success' ? 'Success' : uploadStatus === 'error' ? 'Error' : 'Info' }
              color={ getStatusColor() }
              variant="light"
            >
              { message }
            </Alert>
          ) }

          <Group justify="center" mt="md">
            <Button
              leftSection={ <IconCloudUpload size={ 16 } /> }
              onClick={ handleUpload }
              loading={ loading }
              disabled={ !file || loading }
              size="md"
              variant="filled"
              
            >
              { loading ? 'Uploading...' : 'Upload File' }
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ZipUploadComponent;