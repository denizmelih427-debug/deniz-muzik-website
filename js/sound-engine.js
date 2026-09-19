/**
 * Deniz Müzik - Web Audio API Enstrüman Ses Motoru
 * Kullanıcıların enstrümanların ton karakterini anında dinlemesini sağlar.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(type) {
    try {
      this.init();
      switch (type) {
        case 'acoustic-guitar':
          this.playAcousticGuitar();
          break;
        case 'electric-guitar':
          this.playElectricGuitar();
          break;
        case 'piano':
          this.playGrandPiano();
          break;
        case 'violin':
          this.playViolin();
          break;
        case 'baglama':
          this.playBaglama();
          break;
        case 'percussion':
          this.playDarbuka();
          break;
        default:
          this.playAcousticGuitar();
      }
    } catch (e) {
      console.warn("Audio playback not permitted or not supported yet:", e);
    }
  }

  // Akustik Gitar - Arpejli Akor & Tınlama
  playAcousticGuitar() {
    const notes = [164.81, 220.00, 293.66, 392.00, 493.88, 659.25]; // E-A-D-G-B-E
    const now = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      const delay = index * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);

      // Lowpass filter for acoustic wood warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2500, now + delay);
      filter.frequency.exponentialRampToValueAtTime(800, now + delay + 1.6);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.18, now + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 2.1);
    });
  }

  // Elektro Gitar - Overdrive & Zengin Harmonikler
  playElectricGuitar() {
    const notes = [110, 164.81, 220, 277.18]; // A power chord
    const now = this.ctx.currentTime;

    // Distortion curve
    const waveShaper = this.ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      let x = (i * 2) / 256 - 1;
      curve[i] = ((Math.PI + 4) * x) / (Math.PI + 4 * Math.abs(x));
    }
    waveShaper.curve = curve;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    waveShaper.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    notes.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 2.2);

      osc.connect(filter);
      filter.connect(waveShaper);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  // Piyano - Grand Piano Akoru & Çan benzeri rezonans
  playGrandPiano() {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C major 7 chord
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const delay = idx * 0.04;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, now + delay);
      osc2.frequency.setValueAtTime(freq * 2, now + delay); // harmonic overtone

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.2, now + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now + delay);
      osc2.start(now + delay);
      osc1.stop(now + delay + 3.0);
      osc2.stop(now + delay + 3.0);
    });
  }

  // Keman - Yaylı Titreşimi ve Vibrato
  playViolin() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now); // A4 Concert pitch

    // Vibrato LFO
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5.5, now); // 5.5 Hz vibrato
    lfoGain.gain.setValueAtTime(6.0, now); // pitch variance

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // Warm violin body resonance
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(2.0, now);

    // Attack envelope (slow bow stroke)
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.35);
    gain.gain.setValueAtTime(0.20, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 2.6);
    osc.stop(now + 2.6);
  }

  // Bağlama - Anadolu Tınısı & Tezene Vuruşu
  playBaglama() {
    // Mini melodic riff in traditional mode
    const notes = [293.66, 329.63, 369.99, 440.00, 392.00, 329.63, 293.66]; // Re - Mi - Fa# - La - Sol - Mi - Re
    const now = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      const t = now + index * 0.16;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Sharp tezene pluck tone
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, t);
      filter.frequency.exponentialRampToValueAtTime(700, t + 0.3);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  // Darbuka - Düm ve Tek Vuruşları
  playDarbuka() {
    const now = this.ctx.currentTime;

    // Düm (Deep bass resonance)
    const dumOsc = this.ctx.createOscillator();
    const dumGain = this.ctx.createGain();
    dumOsc.type = 'sine';
    dumOsc.frequency.setValueAtTime(140, now);
    dumOsc.frequency.exponentialRampToValueAtTime(55, now + 0.25);
    dumGain.gain.setValueAtTime(0.35, now);
    dumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    dumOsc.connect(dumGain);
    dumGain.connect(this.ctx.destination);
    dumOsc.start(now);
    dumOsc.stop(now + 0.5);

    // Tek 1 (Sharp high rim sound)
    const t1 = now + 0.28;
    const tek1Osc = this.ctx.createOscillator();
    const tek1Gain = this.ctx.createGain();
    tek1Osc.type = 'triangle';
    tek1Osc.frequency.setValueAtTime(680, t1);
    tek1Osc.frequency.exponentialRampToValueAtTime(320, t1 + 0.1);
    tek1Gain.gain.setValueAtTime(0.2, t1);
    tek1Gain.gain.exponentialRampToValueAtTime(0.001, t1 + 0.18);

    tek1Osc.connect(tek1Gain);
    tek1Gain.connect(this.ctx.destination);
    tek1Osc.start(t1);
    tek1Osc.stop(t1 + 0.2);

    // Tek 2
    const t2 = now + 0.52;
    const tek2Osc = this.ctx.createOscillator();
    const tek2Gain = this.ctx.createGain();
    tek2Osc.type = 'triangle';
    tek2Osc.frequency.setValueAtTime(740, t2);
    tek2Osc.frequency.exponentialRampToValueAtTime(350, t2 + 0.1);
    tek2Gain.gain.setValueAtTime(0.22, t2);
    tek2Gain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.18);

    tek2Osc.connect(tek2Gain);
    tek2Gain.connect(this.ctx.destination);
    tek2Osc.start(t2);
    tek2Osc.stop(t2 + 0.2);
  }
}

window.soundEngine = new SoundEngine();
