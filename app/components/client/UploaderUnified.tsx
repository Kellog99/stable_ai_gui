import {
  Alert,
  Button,
  Center,
  Divider,
  FileInput,
  Group,
  Progress,
  Select,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import {

  IconCloudUpload,
  IconFileText,
  IconFileZip,
  IconSettings,
} from '@tabler/icons-react';
import { useState } from 'react';
import React from 'react';
import { darkenColor, getStatusColor, getStatusIcon } from '@/functionalities/Utils';
import { UploadConfig } from '@/interfaces/genericInterface';


interface FileUploadComponentProps {
  config: UploadConfig;
  onUploadComplete?: (success: boolean, data?: any) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ 
  config, 
  onUploadComplete 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [mode, setMode] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [labelDict, setLabelDict] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [arrowAv, setArrowAv] = useState<boolean>(true);

  const validateFile = (selectedFile: File): boolean => {
    const expectedExtension = `.${config.fileType}`;
    const expectedMimeType = config.fileType === 'zip' ? 'application/zip' : 'application/octet-stream';
    
    return selectedFile.name.endsWith(expectedExtension) || 
           (config.fileType === 'zip' && selectedFile.type === expectedMimeType);
  };

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
    
    if (!validateFile(selectedFile)) {
      setMessage(`Please select a ${config.accept} file.`);
      setUploadStatus('error');
      return;
    }
    
    setFile(selectedFile);
    setMessage(`Selected file: ${selectedFile.name}. Ready to upload.`);
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage(`Please select a ${config.fileType} file first.`);
      setUploadStatus('error');
      return;
    }
    
    setMessage(`Uploading ${file.name}...`);
    setLoading(true);
    setUploadStatus(null);
    
    const formData = new FormData();
    formData.append(config.formFieldName, file);
    
    const queryParams = new URLSearchParams();
    if (config.showJsonConfig) {
      if (description) {
        queryParams.append('description', description);
      }
      if (Object.keys(labelDict).length > 0) {
        queryParams.append('label_dict', JSON.stringify(labelDict));
      }
    }
    if (config.showModeSelect && mode) {
      queryParams.append('mode', mode);
    }
    if (config.showTypeSelect && type) {
      queryParams.append('type', type);
    }
    
    const uploadUrl = queryParams.toString() ?
      `${config.uploadEndpoint}?${queryParams.toString()}` :
      config.uploadEndpoint;
    
    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        if (config.fileType === 'pth') {
          setMessage(`Upload successful`);
        } else {
          const data = await response.json();
          setMessage(`Upload successful: ${data.message}`);
        }
        setUploadStatus('success');
        onUploadComplete?.(true);
      } else {
        if (config.fileType === 'pth') {
          const data = await response.json();
          setMessage(`Upload failed: ${data.message}`);
        } else {
          setMessage(`Upload failed: ${response.statusText}`);
        }
        setUploadStatus('error');
        onUploadComplete?.(false);
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setMessage(`An error occurred: ${error}`);
      setUploadStatus('error');
      onUploadComplete?.(false);
    } finally {
      if (config.refreshFunction && config.setRefreshData) {
        config.refreshFunction().then(fetchedData => {
          if (config.fileType === 'pth') {
            config.setRefreshData?.(fetchedData.names);
          } else {
            config.setRefreshData?.(fetchedData);
          }
        });
      }
      setLoading(false);
    }
  };

  const color = getStatusColor(uploadStatus as string);
  const darkColor = darkenColor(color, 40);

  return (
    <Stack gap="lg">
      <Center>
        <ThemeIcon size={60} radius="xl" variant="light" color="#1e293b">
          {config.icon}
        </ThemeIcon>
      </Center>
      
      <Center>
        <Title order={2} ta="center" c="#1e293b">
          {config.title}
        </Title>
      </Center>
      
      <Divider my="xs" color='#1e293b' />
      
      <FileInput
        label={`Choose ${config.fileType} file`}
        labelProps={{ style: { color: "#1e293b" } }}
        placeholder="Click to select file"
        accept={config.accept}
        value={file}
        onChange={(newFile) => {
          if (newFile === null) {
            setFile(null);
            setMessage("");
          } else {
            handleFileChange(newFile as File);
          }
        }}
        leftSection={config.fileType === 'zip' ? <IconFileZip size={14} /> : <IconFileText size={14} />}
        clearable
        size="md"
        required
        description={config.description}
        descriptionProps={{ style: { color: "#475569" } }}
      />

      {config.showArrowSwitch && (
        <Switch
          defaultChecked
          color="#1e293b"
          label="Arrow available"
          styles={{ label: { color: "#1e293b" } }}
          onChange={(e) => setArrowAv(e.currentTarget.checked)}
        />
      )}

      {config.showModeSelect && !arrowAv && (
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
      )}

      {config.showTypeSelect && mode !== "object detection" && mode !== "" && !arrowAv && (
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
        />
      )}
     
      {config.showJsonConfig && (
        <>
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
        </>
      )}
     
      {file && (
        <Alert
          icon={config.fileType === 'zip' ? <IconFileZip size={16} color={darkenColor("green", 40)} /> : <IconFileText size={16} color={darkenColor("green", 40)} />}
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
          icon={React.cloneElement(getStatusIcon(uploadStatus as string), { color: darkColor })}
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

export default FileUploadComponent;