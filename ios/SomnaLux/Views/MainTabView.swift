//
//  MainTabView.swift
//  SomnaLux
//  7-Tab Container & Floating Audio Mini-Player with Orientation & Sensor Guides
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
                        HStack(spacing: 4) {
                            Image(systemName: "lightbulb.fill")
                                .font(.system(size: 11))
                            Text("Guide")
                                .font(.system(size: 11, weight: .bold))
                        }
                        .foregroundColor(SomnaTheme.warningAmber)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 5)
                        .background(SomnaTheme.warningAmber.opacity(0.15))
                        .cornerRadius(10)
                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(SomnaTheme.warningAmber.opacity(0.3), lineWidth: 1))
                    }
                    
                    // Score Badge
                    HStack(spacing: 6) {
                        Circle()
                            .fill(SomnaTheme.primaryTeal)
                            .frame(width: 6, height: 6)
                        Text("\(currentRecord.restorativeScore)/100")
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
                
                // Floating Audio Mini-Player (Shows when playing audio outside tab 4)
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
                    ForEach(tabs, id: \.0) { tabId, title, icon in
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
}

// HealthKit Telemetry & Sensor Orientation Tab View
private struct HealthKitSyncView: View {
    @Binding var currentRecord: SleepRecord
    @StateObject private var hk = HealthKitSleepManager.shared
    @State private var syncStatus: String = "Ready to Sync"
    
    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 24) {
                
                // Hero Banner
                VStack(alignment: .leading, spacing: 10) {
                    HStack(spacing: 6) {
                        Image(systemName: "heart.text.square.fill")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(SomnaTheme.vagalRose)
                        Text("BACKGROUND HEALTHKIT TELEMETRY")
                            .font(.system(size: 9, weight: .heavy, design: .monospaced))
                            .foregroundColor(SomnaTheme.vagalRose)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(SomnaTheme.vagalRose.opacity(0.12))
                    .cornerRadius(8)
                    
                    Text("Apple Watch Polysomnography Sync")
                        .font(.system(size: 20, weight: .heavy))
                        .foregroundColor(.white)
                    
                    Text("Stream high-precision sleep stages (Deep SWS, REM, Core), nocturnal HRV (SDNN/RMSSD), resting heart rate nadir, and respiratory rate directly from Apple Watch sensors.")
                        .font(.system(size: 12))
                        .foregroundColor(SomnaTheme.textSecondary)
                        .lineSpacing(3)
                }
                .padding(20)
                .luxuryCard(borderColor: SomnaTheme.vagalRose.opacity(0.3))
                
                // Orientation & Sensor Card
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 8) {
                        Image(systemName: "applewatch")
                            .foregroundColor(SomnaTheme.primaryTeal)
                        Text("How Apple Watch Measures Sleep Architecture:")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        SensorInfoRow(
                            sensor: "Photoplethysmography (PPG)",
                            desc: "Green and infrared LED optical sensors capture pulse wave velocity to compute real-time Heart Rate Variability (HRV)."
                        )
                        SensorInfoRow(
                            sensor: "3-Axis Accelerometer & Gyroscope",
                            desc: "Tracks micromovements and wrist posture to detect awake arousals (WASO) versus deep somatic immobility."
                        )
                        SensorInfoRow(
                            sensor: "Machine Learning Classifier",
                            desc: "Apple's neural net translates heart rate and movement signals into Deep SWS, REM, and Core sleep stages."
                        )
                    }
                }
                .padding(20)
                .luxuryCard()
                
                // Sync Action Card
                VStack(spacing: 16) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("TELEMETRY STATUS")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(SomnaTheme.textFaint)
                            Text(syncStatus)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                        }
                        Spacer()
                        Circle()
                            .fill(SomnaTheme.primaryTeal)
                            .frame(width: 10, height: 10)
                    }
                    
                    Button(action: {
                        syncStatus = "Reading Apple HealthKit..."
                        Task {
                            await hk.requestAuthorization()
                            if let rec = hk.latestRecord {
                                currentRecord = rec
                                syncStatus = "Synced: \(rec.durationHoursString)h (\(rec.deepMinutes)m SWS)"
                            } else {
                                syncStatus = "Using local simulation baseline"
                            }
                        }
                    }) {
                        HStack(spacing: 8) {
                            Image(systemName: "arrow.triangle.2.circlepath")
                                .font(.system(size: 14, weight: .bold))
                            Text("Sync Last Night's Apple Watch Telemetry")
                                .font(.system(size: 13, weight: .bold))
                        }
                        .foregroundColor(SomnaTheme.background)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(SomnaTheme.primaryTeal)
                        .cornerRadius(16)
                        .shadow(color: SomnaTheme.primaryTeal.opacity(0.3), radius: 10)
                    }
                    
                    HStack(spacing: 6) {
                        Image(systemName: "lock.shield.fill")
                            .font(.system(size: 11))
                            .foregroundColor(SomnaTheme.primaryTeal)
                        Text("100% Private: All health computations occur on-device. No telemetry is logged or transmitted to third parties.")
                            .font(.system(size: 10))
                            .foregroundColor(SomnaTheme.textMuted)
                    }
                }
                .padding(20)
                .luxuryCard(borderColor: SomnaTheme.primaryTeal.opacity(0.3))
                
            }
            .padding(20)
            .padding(.bottom, 80)
        }
        .background(SomnaTheme.background.ignoresSafeArea())
    }
}

private struct SensorInfoRow: View {
    let sensor: String
    let desc: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(sensor)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(SomnaTheme.primaryTeal)
            Text(desc)
                .font(.system(size: 11))
                .foregroundColor(SomnaTheme.textSecondary)
                .lineSpacing(2)
        }
        .padding(10)
        .background(SomnaTheme.secondaryCard)
        .cornerRadius(10)
    }
}
