// Web Audio API pure synthesizer for sleep neuromodulation & binaural beats
// 100% offline, zero latency, no external assets needed

class SleepAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Binaural Beat Oscillators
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;

  // Noise Generators
  private noiseNode: AudioNode | null = null;
  private noiseGain: GainNode | null = null;

  // Solfeggio / Ambient Tone
  private toneOsc: OscillatorNode | null = null;
  private toneGain: GainNode | null = null;

  // Ambient Ocean/Rain LFO
  private lfoOsc: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  public isPlaying: boolean = false;
  public currentMode: string = 'none';

  private initContext() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch((e) => console.warn('AudioContext resume was prevented:', e));
      }
    } catch (err) {
      console.warn('Web Audio API is not accessible in this context:', err);
    }
  }

  public setMasterVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  // 1. Play Binaural Beats with Stereo Panning
  public startBinauralBeats(baseFreq: number = 200, beatFreq: number = 2.5, volume: number = 0.4) {
    this.stopAll();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentMode = `binaural-${beatFreq}hz`;
    this.isPlaying = true;

    // Create Left & Right Channels
    const merger = this.ctx.createChannelMerger(2);
    this.binauralGain = this.ctx.createGain();
    this.binauralGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.binauralGain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + 1.5);

    // Left Ear: baseFreq
    this.leftOsc = this.ctx.createOscillator();
    this.leftOsc.type = 'sine';
    this.leftOsc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    this.leftOsc.connect(merger, 0, 0);

    // Right Ear: baseFreq + beatFreq
    this.rightOsc = this.ctx.createOscillator();
    this.rightOsc.type = 'sine';
    this.rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);
    this.rightOsc.connect(merger, 0, 1);

    merger.connect(this.binauralGain);
    this.binauralGain.connect(this.masterGain);

    this.leftOsc.start();
    this.rightOsc.start();
  }

  // 2. Pure Pink / Brown Noise Generation
  public startNoise(type: 'brown' | 'pink' | 'ocean' | 'rain', volume: number = 0.35) {
    this.stopAll();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentMode = `noise-${type}`;
    this.isPlaying = true;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'brown' || type === 'ocean') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }
    } else if (type === 'pink' || type === 'rain') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.filterNode = this.ctx.createBiquadFilter();
    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.noiseGain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + 1.0);

    if (type === 'brown') {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(380, this.ctx.currentTime);
    } else if (type === 'pink') {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(1200, this.ctx.currentTime);
    } else if (type === 'ocean') {
      // Modulate filter for wave swooshes
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(350, this.ctx.currentTime);
      
      this.lfoOsc = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.lfoOsc.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec wave period
      lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
      this.lfoOsc.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);
      this.lfoOsc.start();
    } else if (type === 'rain') {
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.setValueAtTime(800, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(0.8, this.ctx.currentTime);
    }

    whiteNoise.connect(this.filterNode);
    this.filterNode.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);

    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  // 3. Solfeggio Harmonic Tone (432Hz / 528Hz)
  public startSolfeggio(freq: number = 432, volume: number = 0.3) {
    this.stopAll();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentMode = `solfeggio-${freq}`;
    this.isPlaying = true;

    this.toneOsc = this.ctx.createOscillator();
    this.toneGain = this.ctx.createGain();

    this.toneOsc.type = 'sine';
    this.toneOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    this.toneGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.toneGain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + 1.2);

    this.toneOsc.connect(this.toneGain);
    this.toneGain.connect(this.masterGain);

    this.toneOsc.start();
  }

  // 4. Play gentle breathwork cue chime
  public playChime(pitch: 'inhale' | 'hold' | 'exhale') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freqMap = {
      inhale: 528, // C-5 sharp solfeggio
      hold: 660,   // E-5
      exhale: 396  // G-4 grounding
    };

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqMap[pitch], this.ctx.currentTime);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.0);
  }

  public stopAll() {
    if (this.ctx) {
      if (this.leftOsc) {
        try { this.leftOsc.stop(); } catch {}
        this.leftOsc.disconnect();
        this.leftOsc = null;
      }
      if (this.rightOsc) {
        try { this.rightOsc.stop(); } catch {}
        this.rightOsc.disconnect();
        this.rightOsc = null;
      }
      if (this.noiseNode) {
        try { (this.noiseNode as AudioBufferSourceNode).stop(); } catch {}
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.toneOsc) {
        try { this.toneOsc.stop(); } catch {}
        this.toneOsc.disconnect();
        this.toneOsc = null;
      }
      if (this.lfoOsc) {
        try { this.lfoOsc.stop(); } catch {}
        this.lfoOsc.disconnect();
        this.lfoOsc = null;
      }
    }
    this.isPlaying = false;
    this.currentMode = 'none';
  }
}

export const sleepAudio = new SleepAudioEngine();
