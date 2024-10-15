export enum Key {
  LEFT = 0,
  RIGHT,
  DOWN,
  UP,
  W,
  A,
  S,
  D,
  Q,
  R,
  SPACE,
  ESCAPE,
  ENTER,
  INVALID
}

export function keyCodeToKey(key: string): Key {
  switch (key) {
    case 'Down':
    case 'ArrowDown':
      return Key.DOWN;
    case 'Up':
    case 'ArrowUp':
      return Key.UP;
    case 'Right':
    case 'ArrowRight':
      return Key.RIGHT;
    case 'Left':
    case 'ArrowLeft':
      return Key.LEFT;
    case ' ':
    case 'Space':
      return Key.SPACE;
    case 'Escape':
      return Key.ESCAPE;
    case 'a':
    case 'A':
      return Key.A;
    case 's':
    case 'S':
      return Key.S;
    case 'd':
    case 'D':
      return Key.D;
    case 'w':
    case 'W':
      return Key.W;
    case 'r':
    case 'R':
      return Key.R;
    case 'q':
    case 'Q':
      return Key.Q;
    case 'Enter':
      return Key.ENTER;
    default:
      console.warn(`Unhandled key: ${key}.`);
      return Key.INVALID;
  }
}
