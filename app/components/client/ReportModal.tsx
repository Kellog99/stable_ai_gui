import { Button, Divider, LoadingOverlay, Modal, Text, Tooltip, Alert, Box, ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import { InfoCircle } from "@vectopus/atlas-icons-react";
import useStore from "@/store/dsStore";
import {report_post} from "@/properties/urls";
import { fetchExternalImage } from "next/dist/server/image-optimizer";

interface PDFPreviewModalProps {
    opened: boolean;
    close: () => void;
}

export default function PDFPreviewModal({ opened, close }: PDFPreviewModalProps) {
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const datasetName = useStore( ( state ) => state.datasetUsed?.name)
    const report = useStore((state) => state.report)
    const showOverview = useStore((state) => state.showOverview)
    
    const fetchPDFData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            
            const url = new URL(report_post);
            url.searchParams.append('datasetName', datasetName as string);
            url.searchParams.append('showOverview',  `${showOverview}`);
            const response = await fetch(url , {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify( report.map(item => item.results))
              } );
            if (!response.ok) {
                throw new Error('Failed to fetch PDF');
            }
            
            const data = await response.json();
            setPdfData(data); 
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPDFData()
    }, [opened])

    const downloadPDF = () => {
        if (!pdfData) return;
        
        // Convert base64 to blob
        const byteCharacters = atob(pdfData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleClose = () => {
        close();
        setPdfData(null);
        setError(null);
    };

    return (
        <Modal.Root
            opened={opened}
            onClose={handleClose}
            size="xl"
            radius="md"
            centered
            transitionProps={{ transition: 'fade', duration: 150, timingFunction: 'linear' }}
            styles={{
                header: {
                    borderBottom: '1px solid #ccc',
                    fontWeight: 'bold',
                    paddingBottom: 0,
                },
            }}
        >
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>
                        <span style={{ display: 'flex', alignItems: 'center', gap: "8px" }}>
                            <Text fw={600} c="black">PDF Preview</Text>
                            <Tooltip
                                multiline
                                w={220}
                                withArrow
                                transitionProps={{ duration: 200 }}
                                label="Preview and download the generated PDF document. Click 'Generate PDF' to fetch the document from the server."
                            >
                                <InfoCircle size={15} />
                            </Tooltip>
                        </span>
                    </Modal.Title>
                    <Modal.CloseButton />
                    <Divider my="md" />
                </Modal.Header>

                <Modal.Body>
                    <Box style={{ position: 'relative', minHeight: 400 }}>
                        <LoadingOverlay visible={loading} />
                        {/*
                        {!pdfData && !error && (
                            <Box style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                minHeight: 300,
                                gap: 16
                            }}>
                                <Text size="lg" c="dimmed">No PDF loaded</Text>
                                <Button onClick={fetchPDFData} disabled={loading}>
                                    Generate PDF
                                </Button>
                            </Box>
                        )}
                            */}

                        {error && (
                            <Alert color="red" title="Error" mb="md">
                                {error}
                                <Button 
                                    variant="light" 
                                    size="xs" 
                                    mt="xs" 
                                    onClick={fetchPDFData}
                                >
                                    Try Again
                                </Button>
                            </Alert>
                        )}

                        {pdfData && (
                            <Box>
                                <Box style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    marginBottom: 16 
                                }}>
                                    <Text size="sm" c="dimmed">PDF Preview</Text>
                                    <Button
                                        onClick={downloadPDF}
                                        variant="filled"
                                        size="sm"
                                    >
                                        Download PDF
                                    </Button>
                                </Box>
                                
                                <ScrollArea h={500} style={{ border: '1px solid #e0e0e0', borderRadius: 4 }}>
                                    <embed
                                        src={`data:application/pdf;base64,${pdfData}`}
                                        type="application/pdf"
                                        width="100%"
                                        height="500px"
                                        style={{ border: 'none' }}
                                    />
                                </ScrollArea>
                            </Box>
                        )}
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
}


