import React, { useState } from 'react';
import { 
  Send, Sparkles, Moon, Brain, ShieldCheck, 
  HelpCircle, User, Bot, RotateCcw
} from 'lucide-react';
import { SleepRecord, UserProfile } from '../types';

interface AICoachChatProps {
  record: SleepRecord;
  userProfile: UserProfile;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'doctor';
  text: string;
  timestamp: string;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({
  record,
  userProfile
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'doctor',
      text: `Hello ${userProfile.name}. I am Dr. Somna, your AI Sleep Neurologist and Somnologist. I've analyzed your telemetry from last night (SWS Deep Sleep: ${record.deepMinutes}m, Nocturnal HRV: ${record.hrvAverage}ms, Sleep Latency: ${record.latencyMinutes}m). How can I assist you with your sleep architecture, CBT-I protocols, or biomarker recovery today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const samplePromptChips = [
    'How do I double my Deep Slow-Wave Sleep (SWS)?',
    'What is the science on Magnesium Glycinate vs L-Threonate?',
    'Why did my nocturnal HRV drop last night?',
    'How do I reset a 2-hour circadian phase delay (jet lag)?',
    'Explain the 20-minute stimulus control rule for 3 AM insomnia.'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-sleep-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          sleepData: record
        })
      });
      const data = await response.json();

      const doctorMsg: ChatMessage = {
        id: `doc-${Date.now()}`,
        sender: 'doctor',
        text: data.reply || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, doctorMsg]);
    } catch (err) {
      console.error('Error in chat doctor:', err);
      const errorMsg: ChatMessage = {
        id: `doc-${Date.now()}`,
        sender: 'doctor',
        text: 'I apologize, but I could not reach the clinical reasoning engine. Please ensure your network connection is active.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E1B4B]/70 via-[#0F172A] to-[#1E1B4B]/70 border border-[#312E81] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2DD4BF15] text-[#2DD4BF] border border-[#2DD4BF44] text-[10px] font-bold uppercase tracking-widest">
            <Moon className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Gemini 3.7 Flash Clinical Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
            Consult Dr. Somna (AI Sleep Specialist)
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Get instant, peer-reviewed clinical answers regarding polysomnography, circadian rhythm bio-tuning, sleep hygiene pharmacology, and insomnia interventions.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-6 sm:p-7 shadow-2xl flex flex-col h-[620px] justify-between space-y-4">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((msg) => {
            const isDoc = msg.sender === 'doctor';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isDoc ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isDoc 
                    ? 'bg-[#2DD4BF] text-[#050505] shadow-[0_0_12px_rgba(45,212,191,0.3)]' 
                    : 'bg-[#1E293B] text-[#CBD5E1]'
                }`}>
                  {isDoc ? <Moon className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                  isDoc
                    ? 'bg-[#050505] border border-[#1E293B] text-[#F9FAFB] shadow-md'
                    : 'bg-[#6366F1] text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                }`}>
                  <div className="flex items-center justify-between text-[10px] opacity-70 mb-1">
                    <span>{isDoc ? 'Dr. Somna, MD PhD' : userProfile.name}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-[#2DD4BF15] flex items-center justify-center text-[#2DD4BF]">
                <Moon className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-3 text-xs text-[#94A3B8]">
                Synthesizing chronobiology and sleep architecture recommendations...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="pt-3 border-t border-[#1E293B] space-y-2">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">
            Suggested Clinical Topics:
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {samplePromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-3.5 py-1.5 rounded-full bg-[#050505] hover:bg-[#1E293B] border border-[#1E293B] text-[#CBD5E1] hover:text-white text-[11px] whitespace-nowrap transition cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2 pt-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Dr. Somna about your sleep metrics, supplements, or circadian rhythms..."
              className="flex-1 bg-[#050505] border border-[#1E293B] rounded-2xl px-4 py-3 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#2DD4BF]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-3 rounded-2xl bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#050505] font-bold transition disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(45,212,191,0.25)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
