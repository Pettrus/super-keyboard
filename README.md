# super-keyboard

Move the mouse pointer with the keyboard, in the spirit of [Mouseless](https://mouseless.app).

Hold `Cmd+Shift+A` and a grid covers the screen. The first key picks a cell, the
second key picks a sub-cell inside it, and the pointer jumps to its centre — 400
targets on screen, two keystrokes away. `Esc` closes the overlay without moving
anything.

Clicking is deliberately out of scope: the pointer lands where you asked, and
whatever sends your clicks (a keyboard firmware such as ZMK, for instance) does
the rest.

## How it works

Only `Cmd+Shift+A` is registered as a global shortcut. Everything else is read
from the overlay window itself once it has focus, so the grid keys stay
available to every other application.

Keys are matched on `KeyboardEvent.code`, so the grid follows the physical
layout rather than the characters your keymap produces. The layout lives in
[`src/keys.ts`](src/keys.ts) and drives the shortcuts, the rendering and the
CSS grid alike — change the list there and everything follows.

Hold-to-open can be swapped for press-to-toggle with `ACTIVATION_MODE` in
[`src/App.tsx`](src/App.tsx).

## Development

```sh
npm install
npm run tauri dev
```

macOS asks for Accessibility permission the first time, since global shortcuts
need it.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
