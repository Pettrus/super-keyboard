interface Props {
    letter: string;
}

const SubGridItem = () => (
    <div className="sub-grid-item">
        <div>Y</div>
        <div>U</div>
        <div>I</div>
        <div>O</div>
        <div>P</div>

        <div>H</div>
        <div>J</div>
        <div>K</div>
        <div>L</div>
        <div>:</div>

        <div>N</div>
        <div>M</div>
        <div>,</div>
        <div>.</div>
        <div>/</div>

        <div>Q</div>
        <div>W</div>
        <div>E</div>
        <div>R</div>
        <div>T</div>
    </div>
)

export const KeyGrid = ({ letter }: Props) => {
    return (
        <div className="grid-item">
            <SubGridItem />
            <div style={{zIndex:99}}>{letter}</div>
        </div>
    )
}