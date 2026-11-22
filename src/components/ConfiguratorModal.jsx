import React from 'react';
import { X, Check } from 'lucide-react';

const COLOR_OPTIONS = [
  { id: 'rosso-corsa', name: 'Rosso Corsa', hex: '#d90429' },
  { id: 'giallo-modena', name: 'Giallo Modena', hex: '#eab308' },
  { id: 'nero-daytona', name: 'Nero Daytona', hex: '#18181b' },
  { id: 'bianco-avus', name: 'Bianco Avus', hex: '#e2e8f0' },
  { id: 'blu-tour-de-france', name: 'Blu Tour de France', hex: '#1d4ed8' },
  { id: 'argento-nurburgring', name: 'Argento Nürburgring', hex: '#94a3b8' },
];

export function ConfiguratorModal({
  isOpen,
  onClose,
  currentColor,
  setCurrentColor,
  currentFinish,
  setCurrentFinish,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-lg glass-panel-light rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-5">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#0f172a]">
              Scuderia Atelier
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5 font-medium">
              Exterior Paintwork &amp; Finish Specification
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#475569] hover:text-[#0f172a] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Color Palette Grid */}
        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#64748b] block mb-3">
            Select Exterior Paint
          </label>
          <div className="grid grid-cols-3 gap-3">
            {COLOR_OPTIONS.map((opt) => {
              const isSelected = currentColor.toLowerCase() === opt.hex.toLowerCase();
              return (
                <button
                  key={opt.id}
                  onClick={() => setCurrentColor(opt.hex)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all text-left ${
                    isSelected
                      ? 'border-[#0f172a] bg-black/5 shadow-sm'
                      : 'border-black/5 hover:border-black/15 bg-white/50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full border border-black/10 shadow-inner flex items-center justify-center transition-transform hover:scale-105"
                    style={{ backgroundColor: opt.hex }}
                  >
                    {isSelected && <Check size={16} className="text-white drop-shadow" />}
                  </div>
                  <span className="text-[11px] font-semibold text-[#0f172a] text-center leading-tight">
                    {opt.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clearcoat / Finish Options */}
        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#64748b] block mb-3">
            Surface Finish
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'gloss', label: 'High-Gloss Mirror Finish' },
              { id: 'satin', label: 'Satin Silk Sheen' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCurrentFinish(f.id)}
                className={`py-3 px-4 rounded-xl text-xs font-semibold tracking-wider transition-all border ${
                  currentFinish === f.id
                    ? 'bg-[#0f172a] text-white border-[#0f172a]'
                    : 'bg-white/60 text-[#475569] border-black/10 hover:border-black/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-black/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#0f172a] text-white hover:bg-[#1e293b] text-xs font-semibold tracking-wider uppercase transition-all shadow-md"
          >
            Apply &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
}
