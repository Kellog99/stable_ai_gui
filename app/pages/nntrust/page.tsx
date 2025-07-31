"use client";

import UploadModal from "@/components/client/UploadModal";
import { Button, Divider, Flex, Paper, Select, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUpload } from "@tabler/icons-react";
import { useState } from "react";

export default function NNtrustMainPage() {

  const [opened, { open, close }] = useDisclosure(false);
  const [model, setModel] = useState<string | null>("")
  const [dataset, setDataset] = useState<string | null>("")

  // quando ci sarà il servizio backend --> va chiamato quando sia model sia dataset sono stati selezionati.

  return (
    <>
      <Paper
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          border: '1px solid #e9ecef',
          transition: 'all 0.2s ease',
          margin: "8px",
          maxWidth: '600px',
          width: '100%'
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <Title order={2} style={{ color: '#1a1a1a', marginBottom: '5px', fontWeight: 700 }}>
            Benchmark Configuration
          </Title>

          <Text size="sm" c="dimmed" style={{ marginBottom: '8px' }}>
            Choose a model and a dataset among the options below for the security report.
          </Text>

          <div style={{
            width: '48px',
            height: '4px',
            background: 'linear-gradient(90deg, #dc2626 0%, #000000 100%)',
            borderRadius: '2px'
          }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Title order={3} style={{ color: '#1a1a1a', marginBottom: '8px', fontWeight: 600 }}>
            Model Selection
          </Title>

          <Text size="sm" c="dimmed" style={{ marginBottom: '12px' }}>
            Select a model or upload one
          </Text>
        </div>


        <Flex direction={{ base: 'column', sm: 'row' }} gap="lg" align="end" style={{ marginBottom: '32px' }}>
          <Select
            placeholder="Pick a model"
            data={['TensorFlow', 'PyTorch', 'Scikit-learn', 'XGBoost']}
            style={{ flex: 1 }}
            value={model}
            onChange={(value) => setModel(value as string)}
            clearable={true}
            styles={{
              label: {
                fontWeight: 600,
                color: '#374151',
                marginBottom: '8px'
              },
              input: {
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#dc2626'
                },
                '&:focus': {
                  borderColor: '#dc2626',
                  boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)'
                }
              },
              dropdown: {
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              },
              option: {
                padding: '12px 16px',
                '&:hover': {
                  backgroundColor: '#fef2f2',
                  color: '#dc2626'
                }
              }
            }}
          />

          <Button
            leftSection={<IconUpload size={18} />}
            onClick={open}
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #000000 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)'
              }
            }}
          >
            Upload Model
          </Button>
          <UploadModal opened={opened} close={close} />
        </Flex>

        <div style={{ marginBottom: '16px' }}>
          <Title order={3} style={{ color: '#1a1a1a', marginBottom: '8px', fontWeight: 600 }}>
            Dataset Selection
          </Title>
          <Text size="sm" c="dimmed">
            Select a dataset
          </Text>
        </div>

        <Flex direction={{ base: 'column', sm: 'row' }} gap="lg" align="end" style={{ marginBottom: '32px' }}>
          <Select
            placeholder="Pick a dataset"
            data={['MNIST', 'CIFAR-10', 'ImageNet', 'Custom Data']}
            style={{ flex: 1 }}
            value={dataset}
            onChange={(value) => setDataset(value as string)}
            clearable={true}
           
            styles={{
              label: {
                fontWeight: 600,
                color: '#374151',
                marginBottom: '8px'
              },
              input: {
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#dc2626'
                },
                '&:focus': {
                  borderColor: '#dc2626',
                  boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)'
                }
              },
              dropdown: {
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              },
              option: {
                padding: '12px 16px',
                '&:hover': {
                  backgroundColor: '#fef2f2',
                  color: '#dc2626'
                }
              }
            }}
          />
          <Button
            leftSection={<IconUpload size={18} />}
            onClick={open}
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #000000 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)'
              }
            }}
          >
            Upload Dataset
          </Button>
          <UploadModal opened={opened} close={close} />
        </Flex>



        <Divider style={{ marginBottom: '24px' }} />

        <Flex justify="flex-end" gap="xl">
          <Button
            variant="outline"
            onClick={() => { setModel(null); setDataset(null) }}
            style={{
              borderColor: '#d1d5db',
              color: '#6b7280',
              borderRadius: '8px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#f9fafb',
                borderColor: '#9ca3af'
              }
            }}
          >
            Reset
          </Button>
          <Button
            disabled={!dataset || !model}
            style={{
              background: 'linear-gradient(135deg, #000000 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            Launch
          </Button>
        </Flex>
      </Paper>

    </>

  )
}
