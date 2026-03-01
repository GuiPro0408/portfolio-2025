const RESPONSIVE_WIDTHS = [400, 800] as const;
const ORIGINAL_WIDTH_HINT = 1536;

export function buildSrcset(url: string | null | undefined): string | undefined {
    if (!url) {
        return undefined;
    }

    const trimmed = url.trim();

    if (
        trimmed === '' ||
        /^https?:\/\//i.test(trimmed) ||
        trimmed.startsWith('//') ||
        trimmed.startsWith('data:')
    ) {
        return undefined;
    }

    const queryOrHashIndex = trimmed.search(/[?#]/);
    const basePath =
        queryOrHashIndex === -1 ? trimmed : trimmed.slice(0, queryOrHashIndex);
    const suffix = queryOrHashIndex === -1 ? '' : trimmed.slice(queryOrHashIndex);

    if (!basePath.toLowerCase().endsWith('.webp')) {
        return undefined;
    }

    if (/-\d+w\.webp$/i.test(basePath)) {
        return undefined;
    }

    const noExtPath = basePath.replace(/\.webp$/i, '');
    const variantEntries = RESPONSIVE_WIDTHS.map(
        (width) => `${noExtPath}-${width}w.webp${suffix} ${width}w`,
    );

    return [...variantEntries, `${trimmed} ${ORIGINAL_WIDTH_HINT}w`].join(', ');
}