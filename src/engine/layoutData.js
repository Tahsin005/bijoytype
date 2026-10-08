import rawLayout from '../data/bijoy-layout.json' with { type: 'json' };

export const FINGER_INFO = {
  LP: { name: 'Left Pinky', hand: 'left', color: '#ec4899', bgLight: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.6)' },
  LR: { name: 'Left Ring', hand: 'left', color: '#a855f7', bgLight: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.6)' },
  LM: { name: 'Left Middle', hand: 'left', color: '#3b82f6', bgLight: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.6)' },
  LI: { name: 'Left Index', hand: 'left', color: '#06b6d4', bgLight: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.6)' },
  RI: { name: 'Right Index', hand: 'right', color: '#10b981', bgLight: 'rgba(16, 185, 129, 0.15)', border: 'rgba(168, 185, 129, 0.6)' },
  RM: { name: 'Right Middle', hand: 'right', color: '#eab308', bgLight: 'rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.6)' },
  RR: { name: 'Right Ring', hand: 'right', color: '#f97316', bgLight: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.6)' },
  RP: { name: 'Right Pinky', hand: 'right', color: '#ef4444', bgLight: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.6)' },
  TH: { name: 'Thumb', hand: 'both', color: '#64748b', bgLight: 'rgba(100, 116, 139, 0.15)', border: 'rgba(100, 116, 139, 0.6)' },
};

export const KEYBOARD_ROWS = [
  {
    id: 'E',
    name: 'Number Row',
    keys: [
      { code: 'Backquote', width: 1.0 },
      { code: 'Digit1', width: 1.0 },
      { code: 'Digit2', width: 1.0 },
      { code: 'Digit3', width: 1.0 },
      { code: 'Digit4', width: 1.0 },
      { code: 'Digit5', width: 1.0 },
      { code: 'Digit6', width: 1.0 },
      { code: 'Digit7', width: 1.0 },
      { code: 'Digit8', width: 1.0 },
      { code: 'Digit9', width: 1.0 },
      { code: 'Digit0', width: 1.0 },
      { code: 'Minus', width: 1.0 },
      { code: 'Equal', width: 1.0 },
      { code: 'Backspace', width: 2.0, nonChar: true, label: 'Backspace', finger: 'RP' }
    ]
  },
  {
    id: 'D',
    name: 'Top Row',
    keys: [
      { code: 'Tab', width: 1.5, nonChar: true, label: 'Tab', finger: 'LP' },
      { code: 'KeyQ', width: 1.0 },
      { code: 'KeyW', width: 1.0 },
      { code: 'KeyE', width: 1.0 },
      { code: 'KeyR', width: 1.0 },
      { code: 'KeyT', width: 1.0 },
      { code: 'KeyY', width: 1.0 },
      { code: 'KeyU', width: 1.0 },
      { code: 'KeyI', width: 1.0 },
      { code: 'KeyO', width: 1.0 },
      { code: 'KeyP', width: 1.0 },
      { code: 'BracketLeft', width: 1.0 },
      { code: 'BracketRight', width: 1.0 },
      { code: 'Backslash', width: 1.5 }
    ]
  },
  {
    id: 'C',
    name: 'Home Row',
    keys: [
      { code: 'CapsLock', width: 1.75, nonChar: true, label: 'Caps Lock', finger: 'LP' },
      { code: 'KeyA', width: 1.0 },
      { code: 'KeyS', width: 1.0 },
      { code: 'KeyD', width: 1.0 },
      { code: 'KeyF', width: 1.0, bump: true },
      { code: 'KeyG', width: 1.0 },
      { code: 'KeyH', width: 1.0 },
      { code: 'KeyJ', width: 1.0, bump: true },
      { code: 'KeyK', width: 1.0 },
      { code: 'KeyL', width: 1.0 },
      { code: 'Semicolon', width: 1.0 },
      { code: 'Quote', width: 1.0 },
      { code: 'Enter', width: 2.25, nonChar: true, label: 'Enter', finger: 'RP' }
    ]
  },
  {
    id: 'B',
    name: 'Bottom Row',
    keys: [
      { code: 'ShiftLeft', width: 2.25, modifier: true, label: 'Shift', finger: 'LP' },
      { code: 'KeyZ', width: 1.0 },
      { code: 'KeyX', width: 1.0 },
      { code: 'KeyC', width: 1.0 },
      { code: 'KeyV', width: 1.0 },
      { code: 'KeyB', width: 1.0 },
      { code: 'KeyN', width: 1.0 },
      { code: 'KeyM', width: 1.0 },
      { code: 'Comma', width: 1.0 },
      { code: 'Period', width: 1.0 },
      { code: 'Slash', width: 1.0 },
      { code: 'ShiftRight', width: 2.75, modifier: true, label: 'Shift', finger: 'RP' }
    ]
  },
  {
    id: 'A',
    name: 'Space Row',
    keys: [
      { code: 'ControlLeft', width: 1.25, modifier: true, label: 'Ctrl', finger: 'LP' },
      { code: 'MetaLeft', width: 1.25, modifier: true, label: 'Win', finger: 'LP' },
      { code: 'AltLeft', width: 1.25, modifier: true, label: 'Alt', finger: 'LP' },
      { code: 'Space', width: 6.25, label: 'Space', finger: 'TH' },
      { code: 'AltRight', width: 1.25, modifier: true, label: 'AltGr', finger: 'TH' },
      { code: 'MetaRight', width: 1.25, modifier: true, label: 'Win', finger: 'RP' },
      { code: 'ContextMenu', width: 1.25, modifier: true, label: 'Menu', finger: 'RP' },
      { code: 'ControlRight', width: 1.25, modifier: true, label: 'Ctrl', finger: 'RP' }
    ]
  }
];

export const LEFT_HAND_CODES = new Set([
  'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5',
  'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT',
  'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG',
  'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB',
  'ControlLeft', 'MetaLeft', 'AltLeft'
]);

export function getRecommendedShiftKey(code) {
  if (LEFT_HAND_CODES.has(code)) {
    return 'ShiftRight';
  }
  return 'ShiftLeft';
}
function classifyCharacter(text, code, layer) {
  if (!text) return { kind: 'symbol', conf: 'C' };
  if (text === '\u200C') return { kind: 'joiner', conf: 'C' };
  if (code === 'KeyA' && layer === 'shift') return { kind: 'joiner', reph: true, conf: 'A' };
  if (code === 'KeyZ' && layer === 'normal') return { kind: 'joiner', conf: 'A' };
  if (code === 'KeyZ' && layer === 'shift') return { kind: 'joiner', conf: 'A' };
  if (text === '্') return { kind: 'joiner', conf: 'A' };
  if (text === '়') return { kind: 'mark', conf: 'B' };
  if (text === 'ৎ') return { kind: 'consonant', conf: 'A' };
  if (text === 'ঁ' || text === 'ং' || text === 'ঃ') return { kind: 'mark', conf: 'A' };
  if (text === '।' ) return { kind: 'punct', conf: 'A' };

  const preBaseChars = new Set(['ি', 'ে', 'ৈ', 'ো', 'ৌ']);
  if (preBaseChars.has(text)) {
    return { kind: 'sign', preBase: true, conf: 'A' };
  }

  const otherSigns = new Set(['া', 'ী', 'ু', 'ূ', 'ৃ', 'ৄ', 'ৗ', 'ৢ', 'ৣ']);
  if (otherSigns.has(text)) {
    const isRare = ['ৄ', 'ৗ', 'ৢ', 'ৣ'].includes(text);
    return { kind: 'sign', conf: isRare ? 'C' : 'A' };
  }

  const independentVowels = new Set(['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'ঌ', 'এ', 'ঐ', 'ও', 'ঔ']);
  if (independentVowels.has(text)) {
    return { kind: 'vowel', conf: text === 'অ' ? 'A' : (text === 'ঌ' ? 'C' : 'B') };
  }

  const consonants = new Set([
    'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ',
    'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন',
    'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ',
    'স', 'হ', 'ড়', 'ঢ়', 'য়'
  ]);
  if (consonants.has(text)) {
    return { kind: 'consonant', conf: 'A' };
  }

  if (/[০-৯]/.test(text)) {
    return { kind: 'digit', conf: 'A' };
  }

  if (text === '৳') return { kind: 'symbol', conf: 'A' };
  if (/[৲৴৵৶৷৸৹৺]/.test(text)) return { kind: 'symbol', conf: 'C' };
  if (text === 'ৰ' || text === 'ৱ') return { kind: 'consonant', conf: 'C' };
  if (text === 'ঽ' || text === 'ৡ' || text === 'ৠ') return { kind: 'symbol', conf: 'C' };

  if (/[!@#%()_+={}:"<>?\-;,'./[\]\\=`]/.test(text)) {
    return { kind: 'punct', conf: 'A' };
  }
  if (/[÷×≠≤≥]/.test(text)) {
    return { kind: 'symbol', conf: 'C' };
  }
  if (text === ' ') {
    return { kind: 'symbol', conf: 'A' };
  }

  return { kind: 'symbol', conf: 'C' };
}

export function isCombiningMark(text) {
  if (!text) return false;
  const combiningReg = /^[\u0981\u09BC\u09BE-\u09CD\u09D7\u09E2\u09E3]$/;
  return combiningReg.test(text);
}

export function formatKeycapLabel(text, code, layer) {
  if (!text) return '';
  if (text === '\u200C') return 'ZWNJ';
  if (text === ' ') return 'Space';
  if (code === 'KeyG' && layer === 'normal') return '◌্';
  if (isCombiningMark(text)) return `◌${text}`;
  return text;
}

export function buildEnrichedLayout() {
  const enriched = {};

  for (const [code, rawKey] of Object.entries(rawLayout)) {
    const layers = {};

    ['normal', 'shift', 'altgr', 'altgrShift'].forEach((layer) => {
      const text = rawKey[layer];
      if (text !== undefined && text !== null) {
        const meta = classifyCharacter(text, code, layer);
        layers[layer] = {
          text,
          kind: meta.kind,
          preBase: meta.preBase || false,
          reph: meta.reph || false,
          conf: meta.conf || 'A',
          isCombining: isCombiningMark(text),
          displayLabel: formatKeycapLabel(text, code, layer)
        };
      }
    });

    enriched[code] = {
      code,
      latin: rawKey.latin || '',
      finger: rawKey.finger || 'LP',
      row: rawKey.row || 'E',
      layers
    };
  }

  return enriched;
}

export const ENRICHED_LAYOUT = buildEnrichedLayout();

export function resolveLayer({ shift = false, altgr = false } = {}) {
  if (altgr && shift) return 'altgrShift';
  if (altgr) return 'altgr';
  if (shift) return 'shift';
  return 'normal';
}

export function buildReverseIndex() {
  const reverseMap = new Map();

  for (const [code, keyDef] of Object.entries(ENRICHED_LAYOUT)) {
    for (const [layer, out] of Object.entries(keyDef.layers)) {
      if (!out || !out.text) continue;
      const text = out.text;
      const shift = layer === 'shift' || layer === 'altgrShift';
      const altgr = layer === 'altgr' || layer === 'altgrShift';

      const entry = {
        code,
        layer,
        shift,
        altgr,
        latin: keyDef.latin,
        finger: keyDef.finger,
        text,
        reph: out.reph,
        preBase: out.preBase,
        kind: out.kind
      };

      if (!reverseMap.has(text)) {
        reverseMap.set(text, []);
      }
      reverseMap.get(text).push(entry);
    }
  }

  return reverseMap;
}

export const REVERSE_INDEX = buildReverseIndex();
