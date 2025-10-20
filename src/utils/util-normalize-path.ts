export const normalizePath = (path: string) => {
    if (path.startsWith('/')) {
        return path.slice(1);
    }
    return path;
};
