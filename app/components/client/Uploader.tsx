import React, { useRef, useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Alert,
  Progress,
  Center,
  rem,
  FileInput,
  ThemeIcon,
  Notification,
  Select,
  Divider,
} from '@mantine/core';
import {
  IconUpload,
  IconFile,
  IconCheck,
  IconX,
  IconFileZip,
  IconCloudUpload,
  IconFileText,
  IconSettings,
} from '@tabler/icons-react';
import { upload_post } from '@/properties/urls';

const ZipUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);
  const [mode, setMode] = useState('');
  const [description, setDescription] = useState('');
  const [labelDict, setLabelDict] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null

  const handleJsonFileChange = async (selectedFile) => {
    if (!selectedFile) {
      setJsonFile(null);
      setDescription('');
      setLabelDict({});
      return;
    }

    if (selectedFile.type !== 'application/json' && !selectedFile.name.endsWith('.json')) {
      setMessage('Please select a .json file.');
      setUploadStatus('error');
      return;
    }

    setJsonFile(selectedFile);
    
    // Read and parse JSON file
    try {
      const text = await selectedFile.text();
      const jsonData = JSON.parse(text);
      
      if (jsonData.description) {
        setDescription(jsonData.description);
      }
      
      if (jsonData.label_dict) {
        setLabelDict(jsonData.label_dict);
      }
      
      setMessage(`JSON file loaded: ${selectedFile.name}`);
      setUploadStatus(null);
    } catch (error) {
      setMessage(`Error reading JSON file: ${error.message}`);
      setUploadStatus('error');
    }
  };
  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) {
      setMessage('No file selected.');
      setUploadStatus(null);
      return;
    }

    if (selectedFile.type !== 'application/zip' && !selectedFile.name.endsWith('.zip')) {
      setMessage('Please select a .zip file.');
      setUploadStatus('error');
      return;
    }

    setFile(selectedFile);
    setMessage(`Selected file: ${selectedFile.name}. Ready to upload.`);
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a zip file first.');
      setUploadStatus('error');
      return;
    }

    setMessage(`Uploading ${file.name}...`);
    setLoading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('folder_zip', file);

    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (description) {
      queryParams.append('description', description);
    }
    
    if (Object.keys(labelDict).length > 0) {
      queryParams.append('label_dict', JSON.stringify(labelDict));
    }
    
    if (mode) {
      queryParams.append('mode', mode);
    }

    const uploadUrl = queryParams.toString() ? 
      `${upload_post}?${queryParams.toString()}` : 
      upload_post;

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Upload successful: ${data.message}`);
        setUploadStatus('success');
      } else {
        setMessage(`Upload failed: ${response.statusText}`);
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setMessage(`An error occurred: ${error.message}`);
      setUploadStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (uploadStatus === 'success') return 'red';
    if (uploadStatus === 'error') return 'red';
    return 'red';
  };

  const getStatusIcon = () => {
    if (uploadStatus === 'success') return <IconCheck size={20} />;
    if (uploadStatus === 'error') return <IconX size={20} />;
    return <IconUpload size={20} />;
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Stack gap="lg">
          <Center>
            <ThemeIcon size={60} radius="xl" variant="light" color="red">
              <IconFileZip size={30} />
            </ThemeIcon>
          </Center>

          <Center>
            <Title order={2} ta="center" c="dark">
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
            value={file}
            onChange={handleFileChange}
            leftSection={<IconFileZip size={14} />}
            clearable
            size="md"
            required
          />

          <Divider label="Optional Configuration" labelPosition="center" />

          <FileInput
            label="Configuration JSON file (optional)"
            placeholder="Click to select JSON file"
            accept=".json,application/json"
            value={jsonFile}
            onChange={handleJsonFileChange}
            leftSection={<IconFileText size={14} />}
            clearable
            size="md"
            description="Upload a JSON file containing description and label_dict"
          />

          <Select
            label="Processing Mode (optional)"
            placeholder="Select processing mode"
            value={mode}
            onChange={setMode}
            data={[
              { value: 'single_feature', label: 'Single Feature' },
              { value: 'classification', label: 'Classification' },
              { value: 'object_detection', label: 'Object Detection' },
            ]}
            leftSection={<IconSettings size={14} />}
            clearable
            size="md"
          />

          {file && (
            <Alert
              icon={<IconFileZip size={16} />}
              title="File Selected"
              color="blue"
              variant="light"
            >
              <Text size="sm" fw={500}>
                {file.name}
              </Text>
              <Text size="xs" c="dimmed">
                Size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </Alert>
          )}

          {loading && (
            <Stack gap="xs">
              <Progress value={100} animated color="red" />
              <Text size="sm" c="dimmed" ta="center">
                Uploading file...
              </Text>
            </Stack>
          )}

          {message && !loading && (
            <Alert
              icon={getStatusIcon()}
              title={uploadStatus === 'success' ? 'Success' : uploadStatus === 'error' ? 'Error' : 'Info'}
              color={getStatusColor()}
              variant="light"
            >
              {message}
            </Alert>
          )}

          <Group justify="center" mt="md">
            <Button
              leftSection={<IconCloudUpload size={16} />}
              onClick={handleUpload}
              loading={loading}
              disabled={!file || loading}
              size="md"
              variant="filled"
              color="red"
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ZipUploadComponent;