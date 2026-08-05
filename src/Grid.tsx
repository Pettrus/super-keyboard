import type { CSSProperties } from "react";
import { COLUMNS, KEYS, ROWS } from "./keys";

interface Props {
    /** Index of the cell picked by the first keystroke, or null while waiting for it. */
    selected: number | null;
}

/** Feeds the grid shape to CSS so the layout has a single source of truth. */
const gridShape = { "--columns": COLUMNS, "--rows": ROWS } as CSSProperties;

const SubGrid = () => (
    <div className="sub-grid">
        {KEYS.map((key) => (
            <div className="sub-cell" key={key.code}>
                {key.label}
            </div>
        ))}
    </div>
);

export const Grid = ({ selected }: Props) => (
    <div className="grid" style={gridShape}>
        {KEYS.map((key, index) => {
            const isSelected = index === selected;
            const className = ["cell", selected === null ? "" : isSelected ? "selected" : "dimmed"]
                .join(" ")
                .trim();

            return (
                <div className={className} key={key.code}>
                    {isSelected ? <SubGrid /> : key.label}
                </div>
            );
        })}
    </div>
);
