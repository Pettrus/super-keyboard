import { useEffect } from "react";
import { register } from '@tauri-apps/plugin-global-shortcut';
import { currentMonitor, getCurrentWindow, LogicalPosition, LogicalSize } from '@tauri-apps/api/window';
import "./App.css";
import { KeyGrid } from "./KeyGrid";

interface ShortcutType {
  shortcut: string;
  id: number;
  state: "Pressed" | "Released"
}

const keyShortCut = ['Y', 'U', 'I', 'O', 'P', 'H', 'J', 'K', 'L', 'Semicolon', 'N', 'M', 'Comma', 'Period', 'Slash', 'Q', 'W', 'E', 'R', 'T'];
const availableShortcuts = keyShortCut.map(k => 'Command+Shift+' + k);
const modifier = "shift+super+";

let holdingShortcut = false;
let firstKey: string | null = null;

function App() {
  useEffect(() => {
    async function initWindow() {
      const monitor = await currentMonitor();

      if (monitor) {
        await getCurrentWindow().setSize(new LogicalSize(monitor.size.width, monitor.size.height));
        await getCurrentWindow().setPosition(new LogicalPosition(0, 0))
        await getCurrentWindow().hide();
        await getCurrentWindow().setAlwaysOnTop(true);
      }
    }

    initWindow();

    register(['Command+Shift+A', ...availableShortcuts], async (shortCut: ShortcutType) => {
      if (shortCut.shortcut === modifier + 'KeyA') {
        if (shortCut.state === 'Pressed') {
          holdingShortcut = true;

          await getCurrentWindow().show();
        } else {
          holdingShortcut = false;
          firstKey = null;

          await getCurrentWindow().hide();
        }
      } else if (holdingShortcut && !firstKey && shortCut.state === 'Pressed') {
        firstKey = shortCut.shortcut;
      } else if (holdingShortcut && firstKey && shortCut.state === 'Pressed') {
        const firstLetter = firstKey.replace(modifier, '').replace('Key', '');
        const secondLetter = shortCut.shortcut.replace(modifier, '').replace('Key', '');
        const monitor = await currentMonitor();

        if (monitor) {
          const size = monitor.size;
          const columns = 5;
          const rows = 4;

          const firstIndex = keyShortCut.indexOf(firstLetter);
          const secondIndex = keyShortCut.indexOf(secondLetter);

          if (firstIndex !== -1 && secondIndex !== -1) {

            const screenCellWidth = size.width / columns;
            const screenCellHeight = size.height / rows;

            // FIRST GRID
            const firstColumn = firstIndex % columns;
            const firstRow = Math.floor(firstIndex / columns);

            const firstCellX = firstColumn * screenCellWidth;
            const firstCellY = firstRow * screenCellHeight;

            // SECOND GRID (inside first cell)
            const subCellWidth = screenCellWidth / columns;
            const subCellHeight = screenCellHeight / rows;

            const secondColumn = secondIndex % columns;
            const secondRow = Math.floor(secondIndex / columns);

            const centerX =
              firstCellX + (secondColumn + 0.5) * subCellWidth;

            const centerY =
              firstCellY + (secondRow + 0.5) * subCellHeight;

            await getCurrentWindow().setCursorPosition(
              new LogicalPosition(centerX, centerY)
            );

            firstKey = null;
          }
        }
      }
    });
  }, [])

  return (
    <main className="container">
      <div className="grid">
        <KeyGrid letter="Y" />
        <KeyGrid letter="U" />
        <KeyGrid letter="I" />
        <KeyGrid letter="O" />
        <KeyGrid letter="P" />

        <KeyGrid letter="H" />
        <KeyGrid letter="J" />
        <KeyGrid letter="K" />
        <KeyGrid letter="L" />
        <KeyGrid letter=":" />

        <KeyGrid letter="N" />
        <KeyGrid letter="M" />
        <KeyGrid letter="," />
        <KeyGrid letter="." />
        <KeyGrid letter="/" />

        <KeyGrid letter="Q" />
        <KeyGrid letter="W" />
        <KeyGrid letter="E" />
        <KeyGrid letter="R" />
        <KeyGrid letter="T" />
      </div>
    </main>
  );
}

export default App;
