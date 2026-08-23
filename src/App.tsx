import React, { useState } from 'react';
import { Header } from './components/Header';
import { SleepDashboard } from './components/SleepDashboard';
import { ScientificMechanisms } from './components/ScientificMechanisms';
import { LongevityPrognosis } from './components/LongevityPrognosis';
import { InterventionsClinic } from './components/InterventionsClinic';
import { NeuromodulationStudio } from './components/NeuromodulationStudio';
import { SwiftCodeStudio } from './components/SwiftCodeStudio';
import { AICoachChat } from './components/AICoachChat';
import { LogSleepModal } from './components/LogSleepModal';
import { mockSleepHistory, sleepArchetypes, initialUserProfile } from './data/mockSleepData';
import { SleepRecord, UserProfile } from './types';
import { sleepAudio } from './utils/audioSynthesizer';
import { Volume2, VolumeX, Moon, Sparkles } from 'lucide-react';

export default function App() {
  const [currentRecord, setCurrentRecord] = useState<SleepRecord>(mockSleepHistory[0]);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedArchetypeKey, setSelectedArchetypeKey] = useState<string>('baseline');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // Switch clinical archetype
  const handleSelectArchetype = (key: string) => {
    setSelectedArchetypeKey(key);
    if (sleepArchetypes[key]) {
      setCurrentRecord(sleepArchetypes[key].record);
    }
  };

  const handleStopAudio = () => {
    sleepAudio.stopAll();
    setIsAudioPlaying(false);
  };

  const handleSaveCustomRecord = (newRecord: SleepRecord) => {
    setCurrentRecord(newRecord);
    setSelectedArchetypeKey('custom');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F9FAFB] flex flex-col font-sans selection:bg-[#2DD4BF]/30 selection:text-[#2DD4BF]">
      
      {/* Top Header */}
      <Header
        currentRecord={currentRecord}
        userProfile={userProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectArchetype={handleSelectArchetype}
        selectedArchetypeKey={selectedArchetypeKey}
        isAudioPlaying={isAudioPlaying}
        onStopAudio={handleStopAudio}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <SleepDashboard
            record={currentRecord}
            userProfile={userProfile}
            onNavigateToInterventions={() => setActiveTab('interventions')}
            onNavigateToLongevity={() => setActiveTab('longevity')}
            onNavigateToScience={() => setActiveTab('science')}
            onNavigateToNeuromodulation={() => setActiveTab('neuromodulation')}
            onSelectArchetype={handleSelectArchetype}
            selectedArchetypeKey={selectedArchetypeKey}
          />
        )}

        {activeTab === 'science' && (
          <ScientificMechanisms
            record={currentRecord}
            userProfile={userProfile}
            onNavigateToInterventions={() => setActiveTab('interventions')}
            onNavigateToNeuromodulation={() => setActiveTab('neuromodulation')}
          />
        )}

        {activeTab === 'longevity' && (
          <LongevityPrognosis
            record={currentRecord}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'interventions' && (
          <InterventionsClinic
            record={currentRecord}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'neuromodulation' && (
          <NeuromodulationStudio
            isAudioPlaying={isAudioPlaying}
            setIsAudioPlaying={setIsAudioPlaying}
          />
        )}

        {activeTab === 'swift-code' && (
          <SwiftCodeStudio />
        )}

        {activeTab === 'ai-consult' && (
          <AICoachChat
            record={currentRecord}
            userProfile={userProfile}
          />
        )}
      </main>

      {/* Persistent Audio Mini-Player Bar (When Audio Is Active on other tabs) */}
      {isAudioPlaying && activeTab !== 'neuromodulation' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-[#0F172A]/95 border border-[#2DD4BF44] backdrop-blur-2xl rounded-full px-6 py-3 shadow-[0_0_30px_rgba(45,212,191,0.25)] flex items-center space-x-4 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2DD4BF]"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-[#2DD4BF]">
              Acoustic Neuromodulation Active
            </span>
          </div>
          
          <button
            onClick={() => setActiveTab('neuromodulation')}
            className="text-xs text-[#94A3B8] hover:text-white underline font-medium cursor-pointer"
          >
            Adjust Frequency
          </button>

          <button
            onClick={handleStopAudio}
            className="p-1 rounded-full bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white transition cursor-pointer"
          >
            <VolumeX className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      )}

      {/* Manual Sleep Log Modal */}
      <LogSleepModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSaveRecord={handleSaveCustomRecord}
        currentRecord={currentRecord}
      />

      {/* Footer */}
      <footer className="border-t border-[#1E293B] bg-[#050505] py-8 text-center text-xs text-[#64748B] space-y-2">
        <div className="flex items-center justify-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
          <span className="text-[#CBD5E1] font-semibold">SomnaLux Clinical Sleep Science & Longevity Suite</span>
          <span className="text-[#334155]">•</span>
          <span>Offline Web Audio API</span>
          <span className="text-[#334155]">•</span>
          <span>Apple HealthKit Swift Core</span>
        </div>
        <p className="text-[11px] text-[#64748B]">
          Algorithmic analysis modeled after polysomnographic standards (AASM), Glymphatic Hydrodynamics (Science), and Autonomic Vagal Tone.
        </p>
      </footer>

    </div>
  );
}
