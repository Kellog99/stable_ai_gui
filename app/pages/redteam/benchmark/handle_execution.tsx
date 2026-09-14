import {RegisterObjectProps} from '@/interfaces/NNInterfaces';
import {DatasetInfo, ModelInfo} from "@/interfaces/homePageInterface";

interface HandleBenchmarkRequestParams {
    url: string;
    model: ModelInfo | null;
    dataset: DatasetInfo | null;
    attacks: RegisterObjectProps[];
    metrics: RegisterObjectProps[];
    isExecuting: boolean;
    setIsExecuting: (isExecuting: boolean) => void;
    setSelectedAttackList: (attacks: { [key: string]: RegisterObjectProps }) => void;
    selectedAttacks: { [key: string]: RegisterObjectProps };
    setBenchmarkId: (benchmarkId: string | number | null) => void;
    setIsClicked: (isClicked: boolean) => void;
}

function getErrorMessage(body: string, status: number): string {
    if (!body) return `HTTP error! status: ${status}`;

    try {
        const parsed = JSON.parse(body);
        const detail = parsed?.detail ?? parsed?.message ?? parsed?.error;
        return `HTTP error! status: ${status}: ${typeof detail === 'string' ? detail : body}`;
    } catch {
        return `HTTP error! status: ${status}: ${body}`;
    }
}

export function saveBodyToJson(
    body: unknown,
    filename = 'benchmark-request.json'
): void {
    const blob = new Blob([JSON.stringify(body, null, 2)], {type: 'application/json'});
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
}

export async function handleClick(
    {
        url,
        model,
        dataset,
        attacks,
        metrics,
        isExecuting,
        setIsExecuting,
        setSelectedAttackList,
        selectedAttacks,
        setBenchmarkId,
        setIsClicked,
    }: HandleBenchmarkRequestParams) {
    if (isExecuting || !model || !dataset || attacks.length === 0) return;

    setBenchmarkId(null);
    setIsExecuting(true);
    try {
        if (model || dataset) {
            const requestBody = {
                model,
                dataset,
                attacks,
                metrics
            };
            console.log("model = ", model)
            console.log("dataset = ", dataset)
            //saveBodyToJson(requestBody);

            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(requestBody),
            });

            const responseBody: string = await response.text();
            if (!response.ok) {
                throw new Error(getErrorMessage(responseBody, response.status));
            }
            console.log("id = ", responseBody)
            setSelectedAttackList(selectedAttacks);
            setBenchmarkId(responseBody);
            setIsClicked(true);
        }
    } catch (error) {
        console.error('Error starting benchmark:', error);
    } finally {
        setIsExecuting(false);
    }
}
