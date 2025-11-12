"use client"

import DatasetsLoader from '@/functionalities/DatasetsLoader';
import { upload_post } from '@/properties/urls';
import useStore from '@/store/dsStore';
import {
  Alert,
  Button,
  Center,
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
import {
  IconCheck,
  IconCloudUpload,
  IconFileText,
  IconFileZip,
  IconSettings,
  IconUpload,
  IconX,
  IconZip
} from '@tabler/icons-react';
import { useState } from 'react';
import styles from '../../styles/Uploader.module.css';
import { FileCheck } from 'lucide-react';
import React from 'react';
import { RgbaColor } from '@mantine/core/lib/components/ColorPicker/ColorPicker.types';
import { darkenColor } from '@/functionalities/Utils';

const ZipUploadComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [mode, setMode] = useState<string>(''); // or a union type if limited values: useState<'edit' | 'view' | ''>('')
  const [type, setType] = useState<string>(''); // or a union type if limited values: useState<'image' | 'text' | ''>('')
  const [description, setDescription] = useState<string>('');
  const [labelDict, setLabelDict] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const setDatasets = useStore((state) => state.setDatasets)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null); // 'success', 'error', null
  const [arrowAv, setArrowAv] = useState<boolean>(true); // Default to true, can be changed by user

  const handleJsonFileChange = async (selectedFile: File) => {
    if (!selectedFile) {
      setJsonFile(null);
      setDescription('');
      setLabelDict({});
      return;
    } else if (selectedFile.type !== 'application/json' && !selectedFile.name.endsWith('.json')) {
      setMessage('Please select a .json file.');
      setUploadStatus('error');
      return;
    }

    setJsonFile(selectedFile);

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
      setMessage(`Error reading JSON file: ${error}`);
      setUploadStatus('error');
    }
  };

  const handleFileChange = async (selectedFile: File) => {
    console.log("Selected file:", selectedFile);
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
    if (type) {
      queryParams.append('type', type);
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
        console.log("DATA FROM UPLOAD", data)
        setMessage(`Upload successful: ${data.message}`);
        setUploadStatus('success');
      } else {
        setMessage(`Upload failed: ${response.statusText}`);
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setMessage(`An error occurred: ${error}`);
      setUploadStatus('error');
    } finally {
      DatasetsLoader().then(fetchedData => {
        setDatasets(fetchedData);
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
  const darkColor = darkenColor(color, 40); // 40% darker

  return (

    <Stack gap="lg">
      <Center>
        <ThemeIcon size={60} radius="xl" variant="light" color="#1e293b">
          <IconUpload size={30} />
        </ThemeIcon>
      </Center>

      <Center>
        <Title order={2} ta="center" c="#1e293b">
          Upload Dataset
        </Title>
      </Center>

      <Divider my="xs" color='#1e293b' />

      <FileInput
        label="Choose zip file"
        labelProps={{ style: { color: "#1e293b" } }}
        placeholder="Click to select file"
        accept=".zip"
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
        description="Select a .zip file from your computer to upload"
        descriptionProps={{ style: { color: "#475569" } }}
      />

      <Switch
        defaultChecked
        color="#1e293b"
        label="Arrow available"
        styles={{ label: { color: "#1e293b" } }}
        onChange={(e) => setArrowAv(e.currentTarget.checked)}
      />

      {!arrowAv && (
        <>
          <Select
            label="Processing Mode"
            placeholder="Select processing mode"
            value={mode}
            onChange={(mode) => setMode(mode as string)}
            data={[
              { value: 'single_feature', label: 'Single Feature' },
              { value: 'classification', label: 'Classification' },
              { value: 'object detection', label: 'Object Detection' },
            ]}
            leftSection={<IconSettings size={14} />}
            clearable
            size="md"
            styles={{ label: { color: "#1e293b" } }}
            required
          />

          {mode != "object detection" && mode != "" ?

            <Select
              label="Type of the main feature"
              placeholder="Select type"
              value={type}
              onChange={(type) => setType(type as string)}
              data={[
                { value: 'image', label: 'Image' },
                { value: 'text', label: 'Text' },
              ]}
              leftSection={<IconSettings size={14} />}
              clearable
              size="md"
              styles={{ label: { color: "#1e293b" } }}
              required
            /> : null}

        </>
      )}

      <Divider label="Optional Configuration" labelPosition="center" color="#334155" styles={{ label: { color: "#334155" } }} />

      <FileInput
        label="Configuration JSON file (optional)"
        placeholder="Click to select JSON file"
        labelProps={{ style: { color: "#1e293b" } }}
        accept=".json,application/json"
        value={jsonFile}
        onChange={(jsonFile) => handleJsonFileChange(jsonFile as File)}
        leftSection={<IconFileText size={14} />}
        clearable
        size="md"
        description="Upload a JSON file containing description and label_dict"
        descriptionProps={{ style: { color: "#475569" } }}
      />

      {file && (
        <>
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
        </>
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
          variant="gradient"
          gradient={{ from: "#1e293b", to: "red", deg: 90 }}

        >
          {loading ? 'Uploading...' : 'Upload File'}
        </Button>
      </Group>
    </Stack>


  );
};

export default ZipUploadComponent;