import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function OverlaySections({ scrollProgress, onOpenOrder }) {
  const p = scrollProgress;

  const getChapterState = (tIn, tHold, tOut) => {
    const rise = Math.max((tHold - tIn) * 0.4, 0.008);
    const fall = Math.max((tOut - tHold) * 0.6, 0.008);
    let opacity = 0;
    if (p >= tIn && p <= tOut) {
      opacity = Math.min((p - tIn) / rise, 1) * Math.min((tOut - p) / fall, 1);
      opacity = Math.min(Math.max(opacity, 0), 1);
    }
    const drift = (p - tHold) * -25;
    return {
      opacity,
      transform: `translateY(${drift}px)`,
      pointerEvents: opacity > 0.3 ? 'auto' : 'none',
      visibility: opacity > 0.01 ? 'visible' : 'hidden',
    };
  };

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
      
      {/* ── CHAPTER 1: HERO (0.00 -> 0.12) ── */}
      <div
        style={getChapterState(-0.05, 0.04, 0.12)}
        className="absolute left-8 md:left-16 bottom-12 max-w-xl transition-all duration-300"
      >
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
            SPECIFICATION
          </span>
          <span className="h-2 w-[1px] bg-white/20" />
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#ff3b7e]">
            RUBY STAR NEO
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-light tracking-wide text-white uppercase leading-tight drop-shadow-md">
          Pure Mid-Engine Balance
        </h1>
        <div className="mt-3 flex items-center gap-4">
          <span className="text-xs font-mono text-white/70">MSRP from $74,800</span>
          <button
            onClick={onOpenOrder}
            className="flex items-center gap-1.5 text-xs font-mono text-[#ff3b7e] hover:text-[#ff5b94] tracking-wider uppercase underline underline-offset-4 pointer-events-auto"
          >
            <span>Reserve Build Slot</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* ── CHAPTER 2: WHEELS (0.165 -> 0.28) ── */}
      <div
        style={getChapterState(0.165, 0.22, 0.28)}
        className="absolute left-8 md:left-16 bottom-12 max-w-md transition-all duration-300"
      >
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
            CHAPTER 02
          </span>
          <span className="h-2 w-[1px] bg-white/20" />
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
            CHASSIS &amp; STANCE
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-light uppercase text-white tracking-wide drop-shadow-md">
          20" High-Gloss Spyder Alloys
        </h2>
        <div className="h-[1px] w-12 bg-white/20 my-2.5" />
        <p className="text-xs text-white/60 font-light leading-relaxed drop-shadow">
          High-gloss black contrast package with colored Porsche crest center caps and PASM sport suspension lowered by 10mm.
        </p>
      </div>

      {/* ── CHAPTER 3: DUAL TAILPIPES (0.33 -> 0.45) ── */}
      <div
        style={getChapterState(0.33, 0.39, 0.45)}
        className="absolute right-8 md:right-16 bottom-12 max-w-md text-right transition-all duration-300"
      >
        <div className="flex items-center justify-end gap-2 mb-2.5">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
            CHAPTER 03
          </span>
          <span className="h-2 w-[1px] bg-white/20" />
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
            PROPULSION
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-light uppercase text-white tracking-wide drop-shadow-md">
          Central Dual Sport Exhaust
        </h2>
        <div className="h-[1px] w-12 bg-white/20 my-2.5 ml-auto" />
        <p className="text-xs text-white/60 font-light leading-relaxed drop-shadow">
          Finished in high-gloss black, producing an unmistakable boxer acoustic signature under gleaming silver PORSCHE lettering.
        </p>
      </div>

      {/* ── CHAPTER 4: STITCHED CABIN (0.495 -> 0.62) ── */}
      <div
        style={getChapterState(0.495, 0.56, 0.62)}
        className="absolute left-8 md:left-16 bottom-12 max-w-md transition-all duration-300"
      >
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
            CHAPTER 04
          </span>
          <span className="h-2 w-[1px] bg-white/20" />
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
            COCKPIT
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-light uppercase text-white tracking-wide drop-shadow-md">
          Bespoke Leather Interior
        </h2>
        <div className="h-[1px] w-12 bg-white/20 my-2.5" />
        <p className="text-xs text-white/60 font-light leading-relaxed drop-shadow">
          Luxurious black leather architecture accented by contrast chalk stitching and the Porsche Crest embossed on the headrests.
        </p>
      </div>

      {/* ── CHAPTER 5: RUBY STAR SILHOUETTE (0.66 -> 0.78) ── */}
      <div
        style={getChapterState(0.66, 0.72, 0.78)}
        className="absolute right-8 md:right-16 bottom-12 max-w-md text-right transition-all duration-300"
      >
        <div className="flex items-center justify-end gap-2 mb-2.5">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
            CHAPTER 05
          </span>
          <span className="h-2 w-[1px] bg-white/20" />
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
            AERODYNAMICS
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-light uppercase text-white tracking-wide drop-shadow-md">
          Ruby Star Neo Heritage
        </h2>
        <div className="h-[1px] w-12 bg-white/20 my-2.5 ml-auto" />
        <p className="text-xs text-white/60 font-light leading-relaxed drop-shadow">
          A bold tribute to the historic 964 Carrera RS shade. Purity in motion, carving curves with mid-engined agility.
        </p>
      </div>

      {/* ── CHAPTER 6: REVEAL & DIRECT ALLOCATION (0.825 -> 1.00) ── */}
      <div
        style={getChapterState(0.825, 0.92, 1.05)}
        className="absolute left-1/2 -translate-x-1/2 bottom-8 text-center w-full max-w-xl px-6 transition-all duration-300"
      >
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/50">
            PRODUCTION RUN 2026 • LIMITED ALLOCATION
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-light text-white uppercase tracking-wider drop-shadow-lg">
          718 Cayman Style Edition
        </h1>
        <p className="mt-1 text-xs text-white/70 font-light drop-shadow">
          Delivery starting Q3 2026. Secured through Porsche Financial Services.
        </p>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={onOpenOrder}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#ff3b7e] hover:bg-[#ff5b94] text-white text-[11px] font-mono font-bold tracking-[0.18em] uppercase transition-all shadow-[0_0_25px_rgba(255,59,126,0.5)] hover:scale-105 active:scale-95 pointer-events-auto"
          >
            <ShoppingBag size={13} />
            <span>Apply For Allocation</span>
          </button>
          
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-5 py-2 rounded-full border border-white/20 hover:border-white bg-black/40 hover:bg-white text-white hover:text-black text-[10px] font-mono tracking-[0.2em] uppercase transition-all backdrop-blur-md pointer-events-auto"
          >
            Back to Top ↑
          </button>
        </div>
      </div>

    </div>
  );
}
