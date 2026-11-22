import React, { useState } from 'react';
import { X, CheckCircle, Shield, Calendar, CreditCard, ChevronRight } from 'lucide-react';

export function OrderModal({ isOpen, onClose }) {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryLocation: 'New York, US',
    paymentPreference: 'wire', // wire | lease | crypto
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto">
      <div className="relative w-full max-w-xl bg-[#0e0c0f] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Glow backdrop accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d23b6f]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          <X size={18} />
        </button>

        {step === 'form' ? (
          <div>
            {/* Header */}
            <div className="mb-8">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ff3b7e] block mb-1">
                ALLOCATION ENQUIRY // 2026 PRODUCTION RUN
              </span>
              <h3 className="text-2xl md:text-3xl font-light text-white uppercase tracking-wide">
                Commission Your Cayman
              </h3>
              <p className="text-xs text-white/50 mt-1.5 font-light">
                Base MSRP starting at <span className="text-white font-medium">$74,800 USD</span>. Reserve a build slot with official Porsche Center allocation.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/50 block mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maximilian Weber"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ff3b7e] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/50 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@atelier.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ff3b7e] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/50 block mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#ff3b7e] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/50 block mb-1.5">
                    Preferred Delivery Center
                  </label>
                  <select
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    className="w-full bg-[#18151a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff3b7e] transition-colors"
                  >
                    <option value="Porsche Experience Center Los Angeles">Porsche Experience Center Los Angeles</option>
                    <option value="Porsche Experience Center Atlanta">Porsche Experience Center Atlanta</option>
                    <option value="Porsche Center Zurich">Porsche Center Zurich</option>
                    <option value="Porsche Center London Mayfair">Porsche Center London Mayfair</option>
                    <option value="Factory Delivery (Zuffenhausen Germany)">Factory Delivery (Zuffenhausen Germany)</option>
                  </select>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-white/50 block mb-2">
                  Acquisition Structure
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wire', label: 'Direct Purchase / Wire' },
                    { id: 'lease', label: 'Porsche Premier Lease' },
                    { id: 'crypto', label: 'Crypto Escrow' },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setFormData({ ...formData, paymentPreference: m.id })}
                      className={`py-2 px-3 rounded-xl border text-[11px] font-mono tracking-wider transition-all ${
                        formData.paymentPreference === m.id
                          ? 'border-[#ff3b7e] bg-[#ff3b7e]/15 text-white'
                          : 'border-white/10 hover:border-white/25 bg-white/5 text-white/50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purchase Assurance Note */}
              <div className="flex items-center gap-2 pt-2 text-[10px] text-white/40 font-mono">
                <Shield size={12} className="text-[#ff3b7e]" />
                <span>Protected allocation slot with 100% refundable reservation deposit.</span>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#ff3b7e] hover:bg-[#ff5b94] text-white text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-[0_0_25px_rgba(255,59,126,0.5)] flex items-center justify-center gap-2"
                >
                  <span>Submit Commission Application</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#ff3b7e]/20 border border-[#ff3b7e] flex items-center justify-center mx-auto mb-6 text-[#ff3b7e]">
              <CheckCircle size={32} />
            </div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ff3b7e] block mb-2">
              APPLICATION CONFIRMED // ID: #PO-718-{Math.floor(1000 + Math.random() * 9000)}
            </span>
            <h3 className="text-2xl md:text-3xl font-light text-white uppercase tracking-wide">
              Allocation Reserved
            </h3>
            <p className="mt-3 text-xs md:text-sm text-white/60 font-light max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-white font-medium">{formData.fullName}</span>. A dedicated Porsche Exclusive Manufaktur advisor will contact you within 24 hours regarding your build configuration and delivery timeline.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  setStep('form');
                  onClose();
                }}
                className="px-8 py-2.5 rounded-full border border-white/20 hover:border-white text-xs font-mono tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all"
              >
                Return to Vehicle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

