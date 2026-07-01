async function uploadZip(
    hostname: string,
    port: string,
    repo_path: string,
    file: File | null
): Promise<void> {
    if (!file) return;

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`http://${hostname}:${port}/repository/upload?repo_path=${repo_path}`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Upload failed:', error instanceof Error ? error.message : error);
    }
}
export default uploadZip;