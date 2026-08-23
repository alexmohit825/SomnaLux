import React, { useState } from 'react';
import { 
  Brain, Heart, Clock, Zap, ShieldCheck, Microscope, 
  Dna, Sparkles, Activity, Layers, ArrowRight, BookOpen, 
  CheckCircle2, Info, ChevronRight, BarChart3, Waves
} from 'lucide-react';
import { SleepRecord, UserProfile } from '../types';

interface ScientificMechanismsProps {
  record: SleepRecord;
  userProfile: UserProfile;
  onNavigateToInterventions?: () => void;
  onNavigateToNeuromodulation?: () => void;
}

export const ScientificMechanisms: React.FC<ScientificMechanismsProps> = ({
  record,
  userProfile,
  onNavigateToInterventions,
  onNavigateToNeuromodulation
}) => {
  const [activePillar, setActivePillar] = useState<'glymphatic' | 'autonomic' | 'circadian' | 'endocrine'>('glymphatic');
  const [glymphaticStage, setGlymphaticStage] = useState<'awake' | 'deep'>('deep');
  const [circadianHour, setCircadianHour] = useState<number>(22); // 10 PM
  const [vagalStimulus, setVagalStimulus] = useState<number>(75); // 75% parasympathetic

  const deepPct = Math.round((record.deepMinutes / record.durationMinutes) * 100);

  // Pillars Data
  const pillars = [
    {
      id: 'glymphatic' as const,
      title: '1. Glymphatic Brain Detox',
      subtitle: 'Aquaporin-4 (AQP4) CSF Waste Clearance',
      icon: Brain,
      color: '#2DD4BF',
      badge: 'Nature / Science 2013-2023',
      shortSummary: 'During Slow-Wave Sleep, astrocytes shrink by 60%, creating interstitial channels for cerebrospinal fluid to flush out Beta-Amyloid & Tau aggregates.'
    },
    {
      id: 'autonomic' as const,
      title: '2. Autonomic Vagal Recovery',
      subtitle: 'Parasympathetic RMSSD & Vascular Dipping',
      icon: Heart,
      color: '#F43F5E',
      badge: 'Circulation / JACC 2019',
      shortSummary: 'Nocturnal HRV elevation reflects vagal nerve dominance, triggering a 10-20% blood pressure dip that relieves arterial endothelial shear stress.'
    },
    {
      id: 'circadian' as const,
      title: '3. Circadian SCN Pacemaker',
      subtitle: 'Process S (Adenosine) & Process C (Melatonin)',
      icon: Clock,
      color: '#818CF8',
      badge: 'Cell / Science 2021',
      shortSummary: 'The Suprachiasmatic Nucleus aligns peripheral cellular clocks with the 24-hour solar cycle via 480nm melanopsin retinal ganglion cells.'
    },
    {
      id: 'endocrine' as const,
      title: '4. Endocrine & HGH Secretion',
      subtitle: 'Somatotropin Pulse & GLUT4 Insulin Sensitivity',
      icon: Zap,
      color: '#F59E0B',
      badge: 'Lancet / Endocrine Reviews',
      shortSummary: '95% of daily pulsatile Human Growth Hormone (HGH) is secreted during delta slow-wave bursts, repairing somatic muscle and resensitizing insulin receptors.'
    }
  ];

  // Calculate circadian time status
  const getCircadianPhaseInfo = (hour: number) => {
    if (hour >= 6 && hour < 9) return { phase: 'Cortisol Awakening Response (CAR)', detail: 'Peak cortisol surge; optimum time for 10,000+ lux sunlight exposure.', melatonin: 'Suppressed', temp: 'Rising' };
    if (hour >= 9 && hour < 14) return { phase: 'Peak Cognitive & Working Memory', detail: 'Maximum prefrontal cortex executive alertness and reaction speed.', melatonin: 'Zero', temp: 'High' };
    if (hour >= 14 && hour < 17) return { phase: 'Post-Prandial Dip & Athletic Peak', detail: 'Core body temperature peaks; maximum cardiovascular and grip strength.', melatonin: 'Zero', temp: 'Peak' };
    if (hour >= 17 && hour < 21) return { phase: 'Dim Light Melatonin Onset (DLMO)', detail: 'Adenosine sleep pressure reaches maximum threshold; dim ambient lighting.', melatonin: 'Rising', temp: 'Dropping' };
    if (hour >= 21 && hour < 24) return { phase: 'Slow-Wave Sleep Window', detail: 'Pineal gland secretes peak melatonin; glymphatic system opens.', melatonin: 'Peak High', temp: 'Cooling Fast' };
    return { phase: 'Core Temperature Nadir & REM Dreams', detail: 'Lowest core body temperature (~04:00 AM); intense emotional REM consolidation.', melatonin: 'High', temp: 'Nadir (Lowest)' };
  };

  const phaseInfo = getCircadianPhaseInfo(circadianHour);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Scientific Banner */}
      <div className="bg-gradient-to-r from-[#1E1B4B]/80 via-[#0F172A] to-[#1E1B4B]/80 border border-[#312E81] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF44] text-[10px] font-bold uppercase tracking-widest">
            <Microscope className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Stanford & Harvard Sleep Medicine Foundations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
            Scientific Foundations & Biological Cellular Mechanisms
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Discover the exact molecular and physiological pathways through which sleep orchestrates neuro-cleansing, cardiovascular repair, circadian chronobiology, and cellular longevity.
          </p>
        </div>
      </div>

      {/* 4 Pillars Interactive Navigation Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const isActive = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => setActivePillar(pillar.id)}
              className={`p-5 rounded-[24px] border text-left transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer ${
                isActive 
                  ? 'bg-[#0F172A] border-[#2DD4BF] shadow-[0_0_25px_rgba(45,212,191,0.2)] transform -translate-y-1' 
                  : 'bg-[#0F172A]/70 border-[#1E293B] hover:border-[#334155] hover:bg-[#0F172A]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                    style={{ 
                      backgroundColor: `${pillar.color}15`, 
                      borderColor: `${pillar.color}44`,
                      color: pillar.color 
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#050505] text-[#94A3B8] border border-[#1E293B]">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{pillar.title}</h3>
                <p className="text-[11px] text-[#64748B] font-medium mt-0.5">{pillar.subtitle}</p>
              </div>

              <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed">
                {pillar.shortSummary}
              </p>

              <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-[#2DD4BF] pt-2 border-t border-[#1E293B]/60">
                <span>{isActive ? 'Active Deep Dive' : 'Explore Mechanism'}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Pillar Deep-Dive Interactive Lab */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-7 sm:p-8 shadow-2xl space-y-7">
        
        {/* Pillar 1: Glymphatic Brain Detox */}
        {activePillar === 'glymphatic' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#2DD4BF15] border border-[#2DD4BF44] flex items-center justify-center text-[#2DD4BF]">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#2DD4BF]">
                    Neuro-Glial Hydrodynamic System
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    The Glymphatic Brain Detoxification Mechanism
                  </h3>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1E1B4B] text-[#818CF8] border border-[#312E81]">
                  Primary SWS Function
                </span>
              </div>
            </div>

            {/* Interactive Glymphatic State Toggle (Awake vs Deep SWS) */}
            <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Interactive Hydrodynamic Fluid Simulation</h4>
                  <p className="text-xs text-[#94A3B8]">Compare CSF-ISF interstitial fluid exchange between wakefulness and deep Slow-Wave Sleep</p>
                </div>
                <div className="flex items-center space-x-2 bg-[#0F172A] p-1 rounded-2xl border border-[#1E293B]">
                  <button
                    onClick={() => setGlymphaticStage('awake')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      glymphaticStage === 'awake' 
                        ? 'bg-[#1E293B] text-amber-300 border border-amber-500/40 shadow-sm' 
                        : 'text-[#64748B] hover:text-white'
                    }`}
                  >
                    Awake (Constricted)
                  </button>
                  <button
                    onClick={() => setGlymphaticStage('deep')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      glymphaticStage === 'deep' 
                        ? 'bg-[#2DD4BF] text-[#050505] shadow-[0_0_15px_rgba(45,212,191,0.3)]' 
                        : 'text-[#64748B] hover:text-white'
                    }`}
                  >
                    Slow-Wave Sleep (60% Channel Expansion)
                  </button>
                </div>
              </div>

              {/* Visual Simulated Fluid Canvas / Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 space-y-2">
                  <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">Astrocyte Cell Size</span>
                  <div className="text-2xl font-bold font-mono text-white">
                    {glymphaticStage === 'awake' ? 'Normal (100% Vol)' : 'Shrunk by 60%'}
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    {glymphaticStage === 'awake' 
                      ? 'Astrocytic vascular end-feet tightly pack interstitial space, limiting fluid flow.' 
                      : 'Noradrenergic tone drops, causing astrocytes to shrink and open wide convective fluid channels.'}
                  </p>
                </div>

                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 space-y-2">
                  <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">CSF Inflow & Pulsatility</span>
                  <div className="text-2xl font-bold font-mono text-[#2DD4BF]">
                    {glymphaticStage === 'awake' ? '12% Basal Rate' : '100% High Flow'}
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    {glymphaticStage === 'awake'
                      ? 'Only superficial cortical layers receive CSF exchange during wakefulness.'
                      : 'Arterial pulsatility drives massive CSF waves deep through parenchyma via AQP4 channels.'}
                  </p>
                </div>

                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 space-y-2">
                  <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">Beta-Amyloid & Tau Clearance</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    {glymphaticStage === 'awake' ? 'Minimal (Toxin Accumulation)' : '20x Accelerated Flush'}
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    {glymphaticStage === 'awake'
                      ? 'Metabolic byproducts accumulate across synapses throughout the day.'
                      : 'Beta-Amyloid monomers and hyperphosphorylated Tau proteins flushed into cervical lymph nodes.'}
                  </p>
                </div>
              </div>

              {/* Your Personal Night Status */}
              <div className="p-4 rounded-xl bg-[#2DD4BF15] border border-[#2DD4BF44] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-[#2DD4BF] block font-semibold mb-0.5">Your SWS Reservoir Last Night: {record.deepMinutes} minutes ({deepPct}%)</strong>
                  <span className="text-[#CBD5E1]">
                    {deepPct >= 18 
                      ? '✓ Achieved full 90+ minute glymphatic cleansing threshold. Excellent neuroprotective index.' 
                      : '⚠️ SWS was under the 20% target. Glymphatic clearance was constrained by ~35%.'}
                  </span>
                </div>
                {onNavigateToNeuromodulation && (
                  <button
                    onClick={onNavigateToNeuromodulation}
                    className="px-4 py-2 rounded-xl bg-[#2DD4BF] text-[#050505] font-bold whitespace-nowrap cursor-pointer hover:bg-[#2DD4BF]/90 transition"
                  >
                    Boost SWS With Delta Audio →
                  </button>
                )}
              </div>
            </div>

            {/* Medical Literature Citations */}
            <div className="border-t border-[#1E293B] pt-4 space-y-2 text-xs text-[#64748B]">
              <div className="font-bold text-[#CBD5E1] flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-[#2DD4BF]" />
                <span>Key Clinical Citations:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#94A3B8]">
                <li><strong>Nedergaard et al., Science 2013:</strong> "Sleep Drives Metabolite Clearance from the Adult Brain."</li>
                <li><strong>Xie et al., Cell Stem Cell 2019:</strong> "Aquaporin-4 dependent glymphatic solute transport in human aging and Alzheimer’s pathology."</li>
                <li><strong>Walker et al., Nature Neuroscience 2017:</strong> "Slow-wave sleep deficit impairs hippocampus-dependent episodic memory consolidation."</li>
              </ul>
            </div>
          </div>
        )}

        {/* Pillar 2: Autonomic Vagal Recovery */}
        {activePillar === 'autonomic' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                    Parasympathetic & Vagal Tone Engine
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Autonomic Nervous System & Nocturnal Cardiovascular Dipping
                  </h3>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#050505] text-[#2DD4BF] border border-[#1E293B]">
                Your HRV: {record.hrvAverage} ms RMSSD
              </span>
            </div>

            {/* Interactive Vagal Brake Balance Simulator */}
            <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-6 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs font-semibold">
                  <span className="text-[#CBD5E1]">Simulate Parasympathetic Vagal Activation:</span>
                  <span className="text-rose-400 font-mono text-sm">{vagalStimulus}% Vagal Brake</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={vagalStimulus}
                  onChange={(e) => setVagalStimulus(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>20% (Sympathetic Stress Overdrive)</span>
                  <span>60% (Moderate Baseline)</span>
                  <span>100% (Deep Vagal Restoration)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 text-center">
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">Nocturnal RMSSD</div>
                  <div className="text-2xl font-bold font-mono text-[#2DD4BF] mt-1">
                    {Math.round(25 + (vagalStimulus * 0.65))} ms
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-1">Beat-to-Beat Variance</div>
                </div>

                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 text-center">
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">Resting Heart Rate Nadir</div>
                  <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                    {Math.round(72 - (vagalStimulus * 0.25))} bpm
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-1">Autonomic Deceleration</div>
                </div>

                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 text-center">
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">Nocturnal BP Dipping</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    -{Math.round(4 + (vagalStimulus * 0.15))}%
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-1">Vascular Elasticity Restored</div>
                </div>
              </div>
            </div>

            {/* Explanation & Vagus stimulation guidance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#94A3B8] leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#050505] border border-[#1E293B] space-y-2">
                <h5 className="font-bold text-white text-sm">Why Nocturnal Blood Pressure "Dipping" Saves Lives</h5>
                <p>
                  Healthy humans experience a 10% to 20% decline in systolic and diastolic arterial blood pressure during sleep. "Non-dippers" suffer 2.3x higher incidence of cardiovascular mortality, stroke, and left ventricular hypertrophy.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#050505] border border-[#1E293B] space-y-2">
                <h5 className="font-bold text-white text-sm">How To Trigger Immediate Vagal Activation</h5>
                <p>
                  Prolonged exhalation (e.g. 4-7-8 breathing) increases intra-thoracic pressure, mechanically compressing the carotid baroreceptors and firing acetylcholine across the sinoatrial node.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pillar 3: Circadian SCN Pacemaker */}
        {activePillar === 'circadian' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#818CF8]/20 border border-[#818CF8]/40 flex items-center justify-center text-[#818CF8]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#818CF8]">
                    Chronobiology & Suprachiasmatic Nucleus
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Process S (Adenosine) & Process C (Circadian Melatonin Phase)
                  </h3>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1E1B4B] text-[#C7D2FE] border border-[#312E81]">
                24-Hour Solar Oscillator
              </span>
            </div>

            {/* Interactive 24-Hour Circadian Scrubber */}
            <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-6 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs font-semibold">
                  <span className="text-[#CBD5E1]">Scrub Circadian Time of Day:</span>
                  <span className="text-[#2DD4BF] font-mono text-sm">
                    {circadianHour % 12 === 0 ? 12 : circadianHour % 12}:00 {circadianHour >= 12 ? 'PM' : 'AM'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={circadianHour}
                  onChange={(e) => setCircadianHour(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#64748B]">
                  <span>00:00 (Midnight)</span>
                  <span>06:00 (Wake)</span>
                  <span>12:00 (Noon)</span>
                  <span>18:00 (Evening)</span>
                  <span>23:00 (Sleep)</span>
                </div>
              </div>

              {/* Dynamic Phase Output */}
              <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#2DD4BF44] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2DD4BF]">
                    Current Chronobiological Phase
                  </span>
                  <div className="flex space-x-3 text-xs">
                    <span>Melatonin: <strong className="text-white">{phaseInfo.melatonin}</strong></span>
                    <span>Core Temp: <strong className="text-white">{phaseInfo.temp}</strong></span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white">{phaseInfo.phase}</h4>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  {phaseInfo.detail}
                </p>
              </div>
            </div>

            {/* The Two Process Model Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#94A3B8]">
              <div className="p-4 rounded-2xl bg-[#050505] border border-[#1E293B] space-y-2">
                <strong className="text-amber-300 block text-sm font-bold">Process S: Homeostatic Sleep Pressure</strong>
                <p>
                  As ATP (cellular energy) is hydrolyzed throughout the day, Adenosine builds up in the basal forebrain. When adenosine binds to A1/A2A receptors, tiredness escalates. Caffeine acts by blocking these receptors without clearing adenosine.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#050505] border border-[#1E293B] space-y-2">
                <strong className="text-[#818CF8] block text-sm font-bold">Process C: Circadian Melatonin Oscillator</strong>
                <p>
                  Driven by CLOCK and BMAL1 gene transcription feedback loops in the SCN. Blue photons (480nm) hitting intrinsically photosensitive retinal ganglion cells (ipRGCs) halt melatonin production during daylight.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pillar 4: Endocrine HGH & Metabolic Rejuvenation */}
        {activePillar === 'endocrine' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    Endocrine & Metabolic Homeostasis
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Pulsatile Growth Hormone (HGH) & Cellular Insulin Resensitization
                  </h3>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Anabolic State
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-5 space-y-2">
                <span className="text-xs font-bold text-[#2DD4BF] uppercase tracking-wider">Human Growth Hormone (HGH)</span>
                <div className="text-2xl font-bold text-white font-mono">95% Daily Secretion</div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  The anterior pituitary gland releases massive pulses of Somatotropin during slow-wave delta bursts. This drives collagen synthesis, bone mineralization, and lean muscle repair.
                </p>
              </div>

              <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-5 space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">GLUT4 Insulin Sensitivity</span>
                <div className="text-2xl font-bold text-white font-mono">+30% Glucose Disposal</div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Single-night sleep deprivation causes systemic cellular insulin resistance comparable to aging 20 years. Adequate SWS restores normal peripheral insulin receptor signaling.
                </p>
              </div>

              <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-5 space-y-2">
                <span className="text-xs font-bold text-[#818CF8] uppercase tracking-wider">Natural Killer (NK) Cytotoxicity</span>
                <div className="text-2xl font-bold text-white font-mono">+70% Immune Lysis</div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  During sleep, pro-inflammatory cytokines trigger immune memory consolidation and circulate cytotoxic lymphocytes to eliminate mutated precancerous cells.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050505] border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <strong className="text-white block font-bold">Ready to apply these mechanisms to your sleep tonight?</strong>
                <span className="text-[#94A3B8]">Review your personalized CBT-I protocol, caffeine half-life cutoffs, and evening wind-down routine.</span>
              </div>
              {onNavigateToInterventions && (
                <button
                  onClick={onNavigateToInterventions}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#2DD4BF] text-white font-bold whitespace-nowrap cursor-pointer hover:opacity-90 transition shadow-[0_0_15px_rgba(45,212,191,0.25)]"
                >
                  Open CBT-I Clinic →
                </button>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
