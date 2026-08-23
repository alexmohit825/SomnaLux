export interface SwiftFileTemplate {
  id: string;
  filename: string;
  category: 'App Core & Onboarding' | 'Diagnostic Views' | 'Cellular Science' | 'Therapeutics & Audio' | 'HealthKit & Widgets';
  description: string;
  code: string;
}

export const swiftCodeTemplates: SwiftFileTemplate[] = [
  {
    id: 'somnalux-app',
    filename: 'SomnaLuxApp.swift',
    category: 'App Core & Onboarding',
    description: 'iOS App Entry Point configuring HealthKit authorization, Dark Theme status bar, and initial launch task.',
    code: `//
//  SomnaLuxApp.swift
//  SomnaLux
//  Predictive Sleep & Cellular Longevity iOS App Entry Point
//

import SwiftUI
import HealthKit

@main
struct SomnaLuxApp: App {
    
    init() {
        // Enforce dark mode status bar & appearance
        UIView.appearance().overrideUserInterfaceStyle = .dark
    }
    
    var body: some Scene {
        WindowGroup {
            MainTabView()
                .preferredColorScheme(.dark)
                .task {
                    // Pre-request HealthKit permissions on initial launch
                    await HealthKitSleepManager.shared.requestAuthorization()
                }
        }
    }
}`
  },
  {
    id: 'main-tab-view',
    filename: 'MainTabView.swift',
    category: 'App Core & Onboarding',
    description: '7-Tab navigation container with top score header, floating audio mini-player, and onboarding sheet trigger.',
    code: `//
//  MainTabView.swift
//  SomnaLux
//  7-Tab Container & Floating Audio Mini-Player
//

import SwiftUI

public struct MainTabView: View {
    @State private var selectedTab: Int = 0
    @State private var currentRecord: SleepRecord = SleepSampleData.archetypes["baseline"]!.record
    @State private var selectedArchetypeKey: String = "baseline"
    
    // Onboarding sheet trigger
    @AppStorage("hasSeenOnboarding") private var hasSeenOnboarding: Bool = false
    @State private var showOnboarding: Bool = false
    
    // Audio engine observer
    @StateObject private var audio = AudioSynthesizerEngine.shared
    
    private let tabs = [
        (0, "Telemetry", "waveform.path.ecg"),
        (1, "Science", "atom"),
        (2, "Longevity", "shield.checkered"),
        (3, "CBT-I", "sparkles"),
        (4, "Audio", "speaker.wave.2.fill"),
        (5, "HealthKit", "heart.text.square.fill"),
        (6, "Dr. Somna", "moon.stars.fill")
    ]
    
    public var body: some View {
        ZStack(alignment: .bottom) {
            SomnaTheme.background.ignoresSafeArea()
            
            VStack(spacing: 0) {
                
                // Top Custom Header
                HStack(spacing: 12) {
                    
                    // Brand Icon & Name
                    HStack(spacing: 8) {
                        ZStack {
                            Circle()
                                .fill(SomnaTheme.primaryTeal.opacity(0.15))
                                .frame(width: 34, height: 34)
                            Image(systemName: "moon.fill")
                                .font(.system(size: 14))
                                .foregroundColor(SomnaTheme.primaryTeal)
                        }
                        
                        VStack(alignment: .leading, spacing: 0) {
                            HStack(spacing: 2) {
                                Text("Somna")
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(.white)
                                Text("Lux")
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(SomnaTheme.primaryTeal)
                            }
                            Text("Predictive Sleep Suite")
                                .font(.system(size: 9))
                                .foregroundColor(SomnaTheme.textMuted)
                        }
                    }
                    
                    Spacer()
                    
                    // Onboarding Tour Trigger
                    Button(action: { showOnboarding = true }) {
                        Image(systemName: "questionmark.circle")
                            .font(.system(size: 16))
                            .foregroundColor(SomnaTheme.circadianIndigo)
                    }
                    
                    // Score Badge
                    HStack(spacing: 6) {
                        Circle()
                            .fill(SomnaTheme.primaryTeal)
                            .frame(width: 6, height: 6)
                        Text("\\(currentRecord.restorativeScore)/100")
                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                            .foregroundColor(SomnaTheme.primaryTeal)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(SomnaTheme.cardBackground)
                    .cornerRadius(12)
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(SomnaTheme.cardBorder, lineWidth: 1))
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(SomnaTheme.cardBackground.opacity(0.95))
                .overlay(Divider().background(SomnaTheme.cardBorder), alignment: .bottom)
                
                // Active Screen Switcher
                TabView(selection: $selectedTab) {
                    SleepDashboardView(currentRecord: $currentRecord, selectedArchetypeKey: $selectedArchetypeKey, selectedTab: $selectedTab)
                        .tag(0)
                    
                    ScientificMechanismsView()
                        .tag(1)
                    
                    LongevityPrognosisView(currentRecord: $currentRecord)
                        .tag(2)
                    
                    CBTICountermeasureView(currentRecord: $currentRecord)
                        .tag(3)
                    
                    NeuromodulationStudioView()
                        .tag(4)
                    
                    HealthKitSyncView(currentRecord: $currentRecord)
                        .tag(5)
                    
                    AICoachChatView(currentRecord: $currentRecord)
                        .tag(6)
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
            }
            
            // Bottom Bar Container (Floating Mini-Player + Navigation Tabs)
            VStack(spacing: 8) {
                
                // Floating Audio Mini-Player
                if audio.isPlaying && selectedTab != 4 {
                    HStack {
                        Image(systemName: "speaker.wave.3.fill")
                            .foregroundColor(SomnaTheme.primaryTeal)
                            .font(.system(size: 12))
                        Text(audio.selectedMode.rawValue)
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.white)
                        Spacer()
                        Button(action: { audio.stop() }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(SomnaTheme.vagalRose)
                                .font(.system(size: 16))
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(SomnaTheme.cardBackground)
                    .cornerRadius(16)
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(SomnaTheme.primaryTeal.opacity(0.4), lineWidth: 1))
                    .padding(.horizontal, 16)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }
                
                // Bottom Tab Icons Bar
                HStack(spacing: 0) {
                    ForEach(tabs, id: \\.0) { tabId, title, icon in
                        let isSelected = selectedTab == tabId
                        Button(action: {
                            withAnimation(.spring(response: 0.3)) {
                                selectedTab = tabId
                            }
                        }) {
                            VStack(spacing: 4) {
                                Image(systemName: icon)
                                    .font(.system(size: 16, weight: isSelected ? .bold : .regular))
                                    .foregroundColor(isSelected ? SomnaTheme.primaryTeal : SomnaTheme.textFaint)
                                
                                Text(title)
                                    .font(.system(size: 9, weight: isSelected ? .bold : .medium))
                                    .foregroundColor(isSelected ? SomnaTheme.primaryTeal : SomnaTheme.textFaint)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                        }
                    }
                }
                .padding(.horizontal, 8)
                .background(SomnaTheme.cardBackground)
                .cornerRadius(24)
                .overlay(RoundedRectangle(cornerRadius: 24).stroke(SomnaTheme.cardBorder, lineWidth: 1))
                .padding(.horizontal, 12)
                .padding(.bottom, 6)
            }
        }
        .sheet(isPresented: $showOnboarding) {
            OnboardingTourView(isPresented: $showOnboarding)
        }
        .onAppear {
            if !hasSeenOnboarding {
                showOnboarding = true
                hasSeenOnboarding = true
            }
        }
    }
}`
  },
  {
    id: 'onboarding-tour-view',
    filename: 'OnboardingTourView.swift',
    category: 'App Core & Onboarding',
    description: 'Interactive 5-step clinical tour explaining Glymphatic detox, Vagal dipping, and the 7-module navigation architecture.',
    code: `//
//  OnboardingTourView.swift
//  SomnaLux
//  First-Time User Interactive Clinical Onboarding & Section Explainer
//

import SwiftUI

public struct OnboardingTourView: View {
    @Binding public var isPresented: Bool
    @State private var currentStep: Int = 0
    
    public var body: some View {
        ZStack {
            SomnaTheme.background.ignoresSafeArea()
            VStack(spacing: 24) {
                HStack {
                    Spacer()
                    Button("Skip Tour") { isPresented = false }
                        .font(.caption.bold())
                        .foregroundColor(SomnaTheme.textMuted)
                        .padding([.horizontal, .top], 16)
                }
                // Step Carousel (Glymphatic SWS, Vagal Dipping, 7 Modules)
                // Full source in ios/SomnaLux/Views/OnboardingTourView.swift
            }
        }
    }
}`
  },
  {
    id: 'sleep-dashboard-view',
    filename: 'SleepDashboardView.swift',
    category: 'Diagnostic Views',
    description: 'Main 6-section polysomnography dashboard with 1-click scenario tester, circular score gauge, liquid SWS reservoir, and What-If sliders.',
    code: `//
//  SleepDashboardView.swift
//  SomnaLux
//  Section-Numbered Polysomnography & Predictive Longevity Dashboard
//

import SwiftUI

public struct SleepDashboardView: View {
    @Binding public var currentRecord: SleepRecord
    @Binding public var selectedArchetypeKey: String
    @Binding public var selectedTab: Int
    
    // Live What-If Modeler State
    @State private var simExtraDeep: Double = 0
    @State private var simExtraHrv: Double = 0
    @State private var selectedEpochIndex: Int? = 2
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 28) {
                // Section 01: Clinical Sleep Profiles (1-Click Switcher)
                // Section 02: Restorative Score & SWS Reservoir (Circular Dial + Liquid Bar)
                // Section 03: Interactive What-If Modeler (Sliders)
                // Section 04: AI Pathology & 3-Step Prescriptions
                // Section 05: Polysomnography Canvas Hypnogram
                // Section 06: Autonomic Telemetry Grid (HRV, Nadir, Microclimate, Sleep Debt)
            }
            .padding(20)
        }
        .background(SomnaTheme.background.ignoresSafeArea())
    }
}`
  },
  {
    id: 'scientific-mechanisms-view',
    filename: 'ScientificMechanismsView.swift',
    category: 'Cellular Science',
    description: 'Cellular science lab with interactive AQP4 Glymphatic astrocyte shrinkage, Vagal tone slider, and 24-hr Circadian SCN clock.',
    code: `//
//  ScientificMechanismsView.swift
//  SomnaLux
//  Interactive Cellular & Molecular Sleep Science Lab
//

import SwiftUI

public struct ScientificMechanismsView: View {
    @State private var activePillar: String = "glymphatic"
    @State private var glymphaticStage: String = "deep"
    @State private var vagalStimulus: Double = 75
    @State private var circadianHour: Double = 22
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 24) {
                // Pillar 1: AQP4 Glymphatic Hydrodynamic Astrocyte Shrinkage
                // Pillar 2: Parasympathetic Vagal Brake & 10-20% BP Dipping
                // Pillar 3: 24-Hour Circadian SCN Solar Oscillator (Process S vs C)
                // Pillar 4: Endocrine Somatotropin (HGH) & GLUT4 Insulin Disposing
            }
            .padding(20)
        }
    }
}`
  },
  {
    id: 'longevity-prognosis-view',
    filename: 'LongevityPrognosisView.swift',
    category: 'Cellular Science',
    description: '10-Year cardiovascular hazard ratios, neurocognitive tau clearing trajectories, and Biological Sleep Age divergence meter.',
    code: `//
//  LongevityPrognosisView.swift
//  SomnaLux
//  10-Year Health Impact, Cardiovascular Hazard & Epigenetic Longevity
//

import SwiftUI

public struct LongevityPrognosisView: View {
    @Binding public var currentRecord: SleepRecord
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 24) {
                // Biological Sleep Age Divergence Meter (e.g. -2.1 yrs)
                // 10-Year Relative Hazard Curves (Cardiovascular, Tau, Insulin)
                // Interventions Reversal Simulator
            }
            .padding(20)
        }
    }
}`
  },
  {
    id: 'cbti-countermeasure-view',
    filename: 'CBTICountermeasureView.swift',
    category: 'Therapeutics & Audio',
    description: 'Clinical CBT-I Sleep Restriction Therapy (SRT) window prescription and Caffeine metabolic half-life decay simulator.',
    code: `//
//  CBTICountermeasureView.swift
//  SomnaLux
//  Clinical CBT-I Sleep Restriction & Caffeine Metabolic Half-Life Engine
//

import SwiftUI

public struct CBTICountermeasureView: View {
    @Binding public var currentRecord: SleepRecord
    @State private var cupsOfCoffee: Double = 2
    @State private var hoursSinceLastCaffeine: Double = 6
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 24) {
                // Sleep Restriction Window Calculator (TIB, Bedtime, Fixed Wake Anchor)
                // Caffeine Metabolic Half-Life Simulator (A1/A2A Adenosine Antagonism)
                // Evening Wind-Down Biological Anchoring Checklist
            }
            .padding(20)
        }
    }
}`
  },
  {
    id: 'neuromodulation-studio-view',
    filename: 'NeuromodulationStudioView.swift',
    category: 'Therapeutics & Audio',
    description: 'Low-latency AVAudioEngine binaural delta wave generator, live waveform oscilloscope, and animated 4-7-8 vagal breath pacer.',
    code: `//
//  NeuromodulationStudioView.swift
//  SomnaLux
//  AVAudioEngine Waveform Generator, Oscilloscope & Vagal Breath Pacer
//

import SwiftUI

public struct NeuromodulationStudioView: View {
    @StateObject private var audio = AudioSynthesizerEngine.shared
    @State private var breathPhase: String = "Inhale (4s)"
    @State private var breathScale: CGFloat = 1.0
    @State private var isPacing: Bool = false
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 24) {
                // Binaural Soundscape Generator (2.5Hz Delta, 6Hz Theta, Brown, Pink)
                // TimelineView Animated Sine Wave Oscilloscope
                // Vagal 4-7-8 Guided Breath Pacer with Pulsating Glow Aura
            }
            .padding(20)
        }
    }
}`
  },
  {
    id: 'ai-coach-chat-view',
    filename: 'AICoachChatView.swift',
    category: 'Therapeutics & Audio',
    description: 'Dr. Somna AI neurologist chat consultation interface with clinical sleep medicine knowledge base.',
    code: `//
//  AICoachChatView.swift
//  SomnaLux
//  Dr. Somna AI Sleep Neurologist Chat Consultation Interface
//

import SwiftUI

public struct AICoachChatView: View {
    @Binding public var currentRecord: SleepRecord
    @State private var inputText: String = ""
    @State private var messages: [ChatMessage] = []
    
    public var body: some View {
        VStack(spacing: 0) {
            // Header with Online Status Badge
            // ScrollView Chat Message Stream
            // Quick Clinical Prompt Chips
            // Input TextField with Send Action
        }
    }
}`
  },
  {
    id: 'healthkit-sleep-manager',
    filename: 'HealthKitSleepManager.swift',
    category: 'HealthKit & Widgets',
    description: 'Background Apple HealthKit queries for Sleep Analysis stages, HRV (SDNN/RMSSD), and Resting Heart Rate.',
    code: `//
//  HealthKitSleepManager.swift
//  SomnaLux
//  Apple HealthKit Telemetry & Background Observer Service
//

import Foundation
import HealthKit
import Combine

@MainActor
public final class HealthKitSleepManager: ObservableObject {
    public static let shared = HealthKitSleepManager()
    private let healthStore = HKHealthStore()
    
    @Published public var isAuthorized: Bool = false
    @Published public var latestRecord: SleepRecord?
    
    public func requestAuthorization() async {
        // Read types: .sleepAnalysis, .heartRateVariabilitySDNN, .restingHeartRate, .respiratoryRate
    }
    
    public func fetchLastNightSleepData() async {
        // Sample queries with strict start date filtering
    }
}`
  },
  {
    id: 'audio-synthesizer-engine',
    filename: 'AudioSynthesizerEngine.swift',
    category: 'HealthKit & Widgets',
    description: 'AVAudioEngine in Swift producing Delta (0.5-4Hz) binaural beats and organic Brown Noise in real-time.',
    code: `//
//  AudioSynthesizerEngine.swift
//  SomnaLux
//  Native AVAudioEngine Binaural Beat & Neuromodulation Waveform Generator
//

import Foundation
import AVFoundation
import Combine

@MainActor
public final class AudioSynthesizerEngine: ObservableObject {
    public static let shared = AudioSynthesizerEngine()
    private var audioEngine = AVAudioEngine()
    
    @Published public var isPlaying: Bool = false
    @Published public var selectedMode: SoundscapeMode = .delta
    @Published public var masterVolume: Float = 0.65
    
    public func play(mode: SoundscapeMode) {
        // AVAudioSourceNode stereo sample generation
    }
    
    public func stop() {
        audioEngine.stop()
        isPlaying = false
    }
}`
  },
  {
    id: 'somnalux-widget',
    filename: 'SomnaLuxWidget.swift',
    category: 'HealthKit & Widgets',
    description: 'iOS 17+ WidgetKit Lock Screen & Home Screen Sleep Score Widget with Dynamic Island live activities.',
    code: `//
//  SomnaLuxWidget.swift
//  SomnaLux
//  iOS 17+ Lock Screen, Dynamic Island & Home Screen Sleep Score Widget
//

import WidgetKit
import SwiftUI

public struct SomnaLuxWidgetEntryView : View {
    public var entry: SleepScoreEntry
    @Environment(\\.widgetFamily) var family

    public var body: some View {
        // AccessoryCircular, AccessoryRectangular, and SystemSmall
    }
}`
  },
  {
    id: 'theme-design-system',
    filename: 'Theme.swift',
    category: 'App Core & Onboarding',
    description: 'Design System token definitions, luxury dark theme palette (#050505, #2DD4BF, #818CF8), and luxuryCard modifier.',
    code: `//
//  Theme.swift
//  SomnaLux
//  Design System & Luxury Dark Theme Tokens
//

import SwiftUI

public enum SomnaTheme {
    public static let background = Color(hex: 0x050505)
    public static let cardBackground = Color(hex: 0x0F172A)
    public static let cardBorder = Color(hex: 0x1E293B)
    public static let primaryTeal = Color(hex: 0x2DD4BF)
    public static let circadianIndigo = Color(hex: 0x818CF8)
    public static let vagalRose = Color(hex: 0xF43F5E)
    public static let remLavender = Color(hex: 0xC084FC)
    public static let warningAmber = Color(hex: 0xF59E0B)
}`
  },
  {
    id: 'sleep-models',
    filename: 'SleepModels.swift',
    category: 'App Core & Onboarding',
    description: 'Data models for SleepStageType, SleepEpoch, SleepRecord, Clinical Archetypes, and longevity calculations.',
    code: `//
//  SleepModels.swift
//  SomnaLux
//  Data models for Polysomnography, Stages, Archetypes, and Longevity
//

import Foundation
import SwiftUI

public enum SleepStageType: String, CaseIterable, Identifiable, Sendable {
    case awake = "Awake"
    case rem = "REM"
    case light = "Light"
    case deep = "Deep (SWS)"
}`
  }
];
