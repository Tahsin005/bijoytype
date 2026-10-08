import { CompositionEngine, areBengaliStringsEquivalent } from './compositionEngine.js';
import { compileStringToKeystrokes } from './keystrokeCompiler.js';
import { ENRICHED_LAYOUT } from './layoutData.js';

export const TEST_VECTORS = [
  {
    id: 1,
    word: 'আমি',
    modeLKeys: ['AltGr+F', 'M', 'D'],
    modeVKeys: ['AltGr+F', 'D', 'M'],
    modeLCodes: [
      { code: 'KeyF', layer: 'altgr' },
      { code: 'KeyM', layer: 'normal' },
      { code: 'KeyD', layer: 'normal' }
    ],
    modeVCodes: [
      { code: 'KeyF', layer: 'altgr' },
      { code: 'KeyD', layer: 'normal' },
      { code: 'KeyM', layer: 'normal' }
    ]
  },
  {
    id: 2,
    word: 'বাংলা',
    modeLKeys: ['H', 'F', 'Shift+Q', 'Shift+V', 'F'],
    modeVKeys: ['H', 'F', 'Shift+Q', 'Shift+V', 'F'],
    modeLCodes: [
      { code: 'KeyH', layer: 'normal' },
      { code: 'KeyF', layer: 'normal' },
      { code: 'KeyQ', layer: 'shift' },
      { code: 'KeyV', layer: 'shift' },
      { code: 'KeyF', layer: 'normal' }
    ],
    modeVCodes: [
      { code: 'KeyH', layer: 'normal' },
      { code: 'KeyF', layer: 'normal' },
      { code: 'KeyQ', layer: 'shift' },
      { code: 'KeyV', layer: 'shift' },
      { code: 'KeyF', layer: 'normal' }
    ]
  },
  {
    id: 3,
    word: 'কর্ম',
    modeLKeys: ['J', 'Shift+A', 'M'],
    modeVKeys: ['J', 'M', 'Shift+A'],
    modeLCodes: [
      { code: 'KeyJ', layer: 'normal' },
      { code: 'KeyA', layer: 'shift' },
      { code: 'KeyM', layer: 'normal' }
    ],
    modeVCodes: [
      { code: 'KeyJ', layer: 'normal' },
      { code: 'KeyM', layer: 'normal' },
      { code: 'KeyA', layer: 'shift' }
    ]
  },
  {
    id: 4,
    word: 'ধর্ম',
    modeLKeys: ['Shift+L', 'Shift+A', 'M'],
    modeVKeys: ['Shift+L', 'M', 'Shift+A'],
    modeLCodes: [
      { code: 'KeyL', layer: 'shift' },
      { code: 'KeyA', layer: 'shift' },
      { code: 'KeyM', layer: 'normal' }
    ],
    modeVCodes: [
      { code: 'KeyL', layer: 'shift' },
      { code: 'KeyM', layer: 'normal' },
      { code: 'KeyA', layer: 'shift' }
    ]
  },
  {
    id: 5,
    word: 'বিদ্যালয়',
    modeLKeys: ['H', 'D', 'L', 'Shift+Z', 'F', 'Shift+V', 'Shift+W'],
    modeVKeys: ['D', 'H', 'L', 'Shift+Z', 'F', 'Shift+V', 'Shift+W'],
    modeLCodes: [
      { code: 'KeyH', layer: 'normal' },
      { code: 'KeyD', layer: 'normal' },
      { code: 'KeyL', layer: 'normal' },
      { code: 'KeyZ', layer: 'shift' },
      { code: 'KeyF', layer: 'normal' },
      { code: 'KeyV', layer: 'shift' },
      { code: 'KeyW', layer: 'shift' }
    ],
    modeVCodes: [
      { code: 'KeyD', layer: 'normal' },
      { code: 'KeyH', layer: 'normal' },
      { code: 'KeyL', layer: 'normal' },
      { code: 'KeyZ', layer: 'shift' },
      { code: 'KeyF', layer: 'normal' },
      { code: 'KeyV', layer: 'shift' },
      { code: 'KeyW', layer: 'shift' }
    ]
  },
  {
    id: 6,
    word: 'কোথায়',
    modeLKeys: ['J', 'X', 'Shift+K', 'F', 'Shift+W'],
    modeVKeys: ['X', 'J', 'Shift+K', 'F', 'Shift+W'],
    modeLCodes: [
      { code: 'KeyJ', layer: 'normal' },
      { code: 'KeyX', layer: 'normal' },
      { code: 'KeyK', layer: 'shift' },
      { code: 'KeyF', layer: 'normal' },
      { code: 'KeyW', layer: 'shift' }
    ],
    modeVCodes: [
      { code: 'KeyX', layer: 'normal' },
      { code: 'KeyJ', layer: 'normal' },
      { code: 'KeyK', layer: 'shift' },
      { code: 'KeyF', layer: 'normal' },
      { code: 'KeyW', layer: 'shift' }
    ]
  },
  {
    id: 7,
    word: 'সৌন্দর্য',
    modeLKeys: ['N', 'Shift+X', 'B', 'G', 'L', 'V', 'Shift+Z'],
    modeVKeys: ['Shift+X', 'N', 'B', 'G', 'L', 'V', 'Shift+Z'],
    modeLCodes: [
      { code: 'KeyN', layer: 'normal' },
      { code: 'KeyX', layer: 'shift' },
      { code: 'KeyB', layer: 'normal' },
      { code: 'KeyG', layer: 'normal' },
      { code: 'KeyL', layer: 'normal' },
      { code: 'KeyV', layer: 'normal' },
      { code: 'KeyZ', layer: 'shift' }
    ],
    modeVCodes: [
      { code: 'KeyX', layer: 'shift' },
      { code: 'KeyN', layer: 'normal' },
      { code: 'KeyB', layer: 'normal' },
      { code: 'KeyG', layer: 'normal' },
      { code: 'KeyL', layer: 'normal' },
      { code: 'KeyV', layer: 'normal' },
      { code: 'KeyZ', layer: 'shift' }
    ]
  },
  {
    id: 8,
    word: 'দুঃখ',
    modeLKeys: ['L', 'S', '\\', 'Shift+J'],
    modeVKeys: ['L', 'S', '\\', 'Shift+J'],
    modeLCodes: [
      { code: 'KeyL', layer: 'normal' },
      { code: 'KeyS', layer: 'normal' },
      { code: 'Backslash', layer: 'normal' },
      { code: 'KeyJ', layer: 'shift' }
    ],
    modeVCodes: [
      { code: 'KeyL', layer: 'normal' },
      { code: 'KeyS', layer: 'normal' },
      { code: 'Backslash', layer: 'normal' },
      { code: 'KeyJ', layer: 'shift' }
    ]
  },
  {
    id: 9,
    word: 'বিজ্ঞান',
    modeLKeys: ['H', 'D', 'U', 'G', 'Shift+I', 'F', 'B'],
    modeVKeys: ['D', 'H', 'U', 'G', 'Shift+I', 'F', 'B'],
    modeLCodes: [
      { code: 'KeyH', layer: 'normal' },
      { code: 'KeyD', layer: 'normal' },
      { code: 'KeyU', layer: 'normal' },
      { code: 'KeyG', layer: 'normal' },
      { code: 'KeyI', layer: 'shift' },
      { code: 'KeyF', layer: 'normal' },
      { code: 'KeyB', layer: 'normal' }
    ],
    modeVCodes: [
      { code: 'KeyD', layer: 'normal' },
      { code: 'KeyH', layer: 'normal' },
      { code: 'KeyU', layer: 'normal' },
      { code: 'KeyG', layer: 'normal' },
      { code: 'KeyI', layer: 'shift' },
      { code: 'KeyF', layer: 'normal' },
      { code: 'KeyB', layer: 'normal' }
    ]
  },
  {
    id: 10,
    word: '৳৫০',
    modeLKeys: ['Shift+4', '5', '0'],
    modeVKeys: ['Shift+4', '5', '0'],
    modeLCodes: [
      { code: 'Digit4', layer: 'shift' },
      { code: 'Digit5', layer: 'normal' },
      { code: 'Digit0', layer: 'normal' }
    ],
    modeVCodes: [
      { code: 'Digit4', layer: 'shift' },
      { code: 'Digit5', layer: 'normal' },
      { code: 'Digit0', layer: 'normal' }
    ]
  }
];

export function runAllTestVectors() {
  const results = [];

  for (const vec of TEST_VECTORS) {
    // 1. Test Mode L Compiler
    const compiledL = compileStringToKeystrokes(vec.word, 'logical');
    const compiledLLabels = compiledL.map((k) => k.label);
    const compilerMatchesL = JSON.stringify(compiledLLabels) === JSON.stringify(vec.modeLKeys);

    // 2. Test Mode L Engine Execution
    const engineL = new CompositionEngine({ inputOrder: 'logical' });
    for (const step of vec.modeLCodes) {
      const entry = ENRICHED_LAYOUT[step.code]?.layers[step.layer];
      engineL.feed({ code: step.code, layer: step.layer, entry });
    }
    const engineProducesL = areBengaliStringsEquivalent(engineL.text, vec.word);

    // 3. Test Mode V Compiler
    const compiledV = compileStringToKeystrokes(vec.word, 'visual');
    const compiledVLabels = compiledV.map((k) => k.label);
    const compilerMatchesV = JSON.stringify(compiledVLabels) === JSON.stringify(vec.modeVKeys);

    // 4. Test Mode V Engine Execution
    const engineV = new CompositionEngine({ inputOrder: 'visual' });
    for (const step of vec.modeVCodes) {
      const entry = ENRICHED_LAYOUT[step.code]?.layers[step.layer];
      engineV.feed({ code: step.code, layer: step.layer, entry });
    }
    const engineProducesV = areBengaliStringsEquivalent(engineV.text, vec.word);

    // 5. Test Backspace Unit Deletion
    const engineVBackspace = new CompositionEngine({ inputOrder: 'visual' });
    for (const step of vec.modeVCodes) {
      const entry = ENRICHED_LAYOUT[step.code]?.layers[step.layer];
      engineVBackspace.feed({ code: step.code, layer: step.layer, entry });
    }
    const textBeforeBksp = engineVBackspace.text;
    engineVBackspace.feed({ code: 'Backspace' });
    const backspaceWorks = engineVBackspace.text.length < textBeforeBksp.length;

    const allPassed =
      compilerMatchesL &&
      engineProducesL &&
      compilerMatchesV &&
      engineProducesV &&
      backspaceWorks;

    results.push({
      id: vec.id,
      word: vec.word,
      allPassed,
      modeL: {
        compilerMatches: compilerMatchesL,
        engineMatches: engineProducesL,
        expectedKeys: vec.modeLKeys,
        actualKeys: compiledLLabels,
        engineOutput: engineL.text
      },
      modeV: {
        compilerMatches: compilerMatchesV,
        engineMatches: engineProducesV,
        expectedKeys: vec.modeVKeys,
        actualKeys: compiledVLabels,
        engineOutput: engineV.text
      },
      backspaceWorks
    });
  }

  return results;
}
