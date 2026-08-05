import { useEffect, useRef, useState } from "react";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import {
  cursorPosition,
  getCurrentWindow,
  monitorFromPoint,
  PhysicalPosition,
  PhysicalSize,
  primaryMonitor,
  type Monitor,
} from "@tauri-apps/api/window";
import "./App.css";
import { Grid } from "./Grid";
import { cellOf, COLUMNS, indexOfCode, ROWS } from "./keys";

/**
 * The only shortcut claimed globally. Once the overlay is up its keys are read
 * straight from the webview, so the grid keys stay available to every other app.
 */
const ACTIVATION_SHORTCUT = "CommandOrControl+Shift+A";

/**
 * "hold": the overlay is visible for as long as the shortcut is held down.
 * "toggle": the shortcut opens the overlay, and closes it if it is already open.
 */
const ACTIVATION_MODE: "hold" | "toggle" = "hold";

/** The monitor the pointer currently sits on, which is the one to cover. */
async function activeMonitor(): Promise<Monitor | null> {
  const cursor = await cursorPosition();
  return (await monitorFromPoint(cursor.x, cursor.y)) ?? (await primaryMonitor());
}

async function moveCursor(monitor: Monitor, firstIndex: number, secondIndex: number) {
  const cellWidth = monitor.size.width / COLUMNS;
  const cellHeight = monitor.size.height / ROWS;

  const first = cellOf(firstIndex);
  const second = cellOf(secondIndex);

  const x = first.column * cellWidth + ((second.column + 0.5) * cellWidth) / COLUMNS;
  const y = first.row * cellHeight + ((second.row + 0.5) * cellHeight) / ROWS;

  // setCursorPosition works in window coordinates, and the overlay covers the
  // monitor exactly, so monitor-relative pixels are already window coordinates.
  await getCurrentWindow().setCursorPosition(
    new PhysicalPosition(Math.round(x), Math.round(y)),
  );
}

function App() {
  const [visible, setVisible] = useState(false);
  const [firstIndex, setFirstIndex] = useState<number | null>(null);
  const monitorRef = useRef<Monitor | null>(null);

  useEffect(() => {
    const registration = register(ACTIVATION_SHORTCUT, (event) => {
      if (event.state === "Released") {
        if (ACTIVATION_MODE === "hold") setVisible(false);
        return;
      }
      setVisible((current) => (ACTIVATION_MODE === "toggle" ? !current : true));
    }).catch((error) => {
      console.error(`Could not register ${ACTIVATION_SHORTCUT}`, error);
    });

    return () => {
      void registration
        .then(() => unregister(ACTIVATION_SHORTCUT))
        .catch((error) => console.error(`Could not unregister ${ACTIVATION_SHORTCUT}`, error));
    };
  }, []);

  // Showing and hiding the window follows `visible` rather than the other way
  // around, so the overlay can never disagree with what is rendered.
  useEffect(() => {
    const overlay = getCurrentWindow();

    if (!visible) {
      setFirstIndex(null);
      void overlay.hide();
      return;
    }

    let cancelled = false;

    void (async () => {
      const monitor = await activeMonitor();
      monitorRef.current = monitor;

      if (cancelled) return;

      if (monitor) {
        // Monitor geometry is in physical pixels; using it as logical pixels
        // oversizes the window by the scale factor on HiDPI screens.
        await overlay.setPosition(new PhysicalPosition(monitor.position.x, monitor.position.y));
        await overlay.setSize(new PhysicalSize(monitor.size.width, monitor.size.height));
      }

      if (cancelled) return;

      await overlay.show();
      await overlay.setFocus();
    })();

    return () => {
      cancelled = true;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;
      event.preventDefault();

      if (event.code === "Escape") {
        setVisible(false);
        return;
      }

      const index = indexOfCode(event.code);
      if (index === -1) return;

      if (firstIndex === null) {
        setFirstIndex(index);
        return;
      }

      const monitor = monitorRef.current;
      if (!monitor) {
        setVisible(false);
        return;
      }

      void moveCursor(monitor, firstIndex, index)
        .catch((error) => console.error("Could not move the cursor", error))
        .finally(() => setVisible(false));
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, firstIndex]);

  return (
    <main className="container">
      <Grid selected={firstIndex} />
    </main>
  );
}

export default App;
