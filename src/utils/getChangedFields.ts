export function getChangedFields<T extends object>(
    original: T,
    updated: T,
    alwaysInclude: (keyof T)[] = []
): Partial<T> {
    const changed: Partial<T> = {};
    for (const key in updated) {
        if (
            updated[key as keyof T] !== original[key as keyof T] || alwaysInclude.includes(key as keyof T)
        ) {
            changed[key as keyof T] = updated[key as keyof T];
        }

    }
    return changed;
}