import { ENRICHED_LAYOUT, REVERSE_INDEX } from './layoutData.js';
import { canonicalizeBengali } from './compositionEngine.js';

// pre-base signs in Bengali
export const PRE_BASE_SIGNS = new Set(['\u09BF', '\u09C7', '\u09C8', '\u09CB', '\u09CC']); // ি, ে, ৈ, ো, ৌ

// independent vowels
export const INDEPENDENT_VOWELS = new Set([
  '\u0985', '\u0986', '\u0987', '\u0988', '\u0989', '\u098A', '\u098B',
  '\u098C', '\u098F', '\u0990', '\u0993', '\u0994'
]);

// consonants
export const CONSONANTS = new Set([
  'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ',
  'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন',
  'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ',
  'স', 'হ', 'ড়', 'ঢ়', 'য়', 'ৎ'
]);

// returns canonical keystroke for a character or sequence
export function getCanonicalKeystroke(char) {
  const matches = REVERSE_INDEX.get(char);
  if (!matches || matches.length === 0) return null;

  // prefer normal over shift over altgr
  const sorted = [...matches].sort((a, b) => {
    const score = (entry) => (entry.layer === 'normal' ? 0 : entry.layer === 'shift' ? 1 : entry.layer === 'altgr' ? 2 : 3);
    return score(a) - score(b);
  });

  return sorted[0];
}

// parse a Bangla string into orthographic syllables / units
// handles: reph, consonant clusters (with hasanta, ra-phala, ya-phala), vowel signs, marks
export function parseBanglaUnits(text) {
  const units = [];
  let i = 0;
  const n = text.length;

  while (i < n) {
    const ch = text[i];

    // check for Reph: র + ্ (U+09B0 U+09CD) followed by a consonant (except য where র্য is ra + ya-phala per Section 9.2)
    if (ch === '\u09B0' && i + 1 < n && text[i + 1] === '\u09CD') {
      const nextIdx = i + 2;
      if (nextIdx < n && text[nextIdx] !== '\u09AF' && CONSONANTS.has(text[nextIdx])) {
        // this is a Reph attached to the following consonant cluster!
        // we'll parse the attached cluster and note hasReph: true
        i += 2;
        const clusterUnit = parseClusterAt(text, i);
        clusterUnit.hasReph = true;
        units.push(clusterUnit);
        i = clusterUnit.endIndex;
        continue;
      }
    }

    // check for Consonant
    if (CONSONANTS.has(ch)) {
      const clusterUnit = parseClusterAt(text, i);
      units.push(clusterUnit);
      i = clusterUnit.endIndex;
      continue;
    }

    // independent vowel
    if (INDEPENDENT_VOWELS.has(ch)) {
      const vowelUnit = {
        type: 'independentVowel',
        text: ch,
        vowel: ch,
        marks: [],
        startIndex: i,
        endIndex: i + 1
      };
      i++;
      // check attached marks: ং, ঃ, ঁ
      while (i < n && /[\u0981\u0982\u0983]/.test(text[i])) {
        vowelUnit.marks.push(text[i]);
        vowelUnit.text += text[i];
        vowelUnit.endIndex++;
        i++;
      }
      units.push(vowelUnit);
      continue;
    }

    // standalone hasanta, signs, digits, punctuation, space
    units.push({
      type: 'char',
      text: ch,
      startIndex: i,
      endIndex: i + 1
    });
    i++;
  }

  return units;
}

// parse a consonant cluster starting at index i
function parseClusterAt(text, startIndex) {
  const n = text.length;
  let i = startIndex;

  const cluster = {
    type: 'syllable',
    hasReph: false,
    elements: [], // { type: 'consonant'|'hasanta'|'raPhala'|'yaPhala', text, code }
    vowelSign: null,
    marks: [],
    startIndex,
    endIndex: startIndex,
    text: ''
  };

  // initial consonant
  cluster.elements.push({ type: 'consonant', text: text[i] });
  i++;

  while (i < n) {
    if (text[i] === '\u09CD') {
      if (i + 1 < n && text[i + 1] === '\u09B0') {
        cluster.elements.push({ type: 'raPhala', text: '\u09CD\u09B0' });
        i += 2;
        continue;
      }
      if (i + 1 < n && text[i + 1] === '\u09AF') {
        cluster.elements.push({ type: 'yaPhala', text: '\u09CD\u09AF' });
        i += 2;
        continue;
      }
      if (i + 1 < n && CONSONANTS.has(text[i + 1])) {
        cluster.elements.push({ type: 'hasanta', text: '\u09CD' });
        cluster.elements.push({ type: 'consonant', text: text[i + 1] });
        i += 2;
        continue;
      }
      cluster.elements.push({ type: 'hasanta', text: '\u09CD' });
      i++;
      break;
    }
    break;
  }

  if (i < n && /^[\u09BE-\u09CC\u09C3\u09C4\u09D7\u09E2\u09E3]/.test(text[i])) {
    cluster.vowelSign = text[i];
    i++;
  }

  while (i < n && /^[\u0981\u0982\u0983]/.test(text[i])) {
    cluster.marks.push(text[i]);
    i++;
  }

  cluster.endIndex = i;
  cluster.text = text.slice(startIndex, i);
  return cluster;
}

export function compileStringToKeystrokes(targetText, inputOrder = 'visual', options = {}) {
  const { normalizeIndependentVowels = true } = options;
  const canonicalTarget = canonicalizeBengali(targetText, normalizeIndependentVowels);
  const units = parseBanglaUnits(canonicalTarget);
  const keystrokes = [];

  for (const unit of units) {
    if (unit.type === 'syllable') {
      const isPreBase = unit.vowelSign && PRE_BASE_SIGNS.has(unit.vowelSign);

      if (inputOrder === 'visual') {
        if (isPreBase) {
          addKeystroke(unit.vowelSign, keystrokes);
        }

        for (const elem of unit.elements) {
          if (elem.type === 'raPhala') {
            addKeyExplicit('KeyZ', 'normal', '্র', keystrokes);
          } else if (elem.type === 'yaPhala') {
            addKeyExplicit('KeyZ', 'shift', '্য', keystrokes);
          } else if (elem.type === 'hasanta') {
            addKeyExplicit('KeyG', 'normal', '্', keystrokes);
          } else {
            addKeystroke(elem.text, keystrokes);
          }
        }

        if (unit.hasReph) {
          addKeyExplicit('KeyA', 'shift', 'র্', keystrokes);
        }

        if (unit.vowelSign && !isPreBase) {
          addKeystroke(unit.vowelSign, keystrokes);
        }

        for (const mark of unit.marks) {
          addKeystroke(mark, keystrokes);
        }
      } else {
        if (unit.hasReph) {
          addKeyExplicit('KeyA', 'shift', 'র্', keystrokes);
        }

        for (const elem of unit.elements) {
          if (elem.type === 'raPhala') {
            addKeyExplicit('KeyZ', 'normal', '্র', keystrokes);
          } else if (elem.type === 'yaPhala') {
            addKeyExplicit('KeyZ', 'shift', '্য', keystrokes);
          } else if (elem.type === 'hasanta') {
            addKeyExplicit('KeyG', 'normal', '্', keystrokes);
          } else {
            addKeystroke(elem.text, keystrokes);
          }
        }

        if (unit.vowelSign) {
          addKeystroke(unit.vowelSign, keystrokes);
        }

        for (const mark of unit.marks) {
          addKeystroke(mark, keystrokes);
        }
      }
    } else if (unit.type === 'independentVowel') {
      addKeystroke(unit.vowel, keystrokes, {
        alternatives: unit.vowel === 'আ' && normalizeIndependentVowels ? [
          [{ code: 'KeyF', layer: 'shift' }, { code: 'KeyF', layer: 'normal' }]
        ] : []
      });
      for (const mark of unit.marks) {
        addKeystroke(mark, keystrokes);
      }
    } else {
      addKeystroke(unit.text, keystrokes);
    }
  }

  return keystrokes;
}

function addKeystroke(char, keystrokes, meta = {}) {
  const ks = getCanonicalKeystroke(char);
  if (ks) {
    keystrokes.push({
      code: ks.code,
      layer: ks.layer,
      shift: ks.shift,
      altgr: ks.altgr,
      latin: ks.latin,
      finger: ks.finger,
      text: char,
      label: ks.latin ? `${ks.shift ? 'Shift+' : ''}${ks.altgr ? 'AltGr+' : ''}${ks.latin}` : ks.code,
      alternatives: meta.alternatives || []
    });
  } else {
    keystrokes.push({
      code: 'Unknown',
      layer: 'normal',
      shift: false,
      altgr: false,
      latin: '?',
      text: char,
      label: char,
      unreachable: true
    });
  }
}

function addKeyExplicit(code, layer, text, keystrokes) {
  const keyDef = ENRICHED_LAYOUT[code];
  const shift = layer === 'shift' || layer === 'altgrShift';
  const altgr = layer === 'altgr' || layer === 'altgrShift';

  keystrokes.push({
    code,
    layer,
    shift,
    altgr,
    latin: keyDef ? keyDef.latin : code,
    finger: keyDef ? keyDef.finger : 'LI',
    text,
    label: keyDef ? `${shift ? 'Shift+' : ''}${altgr ? 'AltGr+' : ''}${keyDef.latin}` : code,
    alternatives: []
  });
}
