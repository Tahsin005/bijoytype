import { useState, useCallback, useMemo } from 'react';
import { CompositionEngine } from '../engine/compositionEngine.js';
import { ENRICHED_LAYOUT, resolveLayer, getRecommendedShiftKey } from '../engine/layoutData.js';
import { compileStringToKeystrokes } from '../engine/keystrokeCompiler.js';

export function useKeyboardEngine(initialSettings = {}) {
  const [inputOrder, setInputOrder] = useState(initialSettings.inputOrder || 'visual');
  const [normalizeIndependentVowels, setNormalizeIndependentVowels] = useState(
    initialSettings.normalizeIndependentVowels !== undefined ? initialSettings.normalizeIndependentVowels : true
  );
  const [rightAltAsAltGr, setRightAltAsAltGr] = useState(true);
  const [manualLayerOverride, setManualLayerOverride] = useState(null); // 'normal' | 'shift' | 'altgr' | 'altgrShift' | null

  const [text, setText] = useState('');
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [shiftHeld, setShiftHeld] = useState(false);
  const [altRightHeld, setAltRightHeld] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  // Target practice / validator state
  const [targetPrompt, setTargetPrompt] = useState('');
  const [targetStepIndex, setTargetStepIndex] = useState(0);

  // Initialize engine once using lazy initial state
  const [engine] = useState(
    () =>
      new CompositionEngine({
        inputOrder,
        normalizeIndependentVowels
      })
  );

  // Change input order and re-sync engine output
  const handleSetInputOrder = useCallback((order) => {
    setInputOrder(order);
    engine.setInputOrder(order);
    setText(engine.text);
  }, [engine]);

  // Compiled target keystrokes
  const targetKeystrokes = useMemo(() => {
    if (!targetPrompt) return [];
    return compileStringToKeystrokes(targetPrompt, inputOrder, { normalizeIndependentVowels });
  }, [targetPrompt, inputOrder, normalizeIndependentVowels]);

  // Current active physical layer
  const physicalLayer = useMemo(() => {
    return resolveLayer({ shift: shiftHeld, altgr: altRightHeld });
  }, [shiftHeld, altRightHeld]);

  // Effective layer shown on virtual keyboard (manual preview overrides if set, otherwise physical)
  const displayLayer = manualLayerOverride || physicalLayer;

  // Next expected target key
  const currentTargetKeystroke = targetKeystrokes[targetStepIndex] || null;

  // Recommended modifier key for opposite hand shift
  const requiredModifiers = useMemo(() => {
    if (!currentTargetKeystroke) return { shiftKey: null, altgrKey: null };

    const res = { shiftKey: null, altgrKey: null };
    if (currentTargetKeystroke.shift) {
      res.shiftKey = getRecommendedShiftKey(currentTargetKeystroke.code);
    }
    if (currentTargetKeystroke.altgr) {
      res.altgrKey = 'AltRight';
    }
    return res;
  }, [currentTargetKeystroke]);

  // Reset input buffer
  const clearBuffer = useCallback(() => {
    engine.reset();
    setText('');
    setTargetStepIndex(0);
    setLastEvent(null);
  }, [engine]);

  // Process a key press (either physical or virtual click)
  const processKey = useCallback(
    (code, syntheticModifiers = null) => {
      const isShift = syntheticModifiers ? syntheticModifiers.shift : shiftHeld;
      const isAltGr = syntheticModifiers ? syntheticModifiers.altgr : altRightHeld;
      const layer = resolveLayer({ shift: isShift, altgr: isAltGr });

      if (code === 'Backspace') {
        const res = engine.feed({ code: 'Backspace' });
        setText(res.text);
        if (targetStepIndex > 0) {
          setTargetStepIndex((prev) => Math.max(0, prev - 1));
        }
        setLastEvent({ type: 'backspace', code, unitLength: res.deletedUnit?.unitLength || 1 });
        return;
      }

      if (code === 'Space') {
        const res = engine.feed({
          code: 'Space',
          layer: 'normal',
          entry: { text: ' ', kind: 'symbol' }
        });
        setText(res.text);
        if (currentTargetKeystroke && currentTargetKeystroke.code === 'Space') {
          setTargetStepIndex((prev) => prev + 1);
        }
        setLastEvent({ type: 'accepted', code, output: ' ', layer: 'normal' });
        return;
      }

      const keyDef = ENRICHED_LAYOUT[code];
      if (!keyDef) {
        // Unrecognized layout key
        return;
      }

      const entry = keyDef.layers[layer];
      if (!entry) {
        // Swallowed no-op key in this layer per Section 2.2
        setLastEvent({
          type: 'noop',
          code,
          layer,
          reason: `Key ${code} has no mapping in layer ${layer}`
        });
        return;
      }

      // Feed to composition engine
      const res = engine.feed({ code, layer, entry });
      setText(res.text);

      // Practice target step validation
      if (currentTargetKeystroke) {
        if (currentTargetKeystroke.code === code && currentTargetKeystroke.layer === layer) {
          setTargetStepIndex((prev) => prev + 1);
        }
      }

      setLastEvent({
        type: 'accepted',
        code,
        layer,
        output: entry.text,
        entry
      });
    },
    [engine, shiftHeld, altRightHeld, targetStepIndex, currentTargetKeystroke]
  );

  // Physical keyboard event listeners
  const handleKeyDown = useCallback(
    (e) => {
      // Check Caps Lock state
      setCapsLockOn(e.getModifierState('CapsLock'));

      // Track AltRight / AltGr
      if (e.code === 'AltRight') {
        setAltRightHeld(true);
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        setShiftHeld(true);
      }

      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });

      const isAltGr =
        e.getModifierState('AltGraph') ||
        (rightAltAsAltGr && (e.code === 'AltRight' || altRightHeld));

      // Allow browser shortcuts if Ctrl or Meta held without AltGr (Section 2.1)
      if ((e.ctrlKey && !isAltGr) || e.metaKey) {
        return;
      }

      // Ignore repeat for all keys except Backspace and Space (Section 10)
      if (e.repeat && e.code !== 'Backspace' && e.code !== 'Space') {
        return;
      }

      // Check if key is in the layout
      const isLayoutKey = Boolean(ENRICHED_LAYOUT[e.code]) || e.code === 'Space' || e.code === 'Backspace';

      if (isLayoutKey) {
        e.preventDefault();
        processKey(e.code, { shift: e.shiftKey, altgr: isAltGr });
      }
    },
    [rightAltAsAltGr, altRightHeld, processKey]
  );

  const handleKeyUp = useCallback((e) => {
    setCapsLockOn(e.getModifierState('CapsLock'));

    if (e.code === 'AltRight') {
      setAltRightHeld(false);
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      if (!e.shiftKey) {
        setShiftHeld(false);
      }
    }

    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(e.code);
      return next;
    });
  }, []);

  return {
    text,
    inputOrder,
    setInputOrder: handleSetInputOrder,
    normalizeIndependentVowels,
    setNormalizeIndependentVowels,
    rightAltAsAltGr,
    setRightAltAsAltGr,
    manualLayerOverride,
    setManualLayerOverride,
    displayLayer,
    physicalLayer,
    pressedKeys,
    capsLockOn,
    lastEvent,
    targetPrompt,
    setTargetPrompt,
    targetKeystrokes,
    targetStepIndex,
    setTargetStepIndex,
    currentTargetKeystroke,
    requiredModifiers,
    processKey,
    clearBuffer,
    handleKeyDown,
    handleKeyUp,
    history: engine.history
  };
}
