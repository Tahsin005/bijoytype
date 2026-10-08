import { KEYBOARD_ROWS } from '../engine/layoutData.js';
import { Keycap } from './Keycap.jsx';

export function Keyboard({ layer, pressedKeys, targetCode, modifierCodes = [], onKeyClick }) {
  return (
    <div className="w-full glass-panel p-2.5 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col gap-1 md:gap-1.5 transition-all">
      {KEYBOARD_ROWS.map((row) => (
        <div key={row.id} className="flex gap-1 md:gap-1.5 w-full">
          {row.keys.map((k) => (
            <Keycap
              key={k.code}
              keyConfig={k}
              activeLayer={layer}
              isPressed={pressedKeys.has(k.code)}
              isTarget={targetCode === k.code}
              isModifierRequired={modifierCodes.includes(k.code)}
              onClick={onKeyClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
