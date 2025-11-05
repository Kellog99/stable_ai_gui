import { getModels } from '@/functionalities/NNTrustBackendUtils';
import { darkenColor } from '@/functionalities/Utils';
import { model_upload } from '@/properties/urlsNNTrust';
import useStore from '@/store/nnTrustStore';
import {
  Alert,
  Button,
  Center,
  Container,
  Divider,
  FileInput,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import {
  IconCheck,
  IconCloudUpload,
  IconFileZip,
  IconUpload,
  IconX
} from '@tabler/icons-react';
import React from 'react';
import { useState } from 'react';

const ModelUploadComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null); // 'success', 'error', null
  const setModels = useStore((state) => state.setModels)

  const handleFileChange = async (selectedFile: File) => {
    console.log("Selected file:", selectedFile);
    if (!selectedFile) {
      setMessage('No file selected.');
      setUploadStatus(null);
      return;
    }

    if (!selectedFile.name.endsWith('.pth')) {
      setMessage('Please select a .pth file.');
      setUploadStatus('error');
      return;
    }

    setFile(selectedFile);
    setMessage(`Selected file: ${selectedFile.name}. Ready to upload.`);
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a .pth file first.');
      setUploadStatus('error');
      return;
    }

    setMessage(`Uploading ${file.name}...`);
    setLoading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(model_upload, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage(`Upload successful`);
        setUploadStatus('success');
      } else {
        const data = await response.json();
        setMessage(`Upload failed: ${data.message}`);
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setMessage(`An error occurred: ${error}`);
      setUploadStatus('error');
    } finally {
      getModels().then(fetchedData => {
        setModels(fetchedData.models);
      })
      setLoading(false);
    }
  };


  const getStatusColor = () => {
    if (uploadStatus === 'success') return '#81c498ff';
    if (uploadStatus === 'error') return '#FF6961';
    return '#6ca3b5ff';
  };

  const getStatusIcon = () => {
    if (uploadStatus === 'success') return <IconCheck size={20} />;
    if (uploadStatus === 'error') return <IconX size={20} />;
    return <IconUpload size={20} />;
  };

  const color = getStatusColor();
  const darkColor = darkenColor(color, 40);

  return (
    <Stack gap="lg">
      <Center>
        <ThemeIcon size={60} radius="xl" variant="light" color="#1e293b">
          <IconUpload size={30} />
        </ThemeIcon>
      </Center>

      <Center>
        <Title order={2} ta="center" c="#1e293b">
          Upload Model
        </Title>
      </Center>

      <Divider my="xs" color='#1e293b' />

      <FileInput
        label="Choose .pth file"
        labelProps={{ style: { color: "#1e293b" } }}
        placeholder="Click to select file"
        accept=".pth"
        value={file}
        onChange={(newFile) => {
          if (newFile === null) {
            setFile(null); // handle clearing separately
            setMessage("")
          } else {
            handleFileChange(newFile as File); // call the original function
          }
        }}
        leftSection={<IconFileZip size={14} />}
        clearable
        size="md"
        required
        description="Select a .pth file from your computer to upload"
        descriptionProps={{ style: { color: "#475569" } }}
      />
      {file && (
        <Alert
          icon={<IconFileZip size={16} color={darkenColor("green", 40)} />}
          title={<span style={{ color: darkenColor("green", 40) }}>File Selected</span>}
          color="#81c498ff"
          variant="filled"
        >
          <Text size="sm" fw={500}>
            <span style={{ color: darkenColor("green", 40) }}>{file.name}</span>
          </Text>
          <Text size="xs" c="dimmed">
            <span style={{ color: darkenColor("green", 40) }}>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
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
          icon={React.cloneElement(getStatusIcon(), { color: darkColor })}
          title={<span style={{ color: darkColor }}>{uploadStatus === 'success' ? 'Success' : uploadStatus === 'error' ? 'Error' : 'Info'}</span>}
          color={color}
          variant="filled"
        >
          <span style={{ color: darkColor }}>{message}</span>
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
        >
          {loading ? 'Uploading...' : 'Upload File'}
        </Button>
      </Group>
    </Stack>

  );
};

export default ModelUploadComponent;