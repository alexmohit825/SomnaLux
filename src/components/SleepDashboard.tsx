import React, { useState } from 'react';
import { 
  Sparkles, Activity, Heart, Zap, Clock, ShieldAlert, 
  Thermometer, Wind, Eye, Droplets, ChevronRight, CheckCircle2,
  RefreshCw, Layers, ArrowUpRight, Award, AlertCircle, Sliders,
  Brain, ShieldCheck, Microscope, Info, Play, Check
} from 'lucide-react';
import { SleepRecord, UserProfile, SleepDiagnosis } from '../types';
import { sleepArchetypes } from '../data/mockSleepData';

interface SleepDashboardProps {
  record: SleepRecord;
  userProfile: UserProfile;
  onNavigateToInterventions: () => void;
  onNavigateToLongevity: () => void;
  onNavigateToScience?: () => void;
  onNavigateToNeuromodulation?: () => void;
  onSelectArchetype?: (key: string) => void;
  selectedArchetypeKey?: string;
}

export const SleepDashboard: React.FC<SleepDashboardProps> = ({
  record,
  userProfile,
  onNavigateToInterventions,
  onNavigateToLongevity,
  onNavigateToScience,
  onNavigateToNeuromodulation,
  onSelectArchetype,
  selectedArchetypeKey = 'baseline'
}) => {
  const [selectedEpochIndex, setSelectedEpochIndex] = useState<number | null>(2); // Default to a deep epoch
  
  // Interactive Live What-If Modeler
  const [simExtraDeep, setSimExtraDeep] = useState<number>(0);
  const [simExtraHrv, setSimExtraHrv] = useState<number>(0);

  // Computations with live simulator modifiers
  const effectiveDeep = Math.min(record.durationMinutes, Math.max(10, record.deepMinutes + simExtraDeep));
  const effectiveHrv = Math.max(15, record.hrvAverage + simExtraHrv);
  
  const totalHours = (record.durationMinutes / 60).toFixed(1);
  const deepPct = Math.round((effectiveDeep / record.durationMinutes) * 100);
  const remPct = Math.round((record.remMinutes / record.durationMinutes) * 100);
  const lightPct = Math.round((record.lightMinutes / record.durationMinutes) * 100);
  const awakePct = Math.round((record.awakeMinutes / record.inBedMinutes) * 100);
  const efficiency = Math.round(record.efficiency);
  
  // Restorative Score: Weighted composite of SWS, REM, Efficiency & HRV
  const calculatedScore = Math.min(100, Math.max(35, Math.round(
    (efficiency * 0.35) + 
    (deepPct * 1.6) + 
    (remPct * 0.5) + 
    ((effectiveHrv / (record.hrvBaseline || 50)) * 20)
  )));

  // Simulated Longevity Shift
  const bioAgeShiftNumber = deepPct >= 20 
    ? -parseFloat((1.8 + (deepPct - 20) * 0.08 + (effectiveHrv > 50 ? 0.6 : 0)).toFixed(1))
    : +parseFloat((1.4 + (20 - deepPct) * 0.09 + (effectiveHrv < 40 ? 0.8 : 0)).toFixed(1));
  const bioAgeShift = bioAgeShiftNumber > 0 ? `+${bioAgeShiftNumber}` : `${bioAgeShiftNumber}`;

  // Dynamic Clinical Diagnosis
  const diagnosisData: SleepDiagnosis = {
    title: deepPct < 15 
      ? 'Slow-Wave Sleep Deficit & Elevated Sympathetic Nocturnal Tone' 
      : calculatedScore >= 85
      ? 'Optimal SWS Delta Power & Rejuvenating Vagal Autonomic Profile'
      : 'Fragmented Sleep Architecture & Circadian Melatonin Lag',
    score: calculatedScore,
    severity: calculatedScore >= 85 ? 'Optimal' : calculatedScore >= 65 ? 'Mild Imbalance' : 'Moderate Risk',
    summary: deepPct < 15 
      ? `Analysis indicates a ${Math.max(0, 90 - effectiveDeep)} minute slow-wave deficit with nocturnal HRV (${effectiveHrv}ms) blunted by sympathetic tone. Glymphatic CSF clearance is operating at ~62% capacity.`
      : `High-density slow-wave sleep (${effectiveDeep} min, ${deepPct}%) with strong vagal recovery (${effectiveHrv}ms HRV). Optimal 10-20% nocturnal blood pressure dipping detected.`,
    rootCauses: [
      { 
        factor: 'Sympathetic Nervous System Arousal', 
        confidence: 88, 
        detail: 'Late cognitive demands or blue light blunted vagal nerve acetylcholine output during early NREM cycles.' 
      },
      { 
        factor: 'Core Body Temperature Nadir Timing', 
        confidence: 76, 
        detail: 'Delayed temperature dissipation delayed peak slow-wave sleep spindle density by ~38 minutes.' 
      },
      { 
        factor: 'Adenosine Homeostatic Buildup', 
        confidence: 84, 
        detail: 'Adenosine pressure cleared effectively during the first 3.5 hours of slow-wave sleep.' 
      }
    ],
    biologicalAgeShiftYears: bioAgeShiftNumber,
    immediateInterventions: [
      { step: 1, action: '4-7-8 Parasympathetic Vagal Reset', detail: '6 cycles before bed to stimulate acetylcholine release across the sinoatrial node.' },
      { step: 2, action: 'Bedroom Thermal Microclimate (66°F)', detail: 'Trigger peripheral vasodilation 45 mins before scheduled sleep onset.' },
      { step: 3, action: 'Circadian Lux Anchoring', detail: '10,000+ lux natural sunlight within 30 minutes of waking to anchor the SCN clock.' }
    ]
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* SECTION 1: CLINICAL SCENARIO SIMULATOR (1-CLICK TESTER)                  */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF33]">
            SECTION 01
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Clinical Sleep Profiles & Instant Scenarios
          </h2>
          <span className="text-xs text-[#64748B] hidden sm:inline">— Select a profile to model immediate polysomnographic shifts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(sleepArchetypes).map(([key, arch]) => {
            const isSelected = selectedArchetypeKey === key;
            const archDeep = arch.record.deepMinutes;
            const archHrv = arch.record.hrvAverage;

            return (
              <button
                key={key}
                onClick={() => onSelectArchetype && onSelectArchetype(key)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-[#0F172A] border-[#2DD4BF] text-white shadow-[0_0_20px_rgba(45,212,191,0.25)] ring-1 ring-[#2DD4BF]'
                    : 'bg-[#0F172A]/60 border-[#1E293B] text-[#94A3B8] hover:border-[#334155] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate text-white">{arch.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF] flex-shrink-0" />}
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-mono">
                  <span className="text-[#2DD4BF] font-semibold">{archDeep}m SWS</span>
                  <span>•</span>
                  <span className="text-[#818CF8]">{archHrv}ms HRV</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: RESTORATIVE SCORE & DEEP SLEEP RESERVOIR                      */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF33]">
              SECTION 02
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Restorative Architecture & Slow-Wave Reservoir
            </h2>
          </div>
          <span className="text-xs text-[#94A3B8]">Session: Last Night</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card A: Restorative Score Gauge */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B]/60 to-[#0F172A] border border-[#1E293B] rounded-[32px] p-7 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#2DD4BF]">
                  Composite Metric
                </span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  calculatedScore >= 85 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                    : calculatedScore >= 70
                    ? 'bg-[#2DD4BF15] text-[#2DD4BF] border-[#2DD4BF44]'
                    : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                }`}>
                  {calculatedScore >= 85 ? 'Elite Recovery' : calculatedScore >= 70 ? 'Restorative' : 'Sub-Optimal'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Restorative Sleep Score</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 my-5">
              {/* Visual Circular Gauge */}
              <div className="relative flex items-center justify-center w-36 h-36 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-[#1E293B]" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="42"
                    className="stroke-[#2DD4BF] transition-all duration-1000 ease-out shadow-[0_0_12px_#2DD4BF]"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * calculatedScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold text-white tracking-tighter">
                    {calculatedScore}
                  </span>
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Score / 100
                  </span>
                </div>
              </div>

              {/* Core Stats Box */}
              <div className="flex-1 space-y-2.5 w-full">
                <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Total Sleep Time</div>
                    <div className="text-sm font-bold text-white">{totalHours} hrs <span className="text-xs text-[#64748B] font-normal">({record.durationMinutes}m)</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Efficiency</div>
                    <div className="text-sm font-bold text-[#2DD4BF]">{efficiency}%</div>
                  </div>
                </div>

                <div className="bg-[#1E1B4B]/60 border border-[#312E81] rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#818CF8] uppercase font-bold tracking-wider">Biological Longevity Shift</div>
                    <div className="text-xs font-semibold text-white">
                      {bioAgeShiftNumber < 0 
                        ? `Rejuvenating at ${bioAgeShift} yrs/yr rate` 
                        : `Cellular strain (+${bioAgeShift} yrs bio-age)`}
                    </div>
                  </div>
                  <button 
                    onClick={onNavigateToLongevity}
                    className="p-1.5 rounded-xl bg-[#6366F1]/20 hover:bg-[#6366F1]/40 text-[#C7D2FE] transition cursor-pointer"
                    title="View 10-Year Prognosis"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#94A3B8]">
              <span>Bed: <strong className="text-white">{record.bedTime}</strong> → Wake: <strong className="text-white">{record.wakeTime}</strong></span>
              <span className="text-[#818CF8] font-semibold">Latency: {record.latencyMinutes}m</span>
            </div>
          </div>

          {/* Card B: Slow-Wave Deep Sleep (SWS) Fluid Reservoir */}
          <div className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-7 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF]" />
                  <h3 className="text-lg font-bold text-white">
                    Slow-Wave Sleep (SWS) Somatic Reservoir
                  </h3>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
                  Clinical Goal: 90+ min (20%)
                </span>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                SWS is your cellular repair window: 95% of daily pulsatile HGH is released and the brain's glymphatic fluid network flushes metabolic neurotoxins.
              </p>

              {/* Fluid Reservoir Fill Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs">
                  <span className="font-semibold text-[#CBD5E1]">
                    Current SWS: <strong className="text-[#2DD4BF] text-sm">{effectiveDeep} min</strong> ({deepPct}% of night)
                  </span>
                  <span className={`font-semibold ${deepPct >= 20 ? 'text-[#2DD4BF]' : 'text-amber-400'}`}>
                    {deepPct >= 20 ? '✓ SWS Reservoir Full' : `⚠️ Deficit of ${Math.max(0, 90 - effectiveDeep)} min`}
                  </span>
                </div>

                <div className="w-full h-7 bg-[#050505] border border-[#1E293B] rounded-2xl p-1 relative overflow-hidden flex items-center">
                  <div 
                    className="h-full rounded-xl bg-gradient-to-r from-[#2DD4BF] via-[#818CF8] to-[#6366F1] transition-all duration-1000 relative"
                    style={{ width: `${Math.min(100, (effectiveDeep / 120) * 100)}%` }}
                  />
                  <div className="absolute left-[75%] top-0 bottom-0 w-0.5 bg-white/40 border-dashed" title="Target Line (90 min)" />
                </div>
              </div>

              {/* 4-Stage Breakdown Grid */}
              <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-[#050505] rounded-2xl p-2.5 border border-[#1E293B]">
                  <div className="text-[10px] text-[#2DD4BF] font-bold uppercase tracking-wider">Deep SWS</div>
                  <div className="font-bold text-white mt-0.5">{effectiveDeep}m <span className="text-[10px] text-[#64748B] font-normal">({deepPct}%)</span></div>
                </div>
                <div className="bg-[#050505] rounded-2xl p-2.5 border border-[#1E293B]">
                  <div className="text-[10px] text-[#C084FC] font-bold uppercase tracking-wider">REM Dream</div>
                  <div className="font-bold text-white mt-0.5">{record.remMinutes}m <span className="text-[10px] text-[#64748B] font-normal">({remPct}%)</span></div>
                </div>
                <div className="bg-[#050505] rounded-2xl p-2.5 border border-[#1E293B]">
                  <div className="text-[10px] text-[#818CF8] font-bold uppercase tracking-wider">Light Sleep</div>
                  <div className="font-bold text-white mt-0.5">{record.lightMinutes}m <span className="text-[10px] text-[#64748B] font-normal">({lightPct}%)</span></div>
                </div>
                <div className="bg-[#050505] rounded-2xl p-2.5 border border-[#1E293B]">
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Awake (WASO)</div>
                  <div className="font-bold text-white mt-0.5">{record.awakeMinutes}m <span className="text-[10px] text-[#64748B] font-normal">({record.awakeningsCount}x)</span></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between">
              {onNavigateToScience && (
                <button
                  onClick={onNavigateToScience}
                  className="text-xs font-bold text-[#2DD4BF] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Microscope className="w-3.5 h-3.5" />
                  <span>Explore Glymphatic Clearance Model →</span>
                </button>
              )}
              <button
                onClick={onNavigateToInterventions}
                className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#6366F1]/90 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-lg"
              >
                <span>Tonight's Prescription</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: INTERACTIVE "WHAT-IF" BIOMARKER MODELER                       */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF33]">
              SECTION 03
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Interactive "What-If" Biomarker Modeler
            </h2>
          </div>
          {(simExtraDeep !== 0 || simExtraHrv !== 0) && (
            <button
              onClick={() => { setSimExtraDeep(0); setSimExtraHrv(0); }}
              className="text-xs text-[#2DD4BF] hover:underline cursor-pointer"
            >
              Reset Modeler
            </button>
          )}
        </div>

        <div className="bg-[#0F172A] border border-[#2DD4BF44] rounded-[32px] p-6 sm:p-7 shadow-2xl space-y-4">
          <p className="text-xs text-[#94A3B8]">
            Drag the sliders below to simulate mathematical improvements in slow-wave sleep and nocturnal vagal tone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slider 1: SWS Deep Sleep */}
            <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#CBD5E1]">Simulate Slow-Wave Deep Sleep</span>
                <span className="text-[#2DD4BF] font-mono font-bold">
                  {effectiveDeep} min ({simExtraDeep >= 0 ? `+${simExtraDeep}` : simExtraDeep}m)
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="60"
                step="5"
                value={simExtraDeep}
                onChange={(e) => setSimExtraDeep(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
              />
              <div className="flex justify-between text-[10px] text-[#64748B]">
                <span>-30m (Deficit)</span>
                <span>Baseline ({record.deepMinutes}m)</span>
                <span>+60m (Optimized)</span>
              </div>
            </div>

            {/* Slider 2: Nocturnal HRV */}
            <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#CBD5E1]">Simulate Nocturnal Vagal HRV</span>
                <span className="text-[#818CF8] font-mono font-bold">
                  {effectiveHrv} ms ({simExtraHrv >= 0 ? `+${simExtraHrv}` : simExtraHrv}ms)
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                step="2"
                value={simExtraHrv}
                onChange={(e) => setSimExtraHrv(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#818CF8]"
              />
              <div className="flex justify-between text-[10px] text-[#64748B]">
                <span>-20ms (Sympathetic Tone)</span>
                <span>Baseline ({record.hrvAverage}ms)</span>
                <span>+40ms (Vagal Dominance)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: AI CLINICAL PATHOLOGY & ROOT CAUSES                           */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF33]">
              SECTION 04
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              AI Pathology & Root Cause Diagnostics
            </h2>
          </div>
          <span className="text-xs text-[#2DD4BF] font-semibold">Gemini 3.7 Diagnostic Engine</span>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-7 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2DD4BF15] border border-[#2DD4BF44] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#2DD4BF]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{diagnosisData.title}</h3>
                <span className="text-xs text-[#94A3B8]">Automated polysomnographic interpretation</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF44]">
                Severity: {diagnosisData.severity}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#050505] border border-[#1E293B]">
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              {diagnosisData.summary}
            </p>
          </div>

          {/* Root Causes */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
              Identified Physiological Root Causes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {diagnosisData.rootCauses.map((cause, idx) => (
                <div key={idx} className="bg-[#050505] border border-[#1E293B] rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2DD4BF]">{cause.factor}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1E293B] text-[#94A3B8] rounded">
                      {cause.confidence}% Match
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{cause.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Step Interventions */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
              Immediate Prescribed Interventions (Tonight)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {diagnosisData.immediateInterventions.map((step) => (
                <div key={step.step} className="bg-[#050505] border border-[#312E81] rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[#2DD4BF15] border border-[#2DD4BF44] text-[#2DD4BF] flex items-center justify-center text-[11px] font-bold">
                      {step.step}
                    </span>
                    <span className="text-xs font-bold text-white">{step.action}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: POLYSOMNOGRAPHIC HYPNOGRAM & EEG ARCHITECTURE                 */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF33]">
              SECTION 05
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Sleep Architecture Hypnogram & Epoch Inspector
            </h2>
          </div>
          <div className="flex items-center space-x-3 text-xs font-medium">
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-400" /><span>Awake</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#C084FC]" /><span>REM</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#6366F1]" /><span>Light</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#2DD4BF]" /><span>Deep</span></span>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-6 sm:p-7 shadow-2xl space-y-4">
          <p className="text-xs text-[#94A3B8]">
            Click any block along the timeline below to lock onto that epoch and inspect its EEG frequency band, heart rate, and HRV.
          </p>

          <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-4">
            <div className="flex">
              {/* Stage labels */}
              <div className="w-16 flex flex-col justify-between py-2 text-[11px] font-mono font-semibold text-right pr-3 border-r border-[#1E293B] select-none">
                <span className="text-amber-400">Awake</span>
                <span className="text-[#C084FC]">REM</span>
                <span className="text-[#818CF8]">Light</span>
                <span className="text-[#2DD4BF]">Deep</span>
              </div>

              {/* Hypnogram Stepped Bars */}
              <div className="flex-1 pl-3 relative h-36 flex items-stretch">
                <div className="w-full h-full flex items-stretch space-x-1">
                  {record.stageEpochs.map((epoch, idx) => {
                    const stageHeightMap = {
                      awake: 'h-[25%] self-start bg-amber-400/90 shadow-[0_0_10px_rgba(251,191,36,0.3)]',
                      rem: 'h-[50%] self-start bg-[#C084FC]/90 shadow-[0_0_10px_rgba(192,132,252,0.3)]',
                      light: 'h-[75%] self-start bg-[#6366F1]/90 shadow-[0_0_10px_rgba(99,102,241,0.3)]',
                      deep: 'h-[100%] self-start bg-[#2DD4BF]/90 shadow-[0_0_10px_rgba(45,212,191,0.4)]'
                    };

                    const isSelected = selectedEpochIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedEpochIndex(idx)}
                        className={`flex-1 rounded-t cursor-pointer transition-all duration-150 ${stageHeightMap[epoch.stage]} ${
                          isSelected ? 'scale-y-105 brightness-150 ring-2 ring-white' : 'opacity-85 hover:opacity-100'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time scale */}
            <div className="flex justify-between text-[10px] font-mono text-[#64748B] pl-16 pt-2">
              <span>{record.bedTime}</span>
              <span>01:00 AM</span>
              <span>03:00 AM</span>
              <span>05:00 AM</span>
              <span>{record.wakeTime}</span>
            </div>

            {/* Selected Epoch Telemetry Card */}
            {selectedEpochIndex !== null && record.stageEpochs[selectedEpochIndex] && (
              <div className="mt-4 p-4 bg-[#0F172A] border border-[#2DD4BF44] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[#2DD4BF] font-bold text-sm">
                    Epoch @ {record.stageEpochs[selectedEpochIndex].timestamp}
                  </span>
                  <span className="uppercase text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#1E293B] text-white">
                    Stage: {record.stageEpochs[selectedEpochIndex].stage}
                  </span>
                  <span className="text-[#94A3B8]">
                    Band: <strong className="text-white font-mono">
                      {record.stageEpochs[selectedEpochIndex].stage === 'deep' ? '0.5-4 Hz Delta Waves (Synchronous SWS)' :
                       record.stageEpochs[selectedEpochIndex].stage === 'rem' ? '4-8 Hz Theta Waves (Desynchronized REM)' :
                       record.stageEpochs[selectedEpochIndex].stage === 'light' ? '12-14 Hz Sleep Spindles & K-Complexes' : '15-30 Hz Beta Arousals'}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-[#94A3B8]">
                  <span>HR: <strong className="text-white">{record.stageEpochs[selectedEpochIndex].heartRate} bpm</strong></span>
                  <span>HRV: <strong className="text-[#2DD4BF]">{record.stageEpochs[selectedEpochIndex].hrv} ms</strong></span>
                  <span>Duration: <strong className="text-white">{record.stageEpochs[selectedEpochIndex].durationMinutes} min</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: AUTONOMIC & ENVIRONMENTAL BIOMARKERS                          */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF33]">
              SECTION 06
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Autonomic Recovery & Bedroom Sanctuary Telemetry
            </h2>
          </div>
          <span className="text-xs text-[#94A3B8]">Vagal & Microclimate Indices</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Nocturnal HRV */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
              <span>Nocturnal HRV (RMSSD)</span>
              <Activity className="w-4 h-4 text-[#2DD4BF]" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{effectiveHrv} <span className="text-xs text-[#64748B] font-normal">ms</span></div>
            <div className="text-xs text-[#2DD4BF] font-medium">
              {effectiveHrv >= record.hrvBaseline ? `+${effectiveHrv - record.hrvBaseline}ms above baseline` : `${effectiveHrv - record.hrvBaseline}ms below baseline`}
            </div>
          </div>

          {/* Resting HR Nadir */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
              <span>Resting HR Nadir</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{record.restingHeartRate} <span className="text-xs text-[#64748B] font-normal">bpm</span></div>
            <div className="text-xs text-[#94A3B8]">Reached @ 03:15 AM (Healthy Vagal Dip)</div>
          </div>

          {/* Bedroom Microclimate Temp */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
              <span>Bedroom Thermal Temp</span>
              <Thermometer className="w-4 h-4 text-[#818CF8]" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">66.8°F</div>
            <div className="text-xs text-[#818CF8]">Optimal range (65°F - 68°F)</div>
          </div>

          {/* Cumulative Sleep Debt */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
              <span>Sleep Debt Backlog</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{record.sleepDebtHours.toFixed(1)} <span className="text-xs text-[#64748B] font-normal">hrs</span></div>
            <div className={`text-xs ${record.sleepDebtHours > 2.0 ? 'text-amber-400' : 'text-[#2DD4BF]'}`}>
              {record.sleepDebtHours > 2.0 ? 'Elevated Adenosine Load' : 'Adenosine Cleared'}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
