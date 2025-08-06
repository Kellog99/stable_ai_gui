import { getModels } from '@/functionalities/NNTrustBackendUtils';
import { model_upload } from '@/properties/urlsNNTrust';
import useStore from '@/store/nnTrustStore';
import
{
  Alert,
  Button,
  Center,
  Container,
  FileInput,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import
{
  IconCheck,
  IconCloudUpload,
  IconFileZip,
  IconUpload,
  IconX
} from '@tabler/icons-react';
import { useState } from 'react';

const ModelUploadComponent = () =>
{
  const [ file, setFile ] = useState<File | null>( null );
  const [ message, setMessage ] = useState<string>( '' );
  const [ loading, setLoading ] = useState<boolean>( false );
  const [ uploadStatus, setUploadStatus ] = useState<string | null>( null ); // 'success', 'error', null
  const setModels = useStore((state) => state.setModels)

  const handleFileChange = async ( selectedFile: File ) =>
  {
    console.log( "Selected file:", selectedFile );
    if ( !selectedFile ) {
      setMessage( 'No file selected.' );
      setUploadStatus( null );
      return;
    }

    if ( !selectedFile.name.endsWith( '.pth' ) ) {
      setMessage( 'Please select a .pth file.' );
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
      setMessage( 'Please select a .pth file first.' );
      setUploadStatus( 'error' );
      return;
    }

    setMessage( `Uploading ${file.name}...` );
    setLoading( true );
    setUploadStatus( null );

    const formData = new FormData();
    formData.append( 'file', file );

    try {
      const response = await fetch( model_upload, {
        method: 'POST',
        body: formData,
      } );

      if ( response.ok ) {
        setMessage( `Upload successful` );
        setUploadStatus( 'success' );
      } else {
        const data = await response.json();
        setMessage( `Upload failed: ${data.message}` );
        setUploadStatus( 'error' );
      }
    } catch ( error ) {
      console.error( 'Error uploading:', error );
      setMessage( `An error occurred: ${error}` );
      setUploadStatus( 'error' );
    } finally {
      getModels().then( fetchedData =>
      {
        setModels( fetchedData.names );
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
              Upload Model
            </Title>
          </Center>

          <Text size="sm" c="dimmed" ta="center">
            Select a .pth file from your computer to upload
          </Text>

          <FileInput
            label="Choose .pth file"
            placeholder="Click to select file"
            accept=".pth"
            value={ file }
            onChange={ ( file ) => handleFileChange( file as File ) }
            leftSection={ <IconFileZip size={ 14 } /> }
            clearable
            size="md"
            required
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

export default ModelUploadComponent;