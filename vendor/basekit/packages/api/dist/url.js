/** Joins a base URL and path, tolerating slashes on either side. */
export const joinUrl = (baseUrl, path) => {
    if (/^https?:\/\//i.test(path))
        return path;
    return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};
/** Serialises query params; arrays repeat the key, nullish values are skipped. */
export const buildQueryString = (query) => {
    if (!query)
        return "";
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null)
            continue;
        if (Array.isArray(value)) {
            for (const item of value) {
                if (item !== undefined && item !== null)
                    search.append(key, String(item));
            }
        }
        else {
            search.append(key, String(value));
        }
    }
    const str = search.toString();
    return str ? `?${str}` : "";
};
//# sourceMappingURL=url.js.map