interface BytesToReadableOptions {
    decimals?: number,
}

export function bytesToReadable(bytes: number, options?: BytesToReadableOptions) {

    const { format } = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: options?.decimals ?? 2,
        useGrouping: false
    });

    const kb = 1024, mb = kb * kb, gb = mb * kb;

    if (bytes < kb) return `1 KB`;
    if (bytes < mb) return `${format(bytes / kb)} KB`;
    if (bytes < gb) return `${format(bytes / mb)} MB`;
    return `${format(bytes / gb)} GB`;

}