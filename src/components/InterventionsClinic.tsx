import React, { useState } from 'react';
import { 
  Sparkles, Moon, Sun, Coffee, Clock, ShieldCheck, 
  BookOpen, CheckSquare, Square, AlertCircle, RefreshCw, 
  HelpCircle, ArrowRight, Brain, Zap, HeartHandshake
} from 'lucide-react';
import { SleepRecord, UserProfile, CBTIRestrictionPlan } from '../types';

interface InterventionsClinicProps {
  record: SleepRecord;
  userProfile: UserProfile;
}

export const InterventionsClinic: React.FC<InterventionsClinicProps> = ({
  record,
  userProfile
}) => {
  // CBT-I Sleep Restriction State
  const [diaryTST, setDiaryTST] = useState<number>(6.0); // Total Sleep Time in hours
  const [diaryTIB, setDiaryTIB] = useState<number>(8.0); // Time in Bed in hours
  const [anchorWakeTime, setAnchorWakeTime] = useState<string>('06:30');
  
  // Dynamic Evening Routine Items & Checkbox state
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isGeneratingRoutine, setIsGeneratingRoutine] = useState(false);
  const [eveningRoutine, setEveningRoutine] = useState([
    { id: 1, time: '8:30 PM', action: 'Circadian Lux Downshift', detail: 'Dim all overhead lighting to <50 lux. Switch devices to warm 2700K Night Shift.' },
    { id: 2, time: '9:15 PM', action: 'Somatic Cooling & Magnesium', detail: 'Take 200-400mg Magnesium L-Threonate or Bisglycinate; lower bedroom thermostat to 66°F.' },
    { id: 3, time: '9:45 PM', action: 'Neuromodulation & 4-7-8 Breathwork', detail: 'Engage 10 min Delta Binaural Beats (2.5 Hz) while practicing 4-7-8 parasympathetic breathwork.' },
    { id: 4, time: '10:15 PM', action: 'Lights Out / Stimulus Control', detail: 'Enter bed only when sleepy. If awake after 20 minutes, perform 20-min stimulus reset.' }
  ]);

  // Worry Journal State
  const [worryInput, setWorryInput] = useState('');
  const [reframedThought, setReframedThought] = useState<string | null>(null);
  const [isReframing, setIsReframing] = useState(false);

  // Caffeine tracker calculation (assuming last coffee at user's cutoff time, ~5hr half-life)
  const currentHour = new Date().getHours();
  const hoursSinceCaffeine = Math.max(0, currentHour - (userProfile.caffeineCutoffHour - 2));
  const estimatedCaffeineRemainingMg = Math.round(150 * Math.pow(0.5, hoursSinceCaffeine / 5));

  // Compute CBT-I Sleep Restriction Prescription
  const calculatedEfficiency = Math.round((diaryTST / diaryTIB) * 100);
  let prescribedTIB = diaryTST;
  let cbtiPhase = 'Sleep Restriction (Drive Consolidation)';
  let clinicalAdvice = '';

  if (calculatedEfficiency < 80) {
    prescribedTIB = Math.max(5.0, diaryTST);
    cbtiPhase = 'Sleep Restriction Phase (Build Adenosine)';
    clinicalAdvice = `Efficiency is ${calculatedEfficiency}%. Restricting bed window to ${prescribedTIB.toFixed(1)} hours will rebuild homeostatic sleep pressure and eliminate middle-of-the-night wakefulness.`;
  } else if (calculatedEfficiency >= 85 && calculatedEfficiency <= 90) {
    prescribedTIB = Math.min(diaryTIB + 0.25, 9.0);
    cbtiPhase = 'Controlled Expansion (+15 min)';
    clinicalAdvice = `Excellent sleep continuity (${calculatedEfficiency}%). Expanding nightly bed window by 15 minutes.`;
  } else if (calculatedEfficiency > 90) {
    prescribedTIB = Math.min(diaryTIB + 0.5, 9.0);
    cbtiPhase = 'Rapid Expansion (+30 min)';
    clinicalAdvice = `Pristine sleep consolidation (>90%). Expanding window by 30 minutes to capture more REM sleep.`;
  } else {
    prescribedTIB = diaryTIB;
    cbtiPhase = 'Maintenance & Stabilization';
    clinicalAdvice = `Maintain current window. Do not spend non-sleep time in bed.`;
  }

  // Calculate bedtime from anchor wake time
  const [wakeH, wakeM] = anchorWakeTime.split(':').map(Number);
  const wakeTotalMinutes = wakeH * 60 + wakeM;
  let bedTotalMinutes = wakeTotalMinutes - Math.round(prescribedTIB * 60);
  if (bedTotalMinutes < 0) bedTotalMinutes += 24 * 60;
  const bedH = Math.floor(bedTotalMinutes / 60);
  const bedM = bedTotalMinutes % 60;
  const formattedPrescribedBedtime = `${bedH % 12 === 0 ? 12 : bedH % 12}:${bedM.toString().padStart(2, '0')} ${bedH >= 12 ? 'PM' : 'AM'}`;

  const toggleStep = (id: number) => {
    setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Reframe 2 AM racing thoughts
  const handleReframeThought = () => {
    if (!worryInput.trim()) return;
    setIsReframing(true);
    setTimeout(() => {
      setReframedThought(`Cognitive Reframe: "Worrying about tomorrow's performance only elevates sympathetic adrenaline, which delays sleep. Resting quietly with eyes closed already achieves 70% of somatic physical recovery. Even with fragmented sleep, the human brain maintains full baseline cognitive capacity for next-day execution."`);
      setIsReframing(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E1B4B]/70 via-[#0F172A] to-[#1E1B4B]/70 border border-[#312E81] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF44] text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Scientifically Proven Clinical Interventions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
            Dynamic Evening Routine & CBT-I Clinic
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Move beyond passive tracking. Utilize Cognitive Behavioral Therapy for Insomnia (CBT-I)—the gold standard first-line medical intervention—alongside circadian light tuning and stimulus control.
          </p>
        </div>
      </div>

      {/* Grid: 1. Dynamic Evening Routine Architect & 2. Circadian Bio-Tuning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dynamic Evening Routine Architect */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2DD4BF15] border border-[#2DD4BF44] flex items-center justify-center text-[#2DD4BF]">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Dynamic Evening Routine Architect</h3>
                <p className="text-xs text-[#94A3B8]">Personalized wind-down protocol calibrated for tonight</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#050505] text-[#2DD4BF] border border-[#1E293B]">
              {Object.values(completedSteps).filter(Boolean).length} / {eveningRoutine.length} Done
            </span>
          </div>

          {/* Routine Steps List */}
          <div className="space-y-3">
            {eveningRoutine.map((step) => {
              const isDone = !!completedSteps[step.id];
              return (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start space-x-3.5 ${
                    isDone 
                      ? 'bg-[#2DD4BF15] border-[#2DD4BF44] opacity-80'
                      : 'bg-[#050505] border-[#1E293B] hover:border-[#334155]'
                  }`}
                >
                  <button className="mt-0.5 text-[#2DD4BF]">
                    {isDone ? <CheckSquare className="w-5 h-5 text-[#2DD4BF]" /> : <Square className="w-5 h-5 text-[#64748B]" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isDone ? 'line-through text-[#64748B]' : 'text-white'}`}>
                        {step.action}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-[#2DD4BF] bg-[#0F172A] px-2 py-0.5 rounded-md border border-[#1E293B]">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Target Bedtime: <strong className="text-white">10:15 PM</strong></span>
            <span className="text-[#2DD4BF] font-medium">Auto-synced with chronotype</span>
          </div>
        </div>

        {/* Circadian Bio-Tuner & Caffeine Tracker */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Caffeine & Adenosine Metabolism Clock */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Adenosine & Caffeine Clock</h3>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Half-Life: 5.0h
              </span>
            </div>

            <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#94A3B8]">Active Bloodstream Caffeine</span>
                <span className="text-lg font-bold text-amber-300 font-mono">~{estimatedCaffeineRemainingMg} mg</span>
              </div>
              <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (estimatedCaffeineRemainingMg / 150) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-tight">
                Caffeine competitively antagonizes adenosine A1/A2A receptors, preventing homeostatic sleep pressure even when mentally exhausted. Cutoff: <strong>{userProfile.caffeineCutoffHour}:00</strong>.
              </p>
            </div>
          </div>

          {/* Morning Lux & Light Therapy Protocol */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-6 shadow-2xl space-y-3">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-[#2DD4BF]" />
              <h3 className="text-base font-bold text-white">Circadian Lux Anchoring</h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              View <strong>10,000+ lux natural sunlight</strong> within 30 minutes of waking for 15-20 min. This triggers cortisol secretion and starts the 14-hour countdown clock for evening melatonin synthesis in the pineal gland.
            </p>
            <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Optimal Morning Window:</span>
              <span className="font-bold text-[#2DD4BF] font-mono">06:45 AM - 07:30 AM</span>
            </div>
          </div>

        </div>

      </div>

      {/* CBT-I Section: Sleep Restriction Therapy (SRT) Calculator & Stimulus Control */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-7 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/20 border border-[#6366F1]/40 flex items-center justify-center text-[#818CF8]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#818CF8]">
                Gold-Standard First-Line Medical Therapy
              </span>
              <h3 className="text-xl font-bold text-white">
                CBT-I Sleep Restriction & Stimulus Control Engine
              </h3>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1E1B4B] text-[#818CF8] border border-[#312E81]">
            {cbtiPhase}
          </span>
        </div>

        {/* Inputs & Prescription Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Input parameters */}
          <div className="lg:col-span-5 space-y-4 bg-[#050505] border border-[#1E293B] rounded-2xl p-5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              7-Day Sleep Diary Averages
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#CBD5E1]">Actual Sleep Time (TST)</span>
                <span className="text-[#2DD4BF] font-mono font-bold">{diaryTST.toFixed(1)} hrs</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.25"
                value={diaryTST}
                onChange={(e) => setDiaryTST(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#CBD5E1]">Total Time in Bed (TIB)</span>
                <span className="text-[#818CF8] font-mono font-bold">{diaryTIB.toFixed(1)} hrs</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="10.5"
                step="0.25"
                value={diaryTIB}
                onChange={(e) => setDiaryTIB(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#818CF8]"
              />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#1E293B]">
              <label className="text-xs text-[#CBD5E1] font-medium block">
                Fixed Circadian Wake Time (Non-negotiable Anchor)
              </label>
              <input
                type="time"
                value={anchorWakeTime}
                onChange={(e) => setAnchorWakeTime(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>
          </div>

          {/* Right: Calculated CBT-I Prescription */}
          <div className="lg:col-span-7 bg-[#050505] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#818CF8]">
                  Prescribed Sleep Window
                </span>
                <span className="text-xs font-bold text-[#2DD4BF]">
                  Efficiency: {calculatedEfficiency}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 text-center">
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3">
                  <div className="text-[11px] text-[#64748B] uppercase tracking-wider">Prescribed Bedtime</div>
                  <div className="text-xl font-extrabold text-[#2DD4BF] font-mono mt-1">
                    {formattedPrescribedBedtime}
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">Do NOT go to bed earlier</div>
                </div>
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3">
                  <div className="text-[11px] text-[#64748B] uppercase tracking-wider">Strict Wake Time</div>
                  <div className="text-xl font-extrabold text-[#818CF8] font-mono mt-1">
                    {anchorWakeTime}
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">Even on weekends</div>
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed mt-2">
                {clinicalAdvice}
              </p>
            </div>

            <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-[11px] text-[#94A3B8] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#2DD4BF] flex-shrink-0" />
              <span>
                Safety Rule: Sleep restriction is never capped below 5.0 hours to prevent micro-sleep lapses.
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Stimulus Control Emergency Protocol & Worry Reframer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stimulus Control: "Can't Sleep? 20-Min Reset" */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-6 shadow-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">"Can't Sleep? 20-Min Reset"</h3>
              <p className="text-xs text-[#94A3B8]">Break the psychological pairing of Bed = Frustration</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-[#CBD5E1]">
            <div className="p-3 bg-[#050505] border border-[#1E293B] rounded-xl flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#1E293B] text-[#2DD4BF] font-bold flex items-center justify-center text-[10px] flex-shrink-0">1</span>
              <span>If you are awake in bed for more than <strong>20 minutes</strong>, immediately get out of bed.</span>
            </div>
            <div className="p-3 bg-[#050505] border border-[#1E293B] rounded-xl flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#1E293B] text-[#2DD4BF] font-bold flex items-center justify-center text-[10px] flex-shrink-0">2</span>
              <span>Move to a dim, comfortable chair. Do NOT turn on screens or bright overhead lights.</span>
            </div>
            <div className="p-3 bg-[#050505] border border-[#1E293B] rounded-xl flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#1E293B] text-[#2DD4BF] font-bold flex items-center justify-center text-[10px] flex-shrink-0">3</span>
              <span>Read a low-stimulation physical book or listen to Delta audio until your eyelids feel genuinely heavy.</span>
            </div>
            <div className="p-3 bg-[#050505] border border-[#1E293B] rounded-xl flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#1E293B] text-[#2DD4BF] font-bold flex items-center justify-center text-[10px] flex-shrink-0">4</span>
              <span>Return to bed only when drowsy. Repeat if awake again.</span>
            </div>
          </div>
        </div>

        {/* 2 AM Cognitive Worry Journal & Reframer */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-6 shadow-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2DD4BF15] border border-[#2DD4BF44] flex items-center justify-center text-[#2DD4BF]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">2 AM Cognitive Restructuring</h3>
              <p className="text-xs text-[#94A3B8]">Dump intrusive catastrophic thoughts & reframe</p>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              value={worryInput}
              onChange={(e) => setWorryInput(e.target.value)}
              placeholder="e.g., If I don't fall asleep right now, my presentation tomorrow will be a disaster..."
              rows={2}
              className="w-full bg-[#050505] border border-[#1E293B] rounded-xl p-3 text-xs text-[#CBD5E1] focus:outline-none focus:border-[#2DD4BF] resize-none"
            />

            <button
              onClick={handleReframeThought}
              disabled={isReframing || !worryInput.trim()}
              className="w-full py-2.5 rounded-xl bg-[#2DD4BF15] hover:bg-[#2DD4BF30] text-[#2DD4BF] border border-[#2DD4BF44] text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <HeartHandshake className="w-4 h-4 text-[#2DD4BF]" />
              <span>{isReframing ? 'Reframing Thought...' : 'Apply CBT-I Cognitive Reframe'}</span>
            </button>

            {reframedThought && (
              <div className="p-3.5 bg-[#2DD4BF15] border border-[#2DD4BF44] rounded-xl text-xs text-[#2DD4BF] leading-relaxed animate-fadeIn">
                {reframedThought}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
