/**
 * Viewport-driven presentation scale for boardroom / projector displays.
 *
 * Baseline: 1280px-wide “board pack” composition.
 * scale = clamp(width / 1280, 1, 1.35), with mild height blend and a
 * presentation-mode bias. Phones/tablets (<1024px) stay at 1 so stacked
 * responsive layouts are not zoomed.
 */

export const PRESENTATION_BASE_WIDTH = 1280;
export const PRESENTATION_BASE_HEIGHT = 800;
export const PRESENTATION_MIN_SCALE = 1;
export const PRESENTATION_MAX_SCALE = 1.35;
/** Below this width, keep stacked responsive layout at scale 1. */
export const PRESENTATION_SCALE_MIN_WIDTH = 1024;

const INLINE_APPLY = `function tfApplyPresentationScale(){var w=window.innerWidth,h=window.innerHeight,minW=1024,baseW=1280,baseH=800,minS=1,maxS=1.35,s=1;if(w>=minW){s=w/baseW;var hf=Math.min(1.08,Math.max(0.92,h/baseH));s=s*(0.88+0.12*hf);try{if(window.matchMedia("(display-mode:fullscreen)").matches||window.matchMedia("(display-mode:standalone)").matches||(w>=1600&&Math.min(w,h)>=900))s*=1.04}catch(e){}s=Math.min(maxS,Math.max(minS,Math.round(s*1000)/1000))}var r=document.documentElement;r.style.setProperty("--ui-scale",String(s));r.style.fontSize=(s*100).toFixed(3)+"%";r.setAttribute("data-presentation-scale",s>1.02?"active":"baseline")}`;

/** Inline snippet for `<head>` — runs before first paint to avoid FOUC. */
export const PRESENTATION_SCALE_INLINE_SCRIPT = `(function(){${INLINE_APPLY};tfApplyPresentationScale();var t;window.addEventListener("resize",function(){clearTimeout(t);t=setTimeout(tfApplyPresentationScale,100)});window.addEventListener("orientationchange",function(){tfApplyPresentationScale()});try{window.matchMedia("(display-mode:fullscreen)").addEventListener("change",tfApplyPresentationScale)}catch(e){}})();`;

export function computePresentationScale(
  width = typeof window !== "undefined" ? window.innerWidth : PRESENTATION_BASE_WIDTH,
  height = typeof window !== "undefined" ? window.innerHeight : PRESENTATION_BASE_HEIGHT,
): number {
  if (width < PRESENTATION_SCALE_MIN_WIDTH) return PRESENTATION_MIN_SCALE;

  let scale = width / PRESENTATION_BASE_WIDTH;
  const heightFactor = Math.min(1.08, Math.max(0.92, height / PRESENTATION_BASE_HEIGHT));
  scale = scale * (0.88 + 0.12 * heightFactor);

  if (typeof window !== "undefined") {
    try {
      const presentation =
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.matchMedia("(display-mode: standalone)").matches ||
        (width >= 1600 && Math.min(width, height) >= 900);
      if (presentation) scale *= 1.04;
    } catch {
      /* matchMedia unavailable */
    }
  }

  return Math.min(
    PRESENTATION_MAX_SCALE,
    Math.max(PRESENTATION_MIN_SCALE, Math.round(scale * 1000) / 1000),
  );
}

export function applyPresentationScale(): number {
  const scale = computePresentationScale();
  if (typeof document === "undefined") return scale;
  const root = document.documentElement;
  root.style.setProperty("--ui-scale", String(scale));
  root.style.fontSize = `${(scale * 100).toFixed(3)}%`;
  root.setAttribute("data-presentation-scale", scale > 1.02 ? "active" : "baseline");
  return scale;
}

/** Debounced resize / orientation / display-mode listeners. Returns cleanup. */
export function bindPresentationScale(debounceMs = 100): () => void {
  const run = () => applyPresentationScale();
  run();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => {
    clearTimeout(timer);
    timer = setTimeout(run, debounceMs);
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", run);
  const mqs: MediaQueryList[] = [];
  try {
    for (const q of ["(display-mode: fullscreen)", "(display-mode: standalone)"]) {
      const mq = window.matchMedia(q);
      mq.addEventListener("change", run);
      mqs.push(mq);
    }
  } catch {
    /* ignore */
  }
  return () => {
    clearTimeout(timer);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", run);
    for (const mq of mqs) mq.removeEventListener("change", run);
  };
}
