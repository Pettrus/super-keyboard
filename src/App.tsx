import { useEffect } from "react";
import { register } from '@tauri-apps/plugin-global-shortcut';
import { currentMonitor, getCurrentWindow, LogicalPosition, LogicalSize } from '@tauri-apps/api/window';
import "./App.css";

interface ShortcutType {
  shortcut: string;
  id: number;
  state: "Pressed" | "Released"
}

const keyShortCut = ['Y', 'U', 'I', 'O', 'P', 'H', 'J', 'K', 'L', 'Semicolon', 'N', 'M', 'Comma', 'Period', 'Slash', 'Q', 'W', 'E', 'R', 'T'];
const availableShortcuts = keyShortCut.map(k => 'Command+Shift+' + k);
const modifier = "shift+super+";

let holdingShortcut = false

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

          await getCurrentWindow().hide();
        }
      } else if (holdingShortcut && shortCut.state === 'Released') {
        const letter = shortCut.shortcut.replace(modifier, '').replace('Key', '');
        const monitor = await currentMonitor();
        
        if (monitor) {
          const size = monitor.size;

          const index = keyShortCut.indexOf(letter);

          const columns = 5;
          const rows = 4;

          const column = index % columns;
          const row = Math.floor(index / columns);

          const cellWidth = size.width / columns;
          const cellHeight = size.height / rows;

          const centerX = (column + 0.5) * cellWidth;
          const centerY = (row + 0.5) * cellHeight;

          await getCurrentWindow().setCursorPosition(new LogicalPosition(centerX, centerY))
        }
      }
    });
  }, [])

  return (
    <main className="container">
      <div className="grid">
          <div className="grid-item">Y</div>
          <div className="grid-item">U</div>
          <div className="grid-item">I</div>
          <div className="grid-item">O</div>
          <div className="grid-item">P</div>

          <div className="grid-item">H</div>
          <div className="grid-item">J</div>
          <div className="grid-item">K</div>
          <div className="grid-item">L</div>
          <div className="grid-item">:</div>

          <div className="grid-item">N</div>
          <div className="grid-item">M</div>
          <div className="grid-item">,</div>
          <div className="grid-item">.</div>
          <div className="grid-item">/</div>

          <div className="grid-item">Q</div>
          <div className="grid-item">W</div>
          <div className="grid-item">E</div>
          <div className="grid-item">R</div>
          <div className="grid-item">T</div>
      </div>
    </main>
  );
}

export default App;
