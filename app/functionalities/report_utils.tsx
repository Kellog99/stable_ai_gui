
export const sanitizePath = (value: string): string => {
    const normalized = value.replace(/\\/g, '/');
    const repositoryIndex = normalized.lastIndexOf('/model_repository/');
    if (repositoryIndex >= 0) return normalized.slice(repositoryIndex + 1);

    const parts = normalized.split('/').filter(Boolean);
    return parts.slice(-2).join('/');
};
