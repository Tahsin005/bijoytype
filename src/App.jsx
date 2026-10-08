import { useState, useEffect } from 'react';
import { useKeyboardEngine } from './hooks/useKeyboardEngine.js';
import { Keyboard } from './components/Keyboard.jsx';
import { ExampleList } from './components/ExampleList.jsx';
import { ReferenceModal } from './components/ReferenceModal.jsx';
import { AmbientBackground } from './components/AmbientBackground.jsx';
import { EXAMPLE_GROUPS } from './data/examples.js';
import { getRecommendedShiftKey } from './engine/layoutData.js';
import { areBengaliStringsEquivalent } from './engine/compositionEngine.js';

function detectIsMobile() {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent || navigator.vendor || window.opera || '';

  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);

  const isIPad = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;

  const isSmallScreen = window.innerWidth < 1024 || (window.screen && window.screen.width < 1024);

  const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  return isMobileUA || isIPad || isTouchOnly || isSmallScreen;
}

export default function App() {
  const [isMobile, setIsMobile] = useState(detectIsMobile);
  const [modalTab, setModalTab] = useState(null); // 'kar' | 'vowels' | 'juktakkhor' | 'signs' | null

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(detectIsMobile());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const {
    text,
    physicalLayer,
    pressedKeys,
    capsLockOn,
    targetPrompt,
    setTargetPrompt,
    targetKeystrokes,
    processKey,
    clearBuffer,
    handleKeyDown,
    handleKeyUp,
    history,
  } = useKeyboardEngine({ inputOrder: 'visual' });

  useEffect(() => {
    if (isMobile) return;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMobile, handleKeyDown, handleKeyUp]);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
        <AmbientBackground />
        <div className="max-w-md w-full glass-panel border border-white/[0.12] rounded-3xl p-6 md:p-8 text-center flex flex-col items-center gap-5 shadow-[0_24px_64px_rgba(0,0,0,0.85)] relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="font-bangla text-2xl font-bold text-white tracking-tight">
              ল্যাপটপ বা কম্পিউটার প্রয়োজন
            </h1>
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-slate-400">
              Desktop or Laptop Required
            </p>
          </div>

          <p className="font-bangla text-sm text-slate-300 leading-relaxed">
            বিজয় কীবোর্ড টাইপিং প্র্যাকটিসের জন্য একটি ফিজিক্যাল (হার্ডওয়্যার) কীবোর্ড প্রয়োজন। মোবাইল ফোনে অন-স্ক্রিন কিবোর্ড দিয়ে এটি ব্যবহার করা সম্ভব নয়।
          </p>

          <p className="font-display text-xs text-muted-foreground leading-relaxed border-t border-white/[0.08] pt-3">
            This typing app requires a physical ANSI keyboard to practice touch typing. Please open this website on your desktop or laptop.
          </p>
        </div>
      </div>
    );
  }

  const typed = history.map((h) => h.input);
  const wrongAt = typed.findIndex((t, i) => {
    const expected = targetKeystrokes[i];
    return !expected || expected.code !== t.code || expected.layer !== t.layer;
  });
  const done = Boolean(targetPrompt) && text !== '' && areBengaliStringsEquivalent(text, targetPrompt);
  const isWrong = Boolean(targetPrompt) && !done && wrongAt !== -1;
  const nextKey = targetPrompt && !done && !isWrong ? targetKeystrokes[typed.length] : null;

  const modifierCodes = [];
  if (nextKey?.shift) modifierCodes.push(getRecommendedShiftKey(nextKey.code));
  if (nextKey?.altgr) modifierCodes.push('AltRight');

  const pickExample = (word) => {
    clearBuffer();
    setTargetPrompt(word);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stopPractice = () => {
    clearBuffer();
    setTargetPrompt('');
  };

  return (
    <div className="min-h-screen text-foreground relative selection:bg-primary/30 selection:text-white">
      <AmbientBackground />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6 relative z-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
              </svg>
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                BIJOYTYPE · বাংলা কীবোর্ড
              </span>
            </div>
            <h1 className="flex items-baseline gap-3 mt-3 tracking-tight">
              <span className="font-bangla text-3xl md:text-4xl font-extrabold text-foreground tracking-tight drop-shadow-sm">
                বিজয়টাইপ
              </span>
              <span className="font-mono text-xs md:text-sm text-muted-foreground font-medium">
                bijoytype
              </span>
            </h1>
            <p className="font-display text-xs md:text-sm text-muted-foreground mt-0.5">
              Just start typing. Choose any word below to practice — next keys glow in real time.
            </p>
          </div>

          <nav className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setModalTab('kar')}
              className="glass-card glass-hover px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium text-slate-300 hover:text-white border-white/[0.08] hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-all cursor-pointer flex items-center gap-1.5 select-none"
            >
              <span className="font-bangla">কার</span>
              <span className="text-[10px] text-muted-foreground font-mono">ি ে ো</span>
            </button>
            <button
              type="button"
              onClick={() => setModalTab('vowels')}
              className="glass-card glass-hover px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium text-slate-300 hover:text-white border-white/[0.08] hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-all cursor-pointer flex items-center gap-1.5 select-none"
            >
              <span className="font-bangla">স্বরবর্ণ</span>
              <span className="text-[10px] text-muted-foreground font-mono">অ আ ই</span>
            </button>
            <button
              type="button"
              onClick={() => setModalTab('juktakkhor')}
              className="glass-card glass-hover px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium text-slate-300 hover:text-white border-white/[0.08] hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-all cursor-pointer flex items-center gap-1.5 select-none"
            >
              <span className="font-bangla">যুক্তাক্ষর</span>
              <span className="text-[10px] text-muted-foreground font-mono">ক্ষ জ্ঞ ত্র</span>
            </button>
            <button
              type="button"
              onClick={() => setModalTab('signs')}
              className="glass-card glass-hover px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium text-slate-300 hover:text-white border-white/[0.08] hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-all cursor-pointer flex items-center gap-1.5 select-none"
            >
              <span className="font-bangla">চিহ্ন ও যতিচিহ্ন</span>
              <span className="text-[10px] text-muted-foreground font-mono">। ? ৳</span>
            </button>
          </nav>
        </header>

        <section className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col gap-3 shadow-2xl relative overflow-hidden">
          {targetPrompt && (
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Target:
                </span>
                <span className="font-bangla text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                  {targetPrompt}
                </span>
              </div>
              <button
                type="button"
                onClick={stopPractice}
                className="font-display text-xs px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>
          )}

          <div className="min-h-[64px] px-4 py-3 rounded-2xl bg-black/45 border border-white/[0.08] shadow-inner flex items-center">
            {text ? (
              <span className="font-bangla text-2xl md:text-3xl text-slate-100 break-all drop-shadow">
                {text}
              </span>
            ) : (
              <span className="font-display text-sm md:text-base text-slate-500">
                Your typing appears here… just touch the keyboard keys
              </span>
            )}
            <span className="inline-block w-0.5 h-7 md:h-8 bg-primary animate-pulse ml-1.5 shadow-[0_0_8px_hsl(var(--primary))]" />
          </div>

          <div className="flex items-center justify-between gap-3 text-xs md:text-sm font-display flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {done && (
                <span className="text-[hsl(var(--success))] font-bold flex items-center gap-1">
                  ✓ সঠিক! (Correct!)
                </span>
              )}
              {isWrong && (
                <span className="text-[hsl(var(--destructive))] font-medium">
                  ভুল কী — press Backspace to fix
                </span>
              )}
              {nextKey && (
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="text-muted-foreground">Next key:</span>
                  <kbd className="px-2 py-0.5 rounded-lg bg-[hsl(var(--success)/0.15)] border border-[hsl(var(--success)/0.7)] font-mono text-[hsl(var(--success))] text-xs md:text-sm shadow-[0_0_15px_hsl(var(--success)/0.35)]">
                    {nextKey.label}
                  </kbd>
                </span>
              )}
              {capsLockOn && (
                <span className="text-amber-400 text-xs px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                  Caps Lock is ON
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={clearBuffer}
              className="px-3.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-semibold"
            >
              Clear
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <Keyboard
            layer={physicalLayer}
            pressedKeys={pressedKeys}
            targetCode={nextKey?.code}
            modifierCodes={modifierCodes}
            onKeyClick={(code) => processKey(code)}
          />

          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-display px-2 flex-wrap gap-2">
            <span>
              Center = Normal · Top-left = Shift · Bottom-right (cyan) = Right Alt (AltGr)
            </span>
            <span className="hidden sm:inline">
              Tactile bumps on home keys F &amp; J
            </span>
          </div>
        </section>

        <section className="mt-4 flex flex-col gap-4">
          <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-3">
            <div>
              <div className="font-display text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                PRACTICE REPERTOIRE · প্র্যাকটিস তালিকা
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mt-0.5">
                Practice Examples
              </h2>
            </div>
            <span className="font-display text-xs text-muted-foreground hidden sm:inline">
              Click any word or letter to practice
            </span>
          </div>

          <ExampleList
            groups={EXAMPLE_GROUPS}
            onPick={pickExample}
            activeText={targetPrompt}
          />
        </section>

        <ReferenceModal
          isOpen={Boolean(modalTab)}
          onClose={() => setModalTab(null)}
          activeTab={modalTab || 'kar'}
          setActiveTab={setModalTab}
          onPick={pickExample}
          activeText={targetPrompt}
          allGroups={EXAMPLE_GROUPS}
        />
      </div>
    </div>
  );
}
