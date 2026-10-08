import { memo } from 'react';
import { FINGER_INFO, ENRICHED_LAYOUT } from '../engine/layoutData.js';

export const Keycap = memo(function Keycap({
  keyConfig,
  activeLayer = 'normal',
  isPressed = false,
  isTarget = false,
  isModifierRequired = false,
  isDisabled = false,
  onClick,
  showFingerColors = true,
}) {
  const { code, width = 1.0, label, bump, finger: explicitFinger } = keyConfig;
  const layoutDef = ENRICHED_LAYOUT[code];

  const fingerCode = layoutDef?.finger || explicitFinger || 'TH';
  const fingerInfo = FINGER_INFO[fingerCode] || FINGER_INFO.TH;
  // Extract layer outputs
  const normalOut = layoutDef?.layers?.normal?.displayLabel || '';
  const shiftOut = layoutDef?.layers?.shift?.displayLabel || '';
  const altgrOut = layoutDef?.layers?.altgr?.displayLabel || '';
  const altgrShiftOut = layoutDef?.layers?.altgrShift?.displayLabel || '';
  const latinLegend = layoutDef?.latin || label || '';

  let centerLabel = normalOut;
  if (activeLayer === 'shift' && shiftOut) {
    centerLabel = shiftOut;
  } else if (activeLayer === 'altgr' && altgrOut) {
    centerLabel = altgrOut;
  } else if (activeLayer === 'altgrShift' && altgrShiftOut) {
    centerLabel = altgrShiftOut;
  }

  let stateClasses =
    'bg-white/[0.04] hover:bg-white/[0.08] text-slate-100 border-white/[0.09] hover:border-white/[0.2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.2),0_6px_16px_rgba(0,0,0,0.45)] hover:-translate-y-0.5';

  if (isDisabled) {
    stateClasses =
      'bg-white/[0.01] text-slate-600 border-white/[0.03] cursor-not-allowed opacity-40';
  } else if (isPressed) {
    stateClasses =
      'bg-amber-500/30 text-amber-200 border-amber-400/80 translate-y-0.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.35)] ring-1 ring-amber-400';
  } else if (isTarget) {
    stateClasses =
      'bg-emerald-500/25 text-emerald-100 border-emerald-400 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.3),0_0_24px_hsl(var(--success)/0.45)] ring-2 ring-emerald-400/90 animate-pulse';
  } else if (isModifierRequired) {
    stateClasses =
      'bg-white/15 text-white border-white/60 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.25),0_0_20px_rgba(255,255,255,0.25)] ring-2 ring-white/70 animate-pulse';
  }

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(code)}
      style={{
        flexGrow: width,
        flexShrink: 0,
        flexBasis: 0,
        borderBottomColor: showFingerColors && !isPressed ? fingerInfo.color : undefined,
        borderBottomWidth: showFingerColors ? '2.5px' : '1px',
      }}
      className={`relative select-none h-14 md:h-16 rounded-xl border backdrop-blur-md transition-all duration-150 flex flex-col justify-between p-1 md:p-1.5 focus:outline-none cursor-pointer ${stateClasses}`}
      title={`${code} (${fingerInfo.name})`}
    >
      <div className="flex justify-between items-start w-full text-[10px] md:text-xs leading-none">
        <span className="font-bangla text-slate-400 font-semibold truncate max-w-[50%]">
          {shiftOut}
        </span>
        {altgrShiftOut && (
          <span className="font-bangla text-zinc-400 text-[9px] md:text-[10px] leading-none">
            {altgrShiftOut}
          </span>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center -my-1">
        {centerLabel ? (
          <span className="font-bangla text-base md:text-xl font-bold tracking-normal drop-shadow">
            {centerLabel}
          </span>
        ) : (
          <span className="text-[11px] md:text-xs text-slate-400 font-medium font-display">
            {label || code}
          </span>
        )}
      </div>

      <div className="flex justify-between items-end w-full text-[9px] md:text-[11px] leading-none">
        <span className="font-mono text-slate-400/80 font-medium uppercase">
          {latinLegend}
        </span>
        <span className="font-bangla text-zinc-300 text-[10px] md:text-xs font-semibold">
          {altgrOut}
        </span>
      </div>

      {bump && <div className="keycap-bump" />}
    </button>
  );
});
