"use client";

import JobsStatus from "@/components/client/JobsStatus";
import UploadModal from "@/components/client/UploadModal";
import { getDatasets, getJobsId, getModels, startNewJob } from "@/functionalities/NNTrustBackendUtils";
import { Job } from "@/interfaces/NNInterfaces";
import useStore from "@/store/nnTrustStore";
import { Badge, Button, Divider, Flex, Group, Paper, Select, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconTrendingUp, IconUpload } from "@tabler/icons-react";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";

interface ActiveJob {
  jobId: number,
  dataset: string,
  model: string,
}

export default function NNtrustMainPage() {

  const [opened, { open, close }] = useDisclosure(false);
  const [model, setModel] = useState<string | null>("")

  const models = useStore((state) => state.models)
  const setModels = useStore((state) => state.setModels)

  const datasets = useStore((state) => state.datasets)
  const setDatasets = useStore((state) => state.setDatasets)

  const allJobs = useStore((state) => state.allJobs)
  const setAllJobs = useStore((state) => state.setAllJobs)

  const [activeJobs, setActiveJobs] = useState<Job[]>([])
  const [terminatedJobs, setTerminatedJobs] = useState<Job[]>([])
  const [newJobStarted, setNewJobStarted] = useState<boolean>(false)

  const [dataset, setDataset] = useState<string | null>("")
  const [object, setObject] = useState<string | null>("")



  useEffect(() => {
    getDatasets().then(fetchedData => {
      setDatasets(fetchedData.names);
    })

    getModels().then(fetched =>
      setModels(fetched.names)
    )

    getJobsId().then(fetched => {
      const completedJobs = fetched.filter((job: Job) => job.is_over === true);
      const ongoingJobs = fetched.filter((job: Job) => job.is_over === false);
      setAllJobs(fetched);
      setActiveJobs(ongoingJobs)
      setTerminatedJobs(completedJobs)
    });

  }, [])

  useEffect(() => {
    
  }, [allJobs])

  console.log("all jobs", allJobs)


  const addNewJob = () => {
    getJobsId().then(fetched => {
      const completedJobs = fetched.filter((job: Job) => job.is_over === true);
      const ongoingJobs = fetched.filter((job: Job) => job.is_over === false);
      setAllJobs(fetched);
      setActiveJobs(ongoingJobs)
      setTerminatedJobs(completedJobs)
    });

    const jobConfig = {
      dataset: dataset,
      model: model
    };

    startNewJob(jobConfig).then(() => {
      setNewJobStarted(true);
      setTimeout(() => {
        setNewJobStarted(false);
      }, 3000);
    });

  }


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
          marginBottom: "16px",
          maxWidth: '100%',
          width: '100%'
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <Group gap="xs" align="center" mt="xs">
            <Title order={2} style={{ color: '#1a1a1a', marginBottom: '5px', fontWeight: 700 }}>
              Benchmark Configuration
            </Title>
            <Settings size={32} style={{ color: '#868e96' }} />
          </Group>

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

        <Flex direction="row" justify="space-between" align="end">

          <Group>
            <Flex direction={{ base: 'column', sm: 'row' }} gap="lg" align="end" style={{ marginBottom: '32px' }}>

              <Flex direction="column">
                <div style={{ marginBottom: '8px' }}>
                  <Title order={3} style={{ color: '#1a1a1a', marginBottom: '8px', fontWeight: 600 }}>
                    Model Selection
                  </Title>

                  <Text size="sm" c="dimmed" style={{ marginBottom: '12px' }}>
                    Select a model or upload one
                  </Text>
                </div>


                <Select
                  placeholder="Pick a model"
                  data={models as string[]}
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
                      width: "400px",
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
              </Flex>

              <Button
                leftSection={<IconUpload size={18} />}
                onClick={() => { open(); setObject("model") }}
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
              <UploadModal opened={opened} close={close} object={object as string} />

            </Flex>
          </Group>

          <Divider
            orientation="vertical"
            style={{
              height: '60px',
              transform: 'translateY(48px)' // Move divider down by the marginBottom amount
            }}
          />

          <Group>
            <Flex direction={{ base: 'column', sm: 'row' }} gap="lg" align="end" style={{ marginBottom: '32px' }}>
              <Flex direction="column">
                <div style={{ marginBottom: '16px' }}>
                  <Title order={3} style={{ color: '#1a1a1a', marginBottom: '8px', fontWeight: 600 }}>
                    Dataset Selection
                  </Title>
                  <Text size="sm" c="dimmed">
                    Select a dataset
                  </Text>
                </div>


                <Select
                  placeholder="Pick a dataset"
                  data={datasets as string[]}
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
                      width: "400px",
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
              </Flex>

              <Button
                leftSection={<IconUpload size={18} />}
                onClick={() => { open(); setObject("dataset") }}
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
              <UploadModal opened={opened} close={close} object={object as string} />
            </Flex>
          </Group>
        </Flex>

        <div style={{
          width: '200px',
          height: '4px',
          background: 'linear-gradient(90deg, #dc2626 0%, #000000 100%)',
          borderRadius: '2px',
          marginLeft: 'auto',
          marginBottom:"24px"
        }} />


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
          <Stack gap="md">
            <Button
              disabled={!dataset || !model}
              onClick={addNewJob}
              styles={{
                root: {
                  background: 'linear-gradient(135deg, #000000 0%, #dc2626 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                },
              }}
            >
              {newJobStarted ? "Launched" : "Launch"}
            </Button>

            {newJobStarted && (
              <Group gap="xs" align="center">
                <IconCheck color="#dc2626" size={20} />
                <Text fw={700} style={{ color: "#dc2626" }}>
                  A new job has started!
                </Text>
              </Group>
            )}
          </Stack>
        </Flex>
      </Paper>

      <Flex direction="row">
        <JobsStatus jobs={activeJobs} status="active" />
        <JobsStatus jobs={terminatedJobs} status="completed" />
      </Flex>
    </>

  )
}
