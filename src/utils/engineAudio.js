/**
 * Procedural Porsche 718 Boxer Engine Sound Synthesizer
 * Built with Web Audio API (Native browser audio, zero external file dependencies).
 * Generates an authentic low-frequency 4-cylinder boxer rumble and rev harmonics.
 */
class EngineAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.osc1 = null;
    this.osc2 = null;
    this.subOsc = null;
    this.gainNode = null;
    this.filterNode = null;
    this.isPlaying = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Volume Gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

    // Lowpass Exhaust Filter
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(4, this.ctx.currentTime);

    // Primary Boxer-4 Tone (Sawtooth)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(45, this.ctx.currentTime); // Low idle rumble

    // Secondary Detuned Harmonic (Triangle)
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(46.2, this.ctx.currentTime);

    // Sub-Bass Exhaust Tone
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(22.5, this.ctx.currentTime);

    // Wire routing
    this.osc1.connect(this.filterNode);
    this.osc2.connect(this.filterNode);
    this.subOsc.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.osc1.start();
    this.osc2.start();
    this.subOsc.start();
  }

  start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const t = this.ctx.currentTime;
    // Smooth fade in
    this.gainNode.gain.cancelScheduledValues(t);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, t);
    this.gainNode.gain.linearRampToValueAtTime(0.12, t + 0.5);
    this.isPlaying = true;
  }

  stop() {
    if (!this.ctx || !this.isPlaying) return;
    const t = this.ctx.currentTime;
    this.gainNode.gain.cancelScheduledValues(t);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, t);
    this.gainNode.gain.linearRampToValueAtTime(0.0001, t + 0.4);
    this.isPlaying = false;
  }

  // Modulate RPM based on scroll velocity / progress
  setRPM(factor = 0) {
    if (!this.ctx || !this.isPlaying) return;
    const baseFreq = 42 + factor * 60; // 42Hz to 102Hz rev
    const t = this.ctx.currentTime;
    this.osc1.frequency.setTargetAtTime(baseFreq, t, 0.1);
    this.osc2.frequency.setTargetAtTime(baseFreq * 1.02, t, 0.1);
    this.filterNode.frequency.setTargetAtTime(320 + factor * 400, t, 0.1);
  }
}

export const engineAudio = new EngineAudioSynthesizer();

