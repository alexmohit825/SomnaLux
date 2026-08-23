import React, { useState } from 'react';
import { 
  Code2, Copy, Check, Download, Smartphone, Apple, 
  FileCode, Sparkles, Layers, ShieldCheck, ArrowRight, ExternalLink
} from 'lucide-react';
import { swiftCodeTemplates, SwiftFileTemplate } from '../data/swiftCodeTemplates';

export const SwiftCodeStudio: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>(swiftCodeTemplates[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const currentFile = swiftCodeTemplates.find(f => f.id === selectedFileId) || swiftCodeTemplates[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadActiveFile = () => {
    const element = document.createElement('a');
    const file = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = currentFile.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadAllBundle = () => {
    // Generate combined Swift bundle text
    const fullProjectBundle = swiftCodeTemplates.map(f => `// ==========================================\n// FILE: ${f.filename}\n// CATEGORY: ${f.category}\n// ==========================================\n\n${f.code}\n\n`).join('\n');
    const element = document.createElement('a');
    const file = new Blob([fullProjectBundle], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'SomnaLux_Native_Swift_Bundle.swift';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E1B4B]/70 via-[#0F172A] to-[#1E1B4B]/70 border border-[#312E81] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/40 text-[10px] font-bold uppercase tracking-widest">
            <Smartphone className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>Native iOS 17+ / Swift 5.9 Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
            Native Swift & SwiftUI Codebase Exporter
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Ready-to-deploy native Swift code modules for the Apple App Store. Featuring <strong>Apple HealthKit</strong> background telemetry, GPU-accelerated <strong>SwiftUI Canvas hypnograms</strong>, <strong>WidgetKit</strong> lockscreen widgets, and <strong>AVAudioEngine</strong> synthesis.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Swift File Explorer Navigator */}
        <div className="lg:col-span-4 bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center space-x-2">
              <Apple className="w-4 h-4 text-white" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">
                Xcode Project Files
              </span>
            </div>
            <span className="text-[10px] font-mono bg-[#1E1B4B] text-[#818CF8] px-2.5 py-0.5 rounded border border-[#312E81]">
              Swift 5.9
            </span>
          </div>

          {/* Files List grouped by category */}
          <div className="space-y-2">
            {swiftCodeTemplates.map((file) => {
              const isSelected = selectedFileId === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all duration-200 flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#050505] border-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'bg-[#050505] border-[#1E293B] hover:border-[#334155]'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-[#2DD4BF]' : 'text-[#64748B]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold truncate ${isSelected ? 'text-white' : 'text-[#CBD5E1]'}`}>
                        {file.filename}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                      {file.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Download Bundle Action */}
          <div className="pt-4 border-t border-[#1E293B] space-y-2">
            <button
              onClick={handleDownloadAllBundle}
              className="w-full py-3 rounded-2xl bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#050505] text-xs font-bold transition shadow-[0_0_20px_rgba(45,212,191,0.25)] flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Swift Project (.swift)</span>
            </button>
            <p className="text-[10px] text-[#64748B] text-center">
              Directly importable into Xcode for iOS & watchOS target compilation.
            </p>
          </div>
        </div>

        {/* Right: Code Viewer & Actions */}
        <div className="lg:col-span-8 bg-[#0F172A] border border-[#1E293B] rounded-[32px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between space-y-4">
          
          {/* Active File Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E293B] gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#818CF8] bg-[#1E1B4B] px-2 py-0.5 rounded border border-[#312E81]">
                  {currentFile.category}
                </span>
                <h3 className="text-base font-bold font-mono text-white">
                  {currentFile.filename}
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                {currentFile.description}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-[#F9FAFB] text-xs font-semibold transition flex items-center space-x-1.5 border border-[#334155] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownloadActiveFile}
                className="px-3.5 py-1.5 rounded-xl bg-[#6366F1]/20 hover:bg-[#6366F1]/30 text-[#818CF8] text-xs font-semibold transition flex items-center space-x-1.5 border border-[#6366F1]/40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save .swift</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="bg-[#050505] border border-[#1E293B] rounded-2xl p-4 overflow-x-auto max-h-[500px] scrollbar-thin">
            <pre className="text-xs font-mono text-[#CBD5E1] leading-relaxed">
              <code>{currentFile.code}</code>
            </pre>
          </div>

          {/* Native Architecture Highlights */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#94A3B8]">
            <div className="p-3 bg-[#050505] rounded-xl border border-[#1E293B]">
              <strong className="text-white block mb-0.5">HealthKit Background Delivery</strong>
              <span>Automatic wake-up query when user awakes</span>
            </div>
            <div className="p-3 bg-[#050505] rounded-xl border border-[#1E293B]">
              <strong className="text-white block mb-0.5">WidgetKit Lockscreen</strong>
              <span>Circular & rectangular complications</span>
            </div>
            <div className="p-3 bg-[#050505] rounded-xl border border-[#1E293B]">
              <strong className="text-white block mb-0.5">App Store Compliant</strong>
              <span>Strictly adheres to Apple HealthKit Privacy Guidelines</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
