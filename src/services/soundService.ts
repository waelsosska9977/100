// Web Audio API synthesized sounds (no external audio assets required)

class SoundService {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      const saved = localStorage.getItem('sosska_sound_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    } catch {
      this.enabled = true;
    }
  }

  private initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem('sosska_sound_enabled', String(this.enabled));
    } catch {
      // ignore
    }
    if (this.enabled) {
      this.playChime(880, 0.08);
    }
    return this.enabled;
  }

  public playSignalAlert(type: 'LONG' | 'SHORT') {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      gainNode.connect(this.audioCtx.destination);

      if (type === 'LONG') {
        // Upward bullish chime
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        osc2.frequency.setValueAtTime(739.99, now + 0.08); // F#5
        osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.25); // D6
      } else {
        // Downward bearish chime
        osc1.frequency.setValueAtTime(880, now);
        osc1.frequency.exponentialRampToValueAtTime(587.33, now + 0.15);
        osc2.frequency.setValueAtTime(698.46, now + 0.08);
        osc2.frequency.exponentialRampToValueAtTime(440, now + 0.25);
      }

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gainNode);
      osc2.connect(gainNode);

      osc1.start(now);
      osc2.start(now + 0.06);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch {
      // Audio playback fails silently if browser blocks
    }
  }

  public playChime(freq = 660, duration = 0.1) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // ignore
    }
  }
}

export const soundService = new SoundService();
