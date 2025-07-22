"use client"

import { Button, Divider, LoadingOverlay, Modal, Text, Tooltip, Alert, Box, ScrollArea, Title, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import useStore from "@/store/dsStore";
import { report_post } from "@/properties/urls";
import PDFPreviewModal from "@/components/client/ReportModal";
import { LinesGraphClipboard } from "@vectopus/atlas-icons-react";
import { useDisclosure } from "@mantine/hooks";

export default function Report() {
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const datasetName = useStore((state) => state.datasetUsed?.name)
    const report = useStore((state) => state.report)

    const [reportOpen, { open, close }] = useDisclosure(false);




    return (
        <>
            <Flex direction="row" justify="space-between" pb="md">
                <Title>Report Brief</Title>
                <Flex direction="row" gap="sm">
                    <Button
                        radius="lg"
                        onClick={open}
                        disabled={report.length === 0}
                    >
                        Show PDF Preview
                    </Button>

                    <PDFPreviewModal opened={reportOpen} close={close} />
                    <Button
                        radius="lg">
                        Save PDF
                    </Button>
                </Flex>
            </Flex>
            <Divider/>
            <Text pt="md">Overview Dataset</Text>
        </>
    )
}