import React from 'react';
import { Moon, Sparkles, Activity, ShieldCheck, Volume2, VolumeX, Smartphone, Microscope, Plus } from 'lucide-react';
import { SleepRecord, UserProfile } from '../types';
import { sleepArchetypes } from '../data/mockSleepData';

interface HeaderProps {
  currentRecord: SleepRecord;
  userProfile: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectArchetype: (archetypeKey: string) => void;
  selectedArchetypeKey: string;
  isAudioPlaying: boolean;
  onStopAudio: () => void;
  onOpenLogModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRecord,
  userProfile,
  activeTab,
  setActiveTab,
  onSelectArchetype,
  selectedArchetypeKey,
  isAudioPlaying,
  onStopAudio,
  onOpenLogModal
}) => {
  const efficiency = Math.round(currentRecord.efficiency);
  const deepPct = Math.round((currentRecord.deepMinutes / currentRecord.durationMinutes) * 100);
  const score = Math.round(Math.min(100, Math.max(35, (efficiency * 0.4) + (deepPct * 1.6) + (currentRecord.hrvAverage * 0.3))));

  const navTabs = [
    { id: 'dashboard', num: '01', label: 'Telemetry & Diagnosis', icon: Activity },
    { id: 'science', num: '02', label: 'Cellular Science', icon: Microscope, badge: 'Core' },
    { id: 'longevity', num: '03', label: '10-Yr Longevity', icon: ShieldCheck },
    { id: 'interventions', num: '04', label: 'CBT-I Clinic', icon: Sparkles },
    { id: 'neuromodulation', num: '05', label: 'Audio & Breath', icon: Volume2 },
    { id: 'swift-code', num: '06', label: 'Native Swift iOS', icon: Smartphone, badge: 'iOS 17' },
    { id: 'ai-consult', num: '07', label: 'Dr. Somna AI', icon: Moon }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-2xl border-b border-[#1E293B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6366F1]/30 via-[#2DD4BF]/20 to-[#0F172A] border border-[#2DD4BF44] shadow-[0_0_20px_rgba(45,212,191,0.25)] cursor-pointer"
            >
              <Moon className="w-5 h-5 text-[#2DD4BF]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2DD4BF]"></span>
              </span>
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                  Somna<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] via-[#818CF8] to-[#6366F1]">Lux</span>
                </h1>
                <span className="px-2.5 py-0.5 text-[9px] uppercase font-extrabold tracking-widest bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF33] rounded-full">
                  Clinical Sleep Suite
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] hidden sm:block">
                Predictive Sleep Medicine & Cellular Longevity Architecture
              </p>
            </div>
          </div>

          {/* Quick Actions & Live Status */}
          <div className="flex items-center space-x-3">
            {/* Audio Indicator */}
            {isAudioPlaying && (
              <button
                onClick={onStopAudio}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#2DD4BF15] border border-[#2DD4BF55] text-[#2DD4BF] text-xs font-semibold animate-pulse hover:bg-[#2DD4BF25] transition cursor-pointer"
                title="Click to stop synthesizer audio"
              >
                <Volume2 className="w-4 h-4 text-[#2DD4BF]" />
                <span className="hidden md:inline">Audio Synthesizer Active</span>
                <VolumeX className="w-3.5 h-3.5 ml-1 opacity-70" />
              </button>
            )}

            {/* Quick Profile Dropdown */}
            <div className="hidden lg:flex items-center space-x-2 bg-[#0F172A] border border-[#1E293B] rounded-2xl px-3.5 py-1.5">
              <span className="text-xs text-[#64748B] font-medium">Profile:</span>
              <select
                value={selectedArchetypeKey}
                onChange={(e) => onSelectArchetype(e.target.value)}
                className="bg-transparent text-xs text-[#2DD4BF] font-semibold focus:outline-none cursor-pointer"
              >
                {Object.entries(sleepArchetypes).map(([key, arch]) => (
                  <option key={key} value={key} className="bg-[#0F172A] text-[#F9FAFB]">
                    {arch.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Restorative Score Badge */}
            <div className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-2xl bg-[#0F172A] border border-[#1E293B]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF]" />
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold tracking-wider text-[#64748B] leading-none">Score</div>
                <div className="text-sm font-bold text-[#2DD4BF] leading-tight">{score}/100</div>
              </div>
            </div>

            {/* + Log Night Button */}
            <button
              onClick={onOpenLogModal}
              className="px-4 py-2 rounded-2xl bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#050505] text-xs font-bold transition-all shadow-[0_0_15px_rgba(45,212,191,0.25)] flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Sleep</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Modular Navigation Bar */}
        <nav className="flex space-x-2 overflow-x-auto scrollbar-none pb-2 pt-1 border-t border-[#1E293B]/60">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF44] shadow-[0_0_12px_rgba(45,212,191,0.15)]'
                    : 'text-[#94A3B8] hover:text-[#F9FAFB] hover:bg-[#0F172A] border border-transparent'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-[#2DD4BF] text-[#050505]' : 'bg-[#1E293B] text-[#64748B]'
                }`}>
                  {tab.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2DD4BF]' : 'text-[#64748B]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-[8px] font-bold bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/40 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
