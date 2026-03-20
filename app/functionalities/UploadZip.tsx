
async function uploadZip(
    hostname: string,
    port: string,
    repo_path: string,
    file: any
) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const body = formData;
        const response = await fetch(`http://${hostname}:${port}/repository/upload?repo_path=${repo_path}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Status:', response.status);
        const data: any = await response.json();
        console.log('Response:', data);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error('ERROR:', error);
    }
}
export default uploadZip;