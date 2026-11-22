import React from 'react';
import { Volume2, VolumeX, ShoppingBag } from 'lucide-react';
import { engineAudio } from '../utils/engineAudio';

export function Navigation({ soundEnabled, setSoundEnabled, onOpenConfigurator, onOpenOrder }) {
  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      engineAudio.start();
    } else {
      engineAudio.stop();
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 md:px-16 py-7 pointer-events-auto">
      {/* Brand & Model Identity */}
      <div className="flex items-center gap-3">
        <span className="font-extrabold tracking-[0.3em] text-sm text-white uppercase select-none">
          PORSCHE
        </span>
        <span className="h-3 w-[1px] bg-white/20 mx-1" />
        <span className="text-[11px] font-mono tracking-[0.2em] text-white/50 uppercase select-none">
          718 CAYMAN
        </span>
      </div>

      {/* Luxury Controls & Order Action */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all text-[11px] font-mono tracking-wider backdrop-blur-md ${
            soundEnabled
              ? 'border-[#ff3b7e]/50 bg-[#ff3b7e]/15 text-[#ff3b7e] shadow-[0_0_15px_rgba(255,59,126,0.25)]'
              : 'border-white/10 hover:border-white/25 bg-black/20 text-white/50 hover:text-white'
          }`}
          aria-label="Toggle Engine Acoustics"
        >
          {soundEnabled ? (
            <>
              <Volume2 size={13} className="text-[#ff3b7e] animate-pulse" />
              <span className="hidden sm:inline font-semibold">BOXER SOUND ON</span>
            </>
          ) : (
            <>
              <VolumeX size={13} className="text-white/40" />
              <span className="hidden sm:inline">MUTE</span>
            </>
          )}
        </button>

        {/* Atelier Configurator */}
        <button
          onClick={onOpenConfigurator}
          className="hidden sm:block px-4 py-1.5 rounded-full border border-white/20 hover:border-white bg-white/5 hover:bg-white text-white hover:text-black transition-all text-[11px] font-mono tracking-[0.15em] uppercase backdrop-blur-md"
        >
          Configure
        </button>

        {/* Direct Purchase / Commission Button */}
        <button
          onClick={onOpenOrder}
          className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#ff3b7e] hover:bg-[#ff5b94] text-white text-[11px] font-mono font-bold tracking-[0.18em] uppercase transition-all shadow-[0_0_20px_rgba(255,59,126,0.35)] hover:shadow-[0_0_25px_rgba(255,59,126,0.6)] hover:scale-105 active:scale-95"
        >
          <ShoppingBag size={12} />
          <span>Apply For Allocation</span>
        </button>
      </div>
    </header>
  );
}
