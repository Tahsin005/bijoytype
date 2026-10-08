import { useEffect } from 'react';
import { compileStringToKeystrokes } from '../engine/keystrokeCompiler.js';

function KeyChip({ label }) {
  return (
    <kbd className="px-2 py-0.5 rounded-lg bg-white/[0.06] border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_4px_rgba(0,0,0,0.3)] text-[11px] font-mono text-slate-200 shadow-sm">
      {label}
    </kbd>
  );
}

export function ReferenceModal({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onPick,
  activeText,
  allGroups = [],
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'kar', label: 'কার', sub: 'ি ে ো' },
    { id: 'vowels', label: 'স্বরবর্ণ', sub: 'অ আ ই' },
    { id: 'juktakkhor', label: 'যুক্তাক্ষর', sub: 'ক্ষ জ্ঞ ত্র' },
    { id: 'signs', label: 'চিহ্ন ও যতিচিহ্ন', sub: '। ? ৳' },
  ];

  const currentGroups =
    activeTab === 'juktakkhor'
      ? allGroups.filter((g) => g.id === 'juktakkhor' || g.id === 'juktakkhor-words')
      : allGroups.filter((g) => g.id === activeTab);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xl flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="max-w-4xl w-full max-h-[85vh] glass-panel border border-white/[0.14] rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.85),inset_0_1.5px_1px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-white/[0.08] bg-black/40 backdrop-blur-xl p-3 md:p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`font-bangla px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 select-none ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)] scale-105 border border-primary/60'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-75 font-mono">{tab.sub}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer ml-auto hover:rotate-90"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
          {currentGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2">
                <h3 className="font-bangla text-lg font-bold text-slate-100">{group.title}</h3>
                <span className="font-display text-xs text-muted-foreground">{group.subtitle}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {group.items.map((item) => {
                  const keys = compileStringToKeystrokes(item.text, 'visual');
                  const isActive = activeText === item.text;

                  return (
                    <button
                      key={item.text}
                      type="button"
                      onClick={() => {
                        onPick(item.text);
                        onClose();
                      }}
                      className={`glass-card glass-hover glass-shimmer text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 select-none ${
                        isActive
                          ? 'bg-[hsl(var(--success)/0.15)] border-[hsl(var(--success))] shadow-[0_0_20px_hsl(var(--success)/0.4)] ring-1 ring-[hsl(var(--success))]'
                          : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-1 w-full">
                        <span className="font-bangla text-2xl md:text-3xl font-bold text-white tracking-wide">
                          {item.text}
                        </span>
                        {item.name && (
                          <span className="font-bangla text-[10px] text-muted-foreground px-1.5 py-0.5 rounded-full bg-white/[0.04]">
                            {item.name}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        {keys.map((k, i) => (
                          <KeyChip key={i} label={k.label} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.08] bg-black/40 px-4 py-2.5 text-xs text-muted-foreground flex items-center justify-between font-display">
          <span>Click any character to practice it immediately on the keyboard</span>
          <span className="font-mono text-[11px] opacity-75">Press Esc to close</span>
        </div>
      </div>
    </div>
  );
}
