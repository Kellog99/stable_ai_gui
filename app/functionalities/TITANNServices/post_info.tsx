import { ServerConfig } from "@/interfaces/globalVariableInterface";
import { ModelReportProps } from "@/interfaces/reportInterfaces";

// This function handles the update of the variables that can be shared.
export async function handleSave(cnf: ServerConfig | undefined) {
    if (!cnf) return

    try {
        const response = await fetch(`http://${cnf.host}:${cnf.port}/info/saveConfiguration`, {
            method: "POST",
            body: JSON.stringify({
                "new_config": cnf
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to save configuration: ${response.statusText}`)
        }

        const data = await response.json();
        console.log('Configuration saved:', data);

    } catch (err) {
        console.error('Save error:', err);
    }
}



// This function handles the uploading of a report
export async function uploadReport(
    hostname: string,
    port: string,
    file: ModelReportProps
) {
    console.log("file = ", file)


    const response = await fetch(`http://${hostname}:${port}/repository/upload`, {
        method: "POST",
        body: JSON.stringify(file),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    if (!response.ok) throw new Error('Failed to get NNTrust reports from the backend');
    const report = await response.json();
    return report
}

