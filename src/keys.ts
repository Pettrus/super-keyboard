export const COLUMNS = 5;
export const ROWS = 4;

interface Key {
    /** `KeyboardEvent.code` of the physical key, so the grid is layout independent. */
    code: string;
    /** What is drawn in the cell. */
    label: string;
}

/** The grid keys in reading order: left to right, top to bottom. */
export const KEYS: Key[] = [
    { code: "KeyY", label: "Y" },
    { code: "KeyU", label: "U" },
    { code: "KeyI", label: "I" },
    { code: "KeyO", label: "O" },
    { code: "KeyP", label: "P" },

    { code: "KeyH", label: "H" },
    { code: "KeyJ", label: "J" },
    { code: "KeyK", label: "K" },
    { code: "KeyL", label: "L" },
    { code: "Semicolon", label: ";" },

    { code: "KeyN", label: "N" },
    { code: "KeyM", label: "M" },
    { code: "Comma", label: "," },
    { code: "Period", label: "." },
    { code: "Slash", label: "/" },

    { code: "KeyZ", label: "Z" },
    { code: "KeyX", label: "X" },
    { code: "KeyC", label: "C" },
    { code: "KeyV", label: "V" },
    { code: "KeyB", label: "B" },
];

if (KEYS.length !== COLUMNS * ROWS) {
    throw new Error(`KEYS has ${KEYS.length} entries but the grid holds ${COLUMNS * ROWS}`);
}

export function indexOfCode(code: string): number {
    return KEYS.findIndex((key) => key.code === code);
}

/** Column/row of a cell index within a COLUMNS x ROWS grid. */
export function cellOf(index: number): { column: number; row: number } {
    return { column: index % COLUMNS, row: Math.floor(index / COLUMNS) };
}
