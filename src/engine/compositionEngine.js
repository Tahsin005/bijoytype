export function canonicalizeBengali(str, normalizeIndependentVowels = true) {
  if (!str) return '';
  let res = str.normalize('NFC')
    .replace(/\u09A1\u09BC/g, '\u09DC')
    .replace(/\u09A2\u09BC/g, '\u09DD')
    .replace(/\u09AF\u09BC/g, '\u09DF');

  if (normalizeIndependentVowels) {
    res = res.replace(/\u0985\u09BE/g, '\u0986');
  }
  return res;
}

export function areBengaliStringsEquivalent(a, b, normalizeIndependentVowels = true) {
  return canonicalizeBengali(a, normalizeIndependentVowels) === canonicalizeBengali(b, normalizeIndependentVowels);
}

export class CompositionEngine {
  constructor(settings = {}) {
    this.settings = {
      inputOrder: 'visual', // 'visual' | 'logical'
      normalizeIndependentVowels: true,
      capsLockWarning: true,
      ...settings
    };

    this.reset();
  }

  reset() {
    this.text = '';
    this.history = []; // array of keystrokeHistoryItem
    this.pendingPreBase = null; // { text, code, layer, output }
    this.activeCluster = null; // { base: string, fullCluster: string, startIndex: number }
  }

  setInputOrder(order) {
    if (this.settings.inputOrder !== order) {
      this.settings.inputOrder = order;
      // re-run composition from history with new input order
      const pastHistory = [...this.history];
      this.reset();
      for (const item of pastHistory) {
        this.feed(item.input);
      }
    }
  }

  getState() {
    return {
      text: this.text,
      pendingPreBase: this.pendingPreBase,
      activeCluster: this.activeCluster,
      historyCount: this.history.length,
      inputOrder: this.settings.inputOrder
    };
  }

  feed(input) {
    const { code, layer, entry } = input;

    // handle backspace
    if (code === 'Backspace') {
      return this.handleBackspace();
    }

    if (!entry || !entry.text) {
      return { text: this.text, accepted: false, isNoOp: true };
    }

    const outputText = entry.text;
    const kind = entry.kind;
    const isPreBase = !!entry.preBase;
    const isReph = !!entry.reph;

    // snapshot state before keystroke for undo/history tracking
    const stateSnapshot = {
      text: this.text,
      pendingPreBase: this.pendingPreBase ? { ...this.pendingPreBase } : null,
      activeCluster: this.activeCluster ? { ...this.activeCluster } : null
    };

    if (this.settings.inputOrder === 'logical') {
      this.processLogical({ code, layer, entry, outputText, kind, isReph });
    } else {
      this.processVisual({ code, layer, entry, outputText, kind, isPreBase, isReph });
    }

    const historyItem = {
      input,
      snapshotBefore: stateSnapshot,
      resultingText: this.text,
      unitLength: this.text.length - stateSnapshot.text.length
    };
    this.history.push(historyItem);

    return {
      text: this.text,
      accepted: true,
      isNoOp: false,
      unitLength: historyItem.unitLength
    };
  }

  // mode L: pure sequential composition
  processLogical({ outputText }) {
    this.text += outputText;
  }

  processVisual({ code, layer, entry, outputText, kind, isPreBase, isReph }) {
    // Rule: on Shift+A, if the cluster just completed is base B, insert র্ before base cluster in output
    if (isReph) {
      if (this.activeCluster) {
        const insertIdx = this.activeCluster.startIndex;
        const rephText = '\u09B0\u09CD'; // র্
        this.text = this.text.slice(0, insertIdx) + rephText + this.text.slice(insertIdx);
        this.activeCluster.startIndex += rephText.length;
        return;
      } else {
        this.text += outputText;
        return;
      }
    }

    if (isPreBase) {
      if (this.pendingPreBase) {
        this.pendingPreBase = { text: outputText, code, layer, entry };
      } else {
        this.pendingPreBase = { text: outputText, code, layer, entry };
      }
      return;
    }

    if (kind === 'consonant') {
      if (this.activeCluster && this.text.endsWith('\u09CD')) {
        this.text += outputText;
        this.activeCluster.fullCluster += outputText;
        if (this.pendingPreBase) {
          this.text += this.pendingPreBase.text;
          this.pendingPreBase = null;
        }
        return;
      }

      const startIndex = this.text.length;
      this.text += outputText;

      this.activeCluster = {
        base: outputText,
        fullCluster: outputText,
        startIndex
      };

      if (this.pendingPreBase) {
        const signText = this.pendingPreBase.text;
        this.text += signText;
        this.pendingPreBase = null;
      }
      return;
    }

    if (outputText === '\u09CD') {
      const preBaseChars = ['\u09BF', '\u09C7', '\u09C8', '\u09CB', '\u09CC'];
      const lastChar = this.text.slice(-1);

      if (preBaseChars.includes(lastChar)) {
        const pendingSign = lastChar;
        this.text = this.text.slice(0, -1) + '\u09CD';
        this.pendingPreBase = { text: pendingSign };
        if (this.activeCluster) {
          this.activeCluster.fullCluster += '\u09CD';
        }
        return;
      }

      this.text += outputText;
      if (this.activeCluster) {
        this.activeCluster.fullCluster += outputText;
      }
      return;
    }

    if (code === 'KeyZ') {
      const preBaseChars = ['\u09BF', '\u09C7', '\u09C8', '\u09CB', '\u09CC'];
      const lastChar = this.text.slice(-1);

      if (preBaseChars.includes(lastChar)) {
        const pendingSign = lastChar;
        this.text = this.text.slice(0, -1) + outputText + pendingSign;
        if (this.activeCluster) {
          this.activeCluster.fullCluster += outputText;
        }
        return;
      }

      this.text += outputText;
      if (this.activeCluster) {
        this.activeCluster.fullCluster += outputText;
      }
      return;
    }

    if (this.pendingPreBase) {
      this.text += this.pendingPreBase.text;
      this.pendingPreBase = null;
    }

    this.text += outputText;
    this.activeCluster = null;
  }

  handleBackspace() {
    if (this.history.length === 0) {
      return { text: this.text, accepted: false, isNoOp: true };
    }

    const lastItem = this.history.pop();
    this.text = lastItem.snapshotBefore.text;
    this.pendingPreBase = lastItem.snapshotBefore.pendingPreBase;
    this.activeCluster = lastItem.snapshotBefore.activeCluster;

    return {
      text: this.text,
      accepted: true,
      isNoOp: false,
      deletedUnit: lastItem
    };
  }
}
