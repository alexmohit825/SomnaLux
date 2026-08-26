//
//  CBTICountermeasureView.swift
//  SomnaLux
//  Clinical CBT-I Sleep Restriction & Caffeine Metabolic Half-Life Engine with Orientation Guides
//

import SwiftUI

public struct CBTICountermeasureView: View {
    @Binding public var currentRecord: SleepRecord
    
    // Caffeine decay state
    @State private var cupsOfCoffee: Double = 2
    @State private var hoursSinceLastCaffeine: Double = 6
    
    // Wind down checklist
    @State private var task1Done: Bool = true
    @State private var task2Done: Bool = false
    @State private var task3Done: Bool = false
    
    public init(currentRecord: Binding<SleepRecord>) {
        self._currentRecord = currentRecord
    }
    
    private var caffeineRemainingMg: Int {
        let initialMg = cupsOfCoffee * 100.0
        let halfLifeHours = 5.0
        let remaining = initialMg * pow(0.5, hoursSinceLastCaffeine / halfLifeHours)
        return Int(round(remaining))
    }
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 24) {
                
                // Hero Banner
                VStack(alignment: .leading, spacing: 10) {
                    HStack(spacing: 6) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(SomnaTheme.circadianIndigo)
                        Text("GOLD-STANDARD INSOMNIA PROTOCOLS")
                            .font(.system(size: 9, weight: .heavy, design: .monospaced))
                            .foregroundColor(SomnaTheme.circadianIndigo)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(SomnaTheme.circadianIndigo.opacity(0.12))
                    .cornerRadius(8)
                    
                    Text("CBT-I Digital Therapeutics Clinic")
                        .font(.system(size: 20, weight: .heavy))
                        .foregroundColor(.white)
                    
                    Text("Evidence-based Cognitive Behavioral Therapy for Insomnia (CBT-I) to extinguish conditioned bedroom arousal and consolidate sleep drive.")
                        .font(.system(size: 12))
                        .foregroundColor(SomnaTheme.textSecondary)
                        .lineSpacing(3)
                }
                .padding(20)
                .luxuryCard(borderColor: SomnaTheme.circadianIndigo.opacity(0.3))
                
                // Clinic Orientation Card
                HStack(alignment: .top, spacing: 10) {
                    Image(systemName: "info.circle.fill")
                        .font(.system(size: 14))
                        .foregroundColor(SomnaTheme.circadianIndigo)
                        .padding(.top, 2)
                    
                    VStack(alignment: .leading, spacing: 3) {
                        Text("What is CBT-I & How to Use This Clinic:")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.white)
                        Text("CBT-I is the #1 first-line clinical treatment for insomnia. It uses sleep restriction, circadian anchoring, and metabolic hygiene to retrain your brain that the bed is solely for sleep.")
                            .font(.system(size: 11))
                            .foregroundColor(SomnaTheme.textSecondary)
                            .lineSpacing(2)
                    }
                }
                .padding(14)
                .luxuryCard(borderColor: SomnaTheme.circadianIndigo.opacity(0.25))
                
                // Sleep Restriction Window Calculator Card
                VStack(alignment: .leading, spacing: 14) {
                    Text("Sleep Restriction Therapy (SRT) Prescription")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                    
                    Text("💡 How Sleep Restriction works: Instead of lying awake in bed tossing and turning, we temporarily compress your bed window to match your actual sleep capacity. This builds intense homeostatic sleep pressure, boosting your deep sleep.")
                        .font(.system(size: 11))
                        .foregroundColor(SomnaTheme.textMuted)
                        .lineSpacing(2)
                    
                    HStack(spacing: 12) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("TARGET BEDTIME")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(SomnaTheme.textFaint)
                            Text("11:30 PM")
                                .font(.system(size: 16, weight: .bold, design: .monospaced))
                                .foregroundColor(SomnaTheme.primaryTeal)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(SomnaTheme.secondaryCard)
                        .cornerRadius(12)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("FIXED WAKE ANCHOR")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(SomnaTheme.textFaint)
                            Text("06:30 AM")
                                .font(.system(size: 16, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(SomnaTheme.secondaryCard)
                        .cornerRadius(12)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("PRESCRIBED TIB")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(SomnaTheme.textFaint)
                            Text("7.0 hrs")
                                .font(.system(size: 16, weight: .bold, design: .monospaced))
                                .foregroundColor(SomnaTheme.circadianIndigo)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(12)
                        .background(SomnaTheme.secondaryCard)
                        .cornerRadius(12)
                    }
                    
                    Text("Clinical Rule: As your 5-day rolling efficiency exceeds 85%, expand your bed window by +15 minutes earlier until reaching 8 hours.")
                        .font(.system(size: 11))
                        .foregroundColor(SomnaTheme.textSecondary)
                        .lineSpacing(2)
                }
                .padding(20)
                .luxuryCard()
                
                // Caffeine Half-Life Decay Simulator
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        Text("Metabolic Caffeine Half-Life Simulator")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        Spacer()
                        Text("\(caffeineRemainingMg) mg Active")
                            .font(.system(size: 12, weight: .bold, design: .monospaced))
                            .foregroundColor(caffeineRemainingMg > 50 ? SomnaTheme.warningAmber : SomnaTheme.primaryTeal)
                    }
                    
                    Text("💡 How caffeine disrupts SWS: Caffeine blocks A1/A2A adenosine receptors without clearing fatigue. Even if you fall asleep, caffeine in the bloodstream suppresses slow-wave delta sleep spindles by up to 35%.")
                        .font(.system(size: 11))
                        .foregroundColor(SomnaTheme.textMuted)
                        .lineSpacing(2)
                    
                    VStack(spacing: 12) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Cups of Coffee: \(Int(cupsOfCoffee)) (~100mg each)")
                                .font(.system(size: 11))
                                .foregroundColor(SomnaTheme.textSecondary)
                            Slider(value: $cupsOfCoffee, in: 1...5, step: 1)
                                .accentColor(SomnaTheme.warningAmber)
                        }
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Hours Since Last Sip: \(Int(hoursSinceLastCaffeine)) hours")
                                .font(.system(size: 11))
                                .foregroundColor(SomnaTheme.textSecondary)
                            Slider(value: $hoursSinceLastCaffeine, in: 0...16, step: 1)
                                .accentColor(SomnaTheme.circadianIndigo)
                        }
                    }
                    
                    Text("Guidance: Aim for a strict 10-hour caffeine cutoff before your scheduled bedtime to ensure less than 25mg active caffeine remains.")
                        .font(.system(size: 11))
                        .foregroundColor(SomnaTheme.textSecondary)
                        .lineSpacing(2)
                }
                .padding(20)
                .luxuryCard(borderColor: SomnaTheme.warningAmber.opacity(0.3))
                
                // Evening Wind-Down Checklist
                VStack(alignment: .leading, spacing: 14) {
                    Text("Evening Biological Anchoring Routine")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                    
                    Text("💡 Complete these 3 somatic triggers 45 minutes before bedtime to shift your autonomic nervous system from fight-or-flight into rest-and-digest mode.")
                        .font(.system(size: 11))
                        .foregroundColor(SomnaTheme.textMuted)
                        .lineSpacing(2)
                    
                    VStack(spacing: 8) {
                        ChecklistRow(done: $task1Done, title: "Thermal microclimate set to 66°F", sub: "Triggers peripheral vascular vasodilation to dump core heat")
                        ChecklistRow(done: $task2Done, title: "Dim blue light photons (<10 lux)", sub: "Unblocks pineal gland melatonin synthesis")
                        ChecklistRow(done: $task3Done, title: "6 Cycles of 4-7-8 Vagal Breathing", sub: "Stimulates acetylcholine sinoatrial brake to slow resting heart rate")
                    }
                }
                .padding(20)
                .luxuryCard()
                
            }
            .padding(20)
            .padding(.bottom, 80)
        }
        .background(SomnaTheme.background.ignoresSafeArea())
    }
}

private struct ChecklistRow: View {
    @Binding var done: Bool
    let title: String
    let sub: String
    
    var body: some View {
        Button(action: { done.toggle() }) {
            HStack(spacing: 12) {
                Image(systemName: done ? "checkmark.square.fill" : "square")
                    .font(.system(size: 16))
                    .foregroundColor(done ? SomnaTheme.primaryTeal : SomnaTheme.textFaint)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(done ? .white : SomnaTheme.textSecondary)
                    Text(sub)
                        .font(.system(size: 10))
                        .foregroundColor(SomnaTheme.textMuted)
                }
                Spacer()
            }
            .padding(12)
            .background(SomnaTheme.secondaryCard)
            .cornerRadius(12)
        }
    }
}
