import { useState } from 'react';
import { compileStringToKeystrokes } from '../engine/keystrokeCompiler.js';

function KeyChip({ label }) {
  return (
    <kbd className="px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.3)] text-[11px] font-mono text-slate-200 tracking-tight">
      {label}
    </kbd>
  );
}

export function ExampleList({ groups, onPick, activeText }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // filter groups if a specific tab is chosen
  const filteredGroups =
    selectedCategory === 'all'
      ? groups
      : groups.filter((g) => g.id === selectedCategory);

  // category navigation tabs
  const categoryTabs = [
    { id: 'all', label: 'সব', sub: 'All' },
    ...groups.map((g) => ({ id: g.id, label: g.title, sub: g.subtitle })),
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex items-center gap-1.5 md:gap-2 flex-wrap overflow-x-auto pb-1">
        {categoryTabs.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`font-bangla px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5 select-none ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)] scale-105 border border-primary/50'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/[0.18]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      
      <div className="flex flex-col gap-8 md:gap-10">
        {filteredGroups.map((group) => {
          const cardAccentClasses = 'hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]';

          return (
            <section key={group.id} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-3">
                <h2 className="font-bangla text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                  {group.title}
                </h2>
                <span className="font-display text-xs text-muted-foreground">
                  {group.subtitle}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 md:gap-3">
                {group.items.map((item) => {
                  const keys = compileStringToKeystrokes(item.text, 'visual');
                  const isActive = activeText === item.text;

                  return (
                    <button
                      key={item.text}
                      type="button"
                      onClick={() => onPick(item.text)}
                      className={`glass-card glass-hover glass-shimmer text-left p-3 md:p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 select-none ${
                        isActive
                          ? 'bg-[hsl(var(--success)/0.15)] border-[hsl(var(--success)/0.9)] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.2),0_0_25px_hsl(var(--success)/0.35)] ring-1 ring-[hsl(var(--success))] scale-[1.02]'
                          : `bg-white/[0.03] border-white/[0.08] ${cardAccentClasses}`
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2 w-full">
                        <span className="font-bangla text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-sm">
                          {item.text}
                        </span>
                        {item.name && (
                          <span className="font-bangla text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
