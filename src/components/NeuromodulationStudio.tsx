import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, Disc, Waves, 
  Wind, Moon, Sparkles, Sliders, Radio, RotateCcw, Clock,
  Activity, Zap
} from 'lucide-react';
import { sleepAudio } from '../utils/audioSynthesizer';

interface NeuromodulationStudioProps {
  isAudioPlaying: boolean;
  setIsAudioPlaying: (playing: boolean) => void;
}

type BreathingTechnique = '478' | 'box' | 'sigh';

export const NeuromodulationStudio: React.FC<NeuromodulationStudioProps> = ({
  isAudioPlaying,
  setIsAudioPlaying
}) => {
  // Acoustic Presets State
  const [selectedSoundMode, setSelectedSoundMode] = useState<'delta' | 'theta' | 'brown' | 'pink' | 'ocean' | 'solfeggio'>('delta');
  const [masterVolume, setMasterVolume] = useState<number>(0.65);
  const [binauralBeatHz, setBinauralBeatHz] = useState<number>(2.5); // 2.5 Hz Delta
  const [carrierHz, setCarrierHz] = useState<number>(196); // G3

  // Breathing Coach State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathTechnique, setBreathTechnique] = useState<BreathingTechnique>('478');
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);
  const [cycleCount, setCycleCount] = useState<number>(0);

  // NSDR Meditation Timer State
  const [nsdrActive, setNsdrActive] = useState<boolean>(false);
  const [nsdrRemainingSec, setNsdrRemainingSec] = useState<number>(600); // 10 minutes

  // Canvas Oscilloscope Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Synchronize master volume
  const handleVolumeChange = (v: number) => {
    setMasterVolume(v);
    sleepAudio.setMasterVolume(v);
  };

  // Play / Toggle selected audio preset
  const handleToggleSound = () => {
    if (isAudioPlaying) {
      sleepAudio.stopAll();
      setIsAudioPlaying(false);
    } else {
      if (selectedSoundMode === 'delta') {
        sleepAudio.startBinauralBeats(carrierHz, binauralBeatHz, masterVolume);
      } else if (selectedSoundMode === 'theta') {
        sleepAudio.startBinauralBeats(carrierHz, 6.0, masterVolume);
      } else if (selectedSoundMode === 'brown') {
        sleepAudio.startNoise('brown', masterVolume);
      } else if (selectedSoundMode === 'pink') {
        sleepAudio.startNoise('pink', masterVolume);
      } else if (selectedSoundMode === 'ocean') {
        sleepAudio.startNoise('ocean', masterVolume);
      } else if (selectedSoundMode === 'solfeggio') {
        sleepAudio.startSolfeggio(528, masterVolume);
      }
      setIsAudioPlaying(true);
    }
  };

  // Handle preset click
  const handleSelectPreset = (mode: 'delta' | 'theta' | 'brown' | 'pink' | 'ocean' | 'solfeggio') => {
    setSelectedSoundMode(mode);
    if (isAudioPlaying) {
      sleepAudio.stopAll();
      if (mode === 'delta') sleepAudio.startBinauralBeats(carrierHz, binauralBeatHz, masterVolume);
      else if (mode === 'theta') sleepAudio.startBinauralBeats(carrierHz, 6.0, masterVolume);
      else if (mode === 'brown') sleepAudio.startNoise('brown', masterVolume);
      else if (mode === 'pink') sleepAudio.startNoise('pink', masterVolume);
      else if (mode === 'ocean') sleepAudio.startNoise('ocean', masterVolume);
      else if (mode === 'solfeggio') sleepAudio.startSolfeggio(528, masterVolume);
    }
  };

  // Canvas Oscilloscope Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = '#1E293B33';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (isAudioPlaying) {
        phase += 0.05;
        const amplitude = (height / 3.5) * masterVolume;
        
        // Draw Carrier Sine Wave (Cyan)
        ctx.beginPath();
        ctx.strokeStyle = '#2DD4BF';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#2DD4BF';
        ctx.shadowBlur = 10;

        for (let x = 0; x < width; x++) {
          const freq = selectedSoundMode === 'delta' ? 0.025 : selectedSoundMode === 'theta' ? 0.05 : 0.08;
          const y = height / 2 + Math.sin(x * freq + phase) * amplitude * Math.sin(x * 0.005 + phase * 0.2);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw Secondary Interference Wave (Indigo)
        ctx.beginPath();
        ctx.strokeStyle = '#818CF8';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#818CF8';
        ctx.shadowBlur = 6;

        for (let x = 0; x < width; x++) {
          const freq = selectedSoundMode === 'delta' ? 0.027 : selectedSoundMode === 'theta' ? 0.055 : 0.06;
          const y = height / 2 + Math.sin(x * freq - phase * 0.8) * (amplitude * 0.7);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // Idle baseline line
        ctx.beginPath();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 0;
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isAudioPlaying, masterVolume, selectedSoundMode]);

  // Breathing Pacer Loop
  useEffect(() => {
    if (!isBreathingActive) return;

    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Switch Phases
        if (breathTechnique === '478') {
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            sleepAudio.playChime('hold');
            return 7;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            sleepAudio.playChime('exhale');
            return 8;
          } else {
            setBreathPhase('Inhale');
            setCycleCount(c => c + 1);
            sleepAudio.playChime('inhale');
            return 4;
          }
        } else if (breathTechnique === 'box') {
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            sleepAudio.playChime('hold');
            return 4;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            sleepAudio.playChime('exhale');
            return 4;
          } else if (breathPhase === 'Exhale') {
            setBreathPhase('Pause');
            return 4;
          } else {
            setBreathPhase('Inhale');
            setCycleCount(c => c + 1);
            sleepAudio.playChime('inhale');
            return 4;
          }
        } else {
          // Physiological Sigh
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold'); // quick second sip
            return 2;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            sleepAudio.playChime('exhale');
            return 8;
          } else {
            setBreathPhase('Inhale');
            setCycleCount(c => c + 1);
            sleepAudio.playChime('inhale');
            return 4;
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase, breathTechnique]);

  // NSDR Timer
  useEffect(() => {
    if (!nsdrActive) return;
    const interval = setInterval(() => {
      setNsdrRemainingSec((prev) => {
        if (prev <= 1) {
          setNsdrActive(false);
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [nsdrActive]);

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E1B4B]/70 via-[#0F172A] to-[#1E1B4B]/70 border border-[#312E81] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/40 text-[10px] font-bold uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>Real-Time Web Audio API Synthesis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
            Acoustic Neuromodulation & Breath Pacer
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Directly entrain your thalamocortical brain oscillations with synthesized <strong>Delta (0.5 - 4 Hz)</strong> binaural beats and stimulate the vagal nerve with guided parasympathetic breathing.
          </p>
        </div>
      </div>

      {/* Main Studio Grid: Synthesizer & Breath Coach */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Synthesizer Console */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-7 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2DD4BF15] border border-[#2DD4BF44] flex items-center justify-center text-[#2DD4BF]">
                <Disc className={`w-5 h-5 ${isAudioPlaying ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Zero-Latency Harmonic Synthesizer</h3>
                <p className="text-xs text-[#94A3B8]">Live Web Audio mathematical waveform generator</p>
              </div>
            </div>

            <button
              onClick={handleToggleSound}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition flex items-center space-x-2 shadow-lg cursor-pointer ${
                isAudioPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                  : 'bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#050505] shadow-[0_0_20px_rgba(45,212,191,0.25)]'
              }`}
            >
              {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAudioPlaying ? 'Stop Audio' : 'Play Soundscape'}</span>
            </button>
          </div>

          {/* Live Waveform Oscilloscope Screen */}
          <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#94A3B8] flex items-center space-x-1.5">
                <Activity className={`w-3.5 h-3.5 ${isAudioPlaying ? 'text-[#2DD4BF] animate-pulse' : 'text-[#64748B]'}`} />
                <span>Live Audio Frequency Oscilloscope</span>
              </span>
              <span className={isAudioPlaying ? 'text-[#2DD4BF] font-bold' : 'text-[#64748B]'}>
                {isAudioPlaying ? '● GENERATING WAVEFORM' : 'STANDBY'}
              </span>
            </div>
            <canvas 
              ref={canvasRef} 
              width={500} 
              height={90} 
              className="w-full h-[90px] rounded-xl bg-[#090D16]"
            />
          </div>

          {/* Sound Presets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'delta', label: '2.5 Hz Delta Beats', desc: 'Slow-Wave SWS Induction', icon: Moon, color: 'text-[#2DD4BF]' },
              { id: 'theta', label: '6.0 Hz Theta Waves', desc: 'Hypnagogic REM Dream', icon: Sparkles, color: 'text-[#818CF8]' },
              { id: 'brown', label: 'Deep Brown Noise', desc: 'Sub-Bass Tinnitus Mask', icon: Waves, color: 'text-amber-400' },
              { id: 'pink', label: 'Organic Pink Noise', desc: '1/f Power Spectral Sync', icon: Wind, color: 'text-rose-400' },
              { id: 'ocean', label: 'Tidal Ocean Surf', desc: 'Modulated Lowpass Surf', icon: Waves, color: 'text-[#38BDF8]' },
              { id: 'solfeggio', label: '528 Hz Solfeggio', desc: 'Cellular Harmonics', icon: Radio, color: 'text-emerald-400' }
            ].map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedSoundMode === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#050505] border-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.25)]'
                      : 'bg-[#050505] border-[#1E293B] hover:border-[#334155]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${preset.color} mb-2`} />
                  <div className="text-xs font-bold text-white">{preset.label}</div>
                  <div className="text-[10px] text-[#94A3B8] leading-tight mt-0.5">{preset.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Acoustic Controls & Carrier Frequency */}
          <div className="space-y-4 pt-4 border-t border-[#1E293B]">
            {/* Master Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#CBD5E1] flex items-center space-x-1.5">
                  <Volume2 className="w-4 h-4 text-[#2DD4BF]" />
                  <span>Master Synthesizer Gain</span>
                </span>
                <span className="text-[#2DD4BF] font-mono">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
              />
            </div>

            {/* If Binaural mode is selected: Carrier frequency & Beat Delta */}
            {(selectedSoundMode === 'delta' || selectedSoundMode === 'theta') && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[#050505] border border-[#1E293B] rounded-xl p-3 space-y-1">
                  <div className="text-[11px] text-[#64748B]">Carrier Pitch</div>
                  <div className="text-sm font-bold text-white font-mono">{carrierHz} Hz (G3)</div>
                </div>
                <div className="bg-[#050505] border border-[#1E293B] rounded-xl p-3 space-y-1">
                  <div className="text-[11px] text-[#64748B]">Stereo Delta Frequency</div>
                  <div className="text-sm font-bold text-[#2DD4BF] font-mono">
                    {selectedSoundMode === 'delta' ? '2.5 Hz (Slow Delta)' : '6.0 Hz (Theta)'}
                  </div>
                </div>
              </div>
            )}

            <p className="text-[11px] text-[#94A3B8] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF] flex-shrink-0" />
              <span>For binaural beat perception, please wear stereo headphones for left/right ear phase offset.</span>
            </p>
          </div>
        </div>

        {/* Right: Interactive Breathwork Pacer (4-7-8 & Box Breathing) */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-7 shadow-2xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-[#818CF8]" />
                <h3 className="text-base font-bold text-white">Vagal Parasympathetic Pacer</h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#1E1B4B] text-[#818CF8] border border-[#312E81]">
                {cycleCount} Cycles
              </span>
            </div>

            {/* Technique Selector */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { id: '478', label: '4-7-8 Vagal' },
                { id: 'box', label: 'Box (4x4)' },
                { id: 'sigh', label: 'Physio Sigh' }
              ].map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => {
                    setBreathTechnique(tech.id as any);
                    setBreathPhase('Inhale');
                    setBreathTimer(4);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    breathTechnique === tech.id
                      ? 'bg-[#6366F1] text-white shadow-md'
                      : 'bg-[#050505] text-[#94A3B8] hover:text-white border border-[#1E293B]'
                  }`}
                >
                  {tech.label}
                </button>
              ))}
            </div>

            {/* Animated Breath Aura Circle */}
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center w-48 h-48">
                {/* Outer glowing aura */}
                <div className={`absolute inset-0 rounded-full transition-all duration-1000 ease-in-out ${
                  breathPhase === 'Inhale' 
                    ? 'bg-[#2DD4BF]/20 scale-110 blur-xl' 
                    : breathPhase === 'Hold' 
                    ? 'bg-[#6366F1]/25 scale-110 blur-lg' 
                    : 'bg-[#C084FC]/10 scale-90 blur-md'
                }`} />

                {/* Animated Ring */}
                <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out shadow-2xl ${
                  breathPhase === 'Inhale'
                    ? 'border-[#2DD4BF] bg-[#050505] scale-105 shadow-[0_0_25px_rgba(45,212,191,0.3)]'
                    : breathPhase === 'Hold'
                    ? 'border-[#818CF8] bg-[#050505] scale-105 shadow-[0_0_25px_rgba(129,140,248,0.3)]'
                    : 'border-[#C084FC] bg-[#050505] scale-90 shadow-[0_0_20px_rgba(192,132,252,0.2)]'
                }`}>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#94A3B8]">
                    {breathPhase}
                  </span>
                  <span className="text-3xl font-extrabold text-white font-mono my-0.5">
                    {breathTimer}s
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] text-center px-4 leading-relaxed mt-2">
              {breathTechnique === '478' && 'Prolonged 8s exhalation stimulates the baroreceptor reflex, slowing heart rate and inducing parasympathetic calm.'}
              {breathTechnique === 'box' && '4-4-4-4 equal ratio stabilizes autonomic nervous balance during pre-bed cognitive rumination.'}
              {breathTechnique === 'sigh' && 'Two quick nasal inhales re-inflate collapsed lung alveoli, followed by a long exhale to expel carbon dioxide.'}
            </p>
          </div>

          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className={`w-full py-3 rounded-2xl font-bold text-xs tracking-wide transition flex items-center justify-center space-x-2 shadow-lg cursor-pointer ${
              isBreathingActive
                ? 'bg-[#1E293B] hover:bg-[#334155] text-white'
                : 'bg-[#6366F1] hover:bg-[#6366F1]/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
            }`}
          >
            {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isBreathingActive ? 'Pause Breathwork' : 'Start Guided Breath Pacer'}</span>
          </button>
        </div>

      </div>

      {/* Non-Sleep Deep Rest (NSDR / Yoga Nidra) Session */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-7 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#2DD4BF]" />
            <h3 className="text-base font-bold text-white">Non-Sleep Deep Rest (NSDR) Protocol</h3>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed max-w-2xl">
            A 10-20 minute NSDR (Yoga Nidra) session accelerates dopamine recovery in the basal ganglia by 65% and reduces sleep debt during afternoon or evening transition states.
          </p>
        </div>

        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="text-center">
            <div className="text-2xl font-bold text-white font-mono">{formatMinSec(nsdrRemainingSec)}</div>
            <div className="text-[10px] text-[#64748B] uppercase tracking-wider">Session Time</div>
          </div>
          <button
            onClick={() => setNsdrActive(!nsdrActive)}
            className="px-5 py-2.5 rounded-2xl bg-[#2DD4BF15] hover:bg-[#2DD4BF30] border border-[#2DD4BF44] text-[#2DD4BF] font-bold text-xs transition cursor-pointer"
          >
            {nsdrActive ? 'Pause NSDR' : 'Start 10m NSDR'}
          </button>
        </div>
      </div>

    </div>
  );
};
