export function centsToEuro(cents: number | null | undefined): string {
    if (!cents) {
        return '-';
    }

    // Convert cents to euros
    const euros = cents / 100;

    // Format with German locale (uses comma as decimal separator and dot as thousands separator)
    return euros.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' €';
}


