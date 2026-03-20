import { ServerConfig } from "@/interfaces/globalVariableInterface";

// Get the value of all the global variables that can be set
export async function getServerConfiguration(
    hostname: string,
    port: string
): Promise<ServerConfig> {
    const response = await fetch(`http://${hostname}:${port}/info/variables`);

    if (!response.ok) throw new Error('Failed to get the list of all the possible devices available for executing the attacks.');

    const globalVariables = await response.json();
    return globalVariables

}


// Get the list of all the possible devices
export async function getDevicesList(
    hostname: string,
    port: string
): Promise<string[]> {
    const response = await fetch(`http://${hostname}:${port}/info/devices`);

    if (!response.ok) throw new Error('Failed to get the list of all the possible devices available for executing the attacks.');

    const deviceList = await response.json();
    return deviceList

}

// validate the path
export async function validatePath(
    hostname: string,
    port: string,
    path: string
): Promise<boolean> {
    const response = await fetch(`http://${hostname}:${port}/info/path?path=${path}`);

    if (!response.ok) throw new Error(`Failed to validate the path ${path}`);

    const exists = await response.json();
    return exists
}

