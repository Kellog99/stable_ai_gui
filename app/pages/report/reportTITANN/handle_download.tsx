import {sanitizePath} from '@/functionalities/report_utils';
import {ModelReportProps} from '@/interfaces/reportInterfaces';

export interface HandleDownloadPDFInput {
    modelReport: ModelReportProps | null;
    hostname: string;
    port: string;
}

/**
 * Generates a PDF from the supplied model report and displays it in a new browser tab.
 * Paths in the report metadata are sanitized before the report is sent to the backend.
 *
 * @param input - Values required to generate the PDF.
 * @param input.modelReport - Report data to include in the generated PDF.
 * @param input.hostname - Hostname of the report-generation backend.
 * @param input.port - Port of the report-generation backend.
 */
export const handleDownloadPDF = async ({
    modelReport,
    hostname,
    port,
}: HandleDownloadPDFInput): Promise<void> => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.title = 'Loading PDF...';
        newWindow.document.body.innerHTML = 'Generating your PDF, please wait...';
    }

    try {
        const reportInfo = modelReport?.info as unknown as Record<string, unknown> | undefined;
        const sanitizedInfo = reportInfo && Object.fromEntries(
            Object.entries(reportInfo).map(([key, value]) => [
                key,
                ['repository', 'source_path', 'path'].includes(key) && typeof value === 'string'
                    ? sanitizePath(value)
                    : value,
            ]),
        );
        const exportReport = modelReport && sanitizedInfo
            ? {...modelReport, info: sanitizedInfo}
            : modelReport;

        const response = await fetch(`http://${hostname}:${port}/report/generate_pdf`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({report: exportReport, output_path: './out'}),
        });

        if (!response.ok) throw new Error('PDF generation failed');

        const pdfUrl = URL.createObjectURL(await response.blob());
        if (newWindow) {
            const doc = newWindow.document;
            doc.title = 'Adversarial Report';
            doc.body.innerHTML = '';
            doc.body.style.margin = '0';
            doc.body.style.height = '100vh';

            const iframe = doc.createElement('iframe');
            iframe.src = pdfUrl;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            doc.body.appendChild(iframe);
        }
    } catch (error) {
        console.error(error);
        if (newWindow) newWindow.document.body.innerHTML = 'Failed to load PDF. Please try again.';
    }
};
