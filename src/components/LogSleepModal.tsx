import React, { useState } from 'react';
import { X, Moon, Clock, Heart, Activity, Check, Sparkles } from 'lucide-react';
import { SleepRecord } from '../types';
import { sampleEpochsBaseline, sleepArchetypes } from '../data/mockSleepData';

interface LogSleepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecord: (record: SleepRecord) => void;
  currentRecord: SleepRecord;
}

export const LogSleepModal: React.FC<LogSleepModalProps> = ({
  isOpen,
  onClose,
  onSaveRecord,
  currentRecord
}) => {
  const [bedTime, setBedTime] = useState(currentRecord.bedTime || '11:00 PM');
  const [wakeTime, setWakeTime] = useState(currentRecord.wakeTime || '07:00 AM');
  const [durationHours, setDurationHours] = useState<number>(currentRecord.durationMinutes / 60 || 7.5);
  const [deepMinutes, setDeepMinutes] = useState<number>(currentRecord.deepMinutes || 75);
  const [remMinutes, setRemMinutes] = useState<number>(currentRecord.remMinutes || 95);
  const [hrvAverage, setHrvAverage] = useState<number>(currentRecord.hrvAverage || 50);
  const [restingHr, setRestingHr] = useState<number>(currentRecord.restingHeartRate || 55);
  const [latencyMinutes, setLatencyMinutes] = useState<number>(currentRecord.latencyMinutes || 15);
  const [tagInput, setTagInput] = useState(currentRecord.tags.join(', '));

  if (!isOpen) return null;

  const handleApplyPreset = (type: 'perfect' | 'stress' | 'insomnia') => {
    if (type === 'perfect') {
      setBedTime('10:00 PM');
      setWakeTime('06:30 AM');
      setDurationHours(8.0);
      setDeepMinutes(125);
      setRemMinutes(120);
      setHrvAverage(78);
      setRestingHr(48);
      setLatencyMinutes(8);
      setTagInput('Magnesium Glycinate, Cold Bedroom (65°F), NSDR Breathwork');
    } else if (type === 'stress') {
      setBedTime('12:30 AM');
      setWakeTime('06:15 AM');
      setDurationHours(5.2);
      setDeepMinutes(35);
      setRemMinutes(55);
      setHrvAverage(31);
      setRestingHr(65);
      setLatencyMinutes(35);
      setTagInput('Work Deadline, Late Blue Light, High Cortisol');
    } else {
      setBedTime('10:30 PM');
      setWakeTime('07:15 AM');
      setDurationHours(6.5);
      setDeepMinutes(40);
      setRemMinutes(70);
      setHrvAverage(38);
      setRestingHr(62);
      setLatencyMinutes(55);
      setTagInput('Excess time in bed, Clock watching, 2 AM racing thoughts');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationMinutes = Math.round(durationHours * 60);
    const inBedMinutes = durationMinutes + latencyMinutes + 30;
    const lightMinutes = Math.max(0, durationMinutes - deepMinutes - remMinutes);
    const efficiency = Math.min(100, Math.max(40, (durationMinutes / inBedMinutes) * 100));

    const newRecord: SleepRecord = {
      id: `rec-${Date.now()}`,
      date: 'Logged Session (Custom)',
      bedTime,
      wakeTime,
      durationMinutes,
      inBedMinutes,
      efficiency,
      deepMinutes,
      remMinutes,
      lightMinutes,
      awakeMinutes: inBedMinutes - durationMinutes,
      latencyMinutes,
      awakeningsCount: latencyMinutes > 30 ? 4 : 1,
      hrvAverage,
      hrvBaseline: 52,
      restingHeartRate: restingHr,
      respiratoryRate: 14.0,
      temperatureDelta: -0.3,
      sleepDebtHours: Math.max(0, 8.0 - durationHours),
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean),
      stageEpochs: sampleEpochsBaseline
    };

    onSaveRecord(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 text-white relative">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center space-x-2.5">
            <Moon className="w-5 h-5 text-[#2DD4BF]" />
            <h3 className="text-lg font-bold">Log Custom Sleep Record</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1E293B] text-[#94A3B8] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5 text-[11px] text-[#94A3B8] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>1-Click Test Scenarios:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('perfect')}
              className="px-2.5 py-1.5 rounded-xl bg-[#2DD4BF15] border border-[#2DD4BF44] text-[#2DD4BF] text-[11px] font-bold hover:bg-[#2DD4BF30] transition cursor-pointer"
            >
              ★ Elite Recovery
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('stress')}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold hover:bg-amber-500/30 transition cursor-pointer"
            >
              ⚠️ High Stress
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('insomnia')}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[11px] font-bold hover:bg-rose-500/30 transition cursor-pointer"
            >
              ⏳ Insomnia / WASO
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#CBD5E1] font-medium block mb-1">Bedtime</label>
              <input
                type="text"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                placeholder="11:15 PM"
                className="w-full bg-[#050505] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>
            <div>
              <label className="text-[#CBD5E1] font-medium block mb-1">Wake Time</label>
              <input
                type="text"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                placeholder="06:45 AM"
                className="w-full bg-[#050505] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#CBD5E1] font-medium block mb-1">Total Sleep (hrs)</label>
              <input
                type="number"
                step="0.1"
                value={durationHours}
                onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                className="w-full bg-[#050505] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2DD4BF] font-mono"
              />
            </div>
            <div>
              <label className="text-[#CBD5E1] font-medium block mb-1">Deep SWS (min)</label>
              <input
                type="number"
                value={deepMinutes}
                onChange={(e) => setDeepMinutes(parseInt(e.target.value))}
                className="w-full bg-[#050505] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2DD4BF] font-mono"
              />
            </div>
            <div>
              <label className="text-[#CBD5E1] font-medium block mb-1">REM (min)</label>
              <input
                type="number"
                value={remMinutes}
                onChange={(e) => setRemMinutes(parseInt(e.target.value))}
                className="w-full bg-[#050505] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2DD4BF] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#CBD5E1] font-medium block mb-1">Avg HRV (ms)</label>
              <input
                type="number"
                value={hrvAverage}
                onChange={(e) => setHrvAverage(parseInt(e.target.value))}
                className="w-full bg-[#050505] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2DD4BF] font-mono"
              />
            </div>
            <div>
              <label className="text-[#CBD5E1] font-medium block mb-1">Resting HR (bpm)</label>
              <input
                type="number"
                value={restingHr}
                onChange={(e) => setRestingHr(parseInt(e.target.value))}
                className="w-full bg-[#050505] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2DD4BF] font-mono"
              />
            </div>
            <div>
              <label className="text-[#CBD5E1] font-medium block mb-1">Latency (min)</label>
              <input
                type="number"
                value={latencyMinutes}
                onChange={(e) => setLatencyMinutes(parseInt(e.target.value))}
                className="w-full bg-[#050505] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2DD4BF] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[#CBD5E1] font-medium block mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. Magnesium Glycinate, Cold Room, Sauna"
              className="w-full bg-[#050505] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2DD4BF]"
            />
          </div>

          <div className="pt-4 border-t border-[#1E293B] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-[#CBD5E1] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#050505] font-bold transition shadow-[0_0_15px_rgba(45,212,191,0.25)] flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Recalculate</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
