import { useCallback, useEffect, useRef } from "react";
import type { DesignColor } from "@/lib/afrostate/config";

const ROW = 104; // row height in px
const RADIUS = ROW * 2.2; // drum radius — smaller means a tighter curve
const STEP = ROW / RADIUS; // angle between rows, in radians
const EDGE = Math.PI / 2; // rows past 90° are behind the drum

/**
 * iOS time-picker style vertical wheel. Native scrolling + scroll-snap does the
 * physics; every frame each row is placed on a virtual cylinder.
 */
export function ColorWheel({ colors, value, onChange, label }: { colors: DesignColor[]; value: number; onChange: (index: number) => void; label: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const frame = useRef(0);
  const current = useRef(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const paint = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const position = el.scrollTop / ROW;
    rows.current.forEach((row, i) => {
      if (!row) return;
      const angle = (i - position) * STEP;
      if (Math.abs(angle) >= EDGE) { row.style.visibility = "hidden"; return; }
      const offset = (i - position) * ROW;
      row.style.visibility = "visible";
      row.style.transform = `translate3d(0,${RADIUS * Math.sin(angle) - offset}px,${RADIUS * (Math.cos(angle) - 1)}px) rotateX(${-angle}rad)`;
      row.style.opacity = String(1 - (Math.abs(angle) / EDGE) * 0.8);
    });
    const index = Math.min(colors.length - 1, Math.max(0, Math.round(position)));
    if (index !== current.current) {
      current.current = index;
      onChangeRef.current(index);
    }
  }, [colors.length]);

  // Pad the list so the first and last rows can reach the centre line, then jump to the current value.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const fit = () => {
      const pad = Math.max(0, (el.clientHeight - ROW) / 2);
      el.style.paddingBlock = `${pad}px`;
      el.scrollTop = current.current * ROW;
      paint();
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame.current); };
  }, [paint]);

  function onScroll() {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(paint);
  }

  function go(index: number) {
    const el = scroller.current;
    if (!el) return;
    const clamped = Math.min(colors.length - 1, Math.max(0, index));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: clamped * ROW, behavior: reduce ? "auto" : "smooth" });
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const moves: Record<string, number> = { ArrowDown: value + 1, ArrowUp: value - 1, Home: 0, End: colors.length - 1 };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    go(target);
  }

  return (
    <div className="relative h-full min-h-0 select-none">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 border-y-2 border-foreground bg-primary" style={{ height: ROW }} />
      <div
        ref={scroller}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`wheel-option-${value}`}
        className="color-wheel absolute inset-0 snap-y snap-mandatory overflow-y-scroll overscroll-contain outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        {colors.map((color, i) => (
          <div key={`${color.name}-${i}`} className="snap-center [transform-style:preserve-3d]" style={{ height: ROW }}>
            <div
              ref={(node) => { rows.current[i] = node; }}
              id={`wheel-option-${i}`}
              role="option"
              aria-selected={i === value}
              onClick={() => go(i)}
              className="flex h-full cursor-pointer items-center gap-4 px-4 [backface-visibility:hidden] will-change-transform md:px-6"
            >
              <img src={color.image} alt="" draggable={false} className="h-[84px] w-[68px] shrink-0 border-2 border-foreground bg-muted object-cover" />
              <span className="min-w-0 flex-1 truncate font-display text-3xl uppercase leading-none md:text-4xl">{color.name}</span>
              <span className="size-5 shrink-0 rounded-full border-2 border-foreground" style={{ background: color.swatch }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
