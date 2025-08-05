"use client"

import { getJobsId, getProgress } from "@/functionalities/NNTrustBackendUtils";
import { Job } from "@/interfaces/NNInterfaces";
import { Badge, Flex, Group, Paper, Stack, Title, Text, Button } from "@mantine/core";
import { IconTrendingUp } from "@tabler/icons-react";
import { CheckCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import useStore from "@/store/nnTrustStore";
import Link from "next/link";

type JobStatusProps = {
    jobs: Job[];
    status: string;
};

export default function JobStatus({ jobs, status }: JobStatusProps) {
    const allJobs = useStore((state) => state.allJobs)
    const setAllJobs = useStore((state) => state.setAllJobs)


    function getJobDetails(id: number): Job | undefined {
        return jobs?.find(job => job.id === id);
    }

    const getJobProgress = async (id: number) => {
        const progressData = await getProgress(id); // { progress: number, is_over: boolean }

        const updatedJobs = allJobs.map(job => {
            if (job.id === id) {
                return {
                    ...job,
                    progress: progressData.progress,
                    is_over: progressData.is_over
                };
            }
            return job;
        });

        setAllJobs(updatedJobs);
    };

    const getJobResult = async (is: number) => {
        //// TODO
    }

    const handleReload = () => {
        window.location.reload();
    };

    return (<>
        <Paper
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{
                display: jobs?.length > 0 ? 'block' : 'none',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s ease',
                margin: "8px",
                maxWidth: '100%',
                width: '50%'
            }}
        >
            <Flex align="center" gap="xs" mt="xs" mb="md">
                <Title order={3} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
                    {status == "active" ? "Active Jobs" : "Completed Jobs"}
                </Title>
                {status == "active" ? (
                    <Button variant="transparent" onClick={handleReload}>
                        <RefreshCw size={20} style={{ color: '#868e96', marginTop: '2px' }} />
                    </Button>
                ) : (
                    <CheckCircle size={20} style={{ color: '#868e96', marginTop: '2px' }} />
                )}
            </Flex>

            <Stack gap="md">
                {jobs.map((job) => {
                    const jobDetails = getJobDetails(job.id)
                    return (
                        <Paper
                            key={jobDetails?.id}
                            p="md"
                            radius="sm"
                            withBorder
                            style={{
                                backgroundColor: '#fafafa',
                                border: '1px solid #e5e7eb',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Flex justify="space-between" align="center" wrap="wrap" gap="md">
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <Group gap="sm" mb="xs">
                                        <Badge
                                            variant="filled"
                                            style={{
                                                background: 'linear-gradient(135deg, #dc2626 0%, #000000 100%)',
                                                color: 'white'
                                            }}
                                        >
                                            Job #{jobDetails?.id}
                                        </Badge>
                                    </Group>

                                    <Text size="sm" c="dimmed" mb="4px">
                                        <strong>Dataset:</strong> {jobDetails?.dataset}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        <strong>Model:</strong> {jobDetails?.model}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        <strong>Last attack performed:</strong> {jobDetails?.last_attack_performed}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        <strong>Progress:</strong> {jobDetails?.progress}
                                    </Text>
                                </div>
                                {status == "active" ? (
                                    <Button
                                        leftSection={<IconTrendingUp size={16} />}
                                        onClick={() => getJobProgress(jobDetails?.id as number)}
                                        style={{
                                            background: 'linear-gradient(135deg, #000000 0%, #dc2626 100%)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 500,
                                            fontSize: '14px',
                                            padding: '8px 16px',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                            }
                                        }}
                                    >
                                        Get Progress
                                    </Button>
                                ) : (
                                    <Link href="/pages/nntrust/report">
                                        <Button
                                            leftSection={<IconTrendingUp size={16} />}
                                            onClick={() => getJobResult(jobDetails?.id as number)}
                                            style={{
                                                background: 'linear-gradient(135deg, #000000 0%, #dc2626 100%)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontWeight: 500,
                                                fontSize: '14px',
                                                padding: '8px 16px',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                                }
                                            }}
                                        >
                                            Get Results
                                        </Button>
                                    </Link>)}

                            </Flex>
                        </Paper>
                    );
                })}
            </Stack>
        </Paper>
    </>)
}