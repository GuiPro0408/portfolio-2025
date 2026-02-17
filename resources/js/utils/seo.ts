export function toAbsoluteUrl(value: string | null | undefined, baseUrl: string): string | null {
    if (!value || value.trim() === '') {
        return null;
    }

    try {
        return new URL(value).toString();
    } catch {
        try {
            return new URL(value, baseUrl).toString();
        } catch {
            return null;
        }
    }
}

export function resolveSocialImage(
    candidates: Array<string | null | undefined>,
    fallback: string | null | undefined,
    baseUrl: string,
): string | null {
    for (const candidate of candidates) {
        const absolute = toAbsoluteUrl(candidate, baseUrl);

        if (absolute) {
            return absolute;
        }
    }

    return toAbsoluteUrl(fallback, baseUrl);
}
