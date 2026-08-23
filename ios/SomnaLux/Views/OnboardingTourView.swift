//
//  OnboardingTourView.swift
//  SomnaLux
//  First-Time User Interactive Clinical Onboarding & Section Explainer
//

import SwiftUI

public struct OnboardingTourView: View {
    @Binding public var isPresented: Bool
    @State private var currentStep: Int = 0
    
    private let steps: [OnboardingStep] = [
        OnboardingStep(
            tag: "WELCOME TO SOMNALUX",
            title: "Predictive Sleep Medicine & Cellular Longevity",
            subtitle: "SomnaLux is not just a sleep tracker. It is a biological optimization engine designed to decode your sleep architecture and restore youthful cellular rejuvenation.",
            icon: "moon.stars.fill",
            color: SomnaTheme.primaryTeal,
            bullets: [
                "Translates Apple Watch polysomnography into biological age metrics.",
                "Simulates 10-year cardiovascular and neurocognitive hazard trajectories.",
                "Synthesizes zero-latency acoustic binaural beats to entrain delta slow waves."
            ]
        ),
        OnboardingStep(
            tag: "STEP 01 • SWS & GLYMPHATIC DETOX",
            title: "The Slow-Wave Sleep (SWS) Somatic Reservoir",
            subtitle: "During deep delta-wave sleep, your brain undergoes hydrodynamic cleansing. Astrocytes shrink by 60%, allowing cerebrospinal fluid (CSF) to flush out Alzheimer's Beta-Amyloid & Tau aggregates.",
            icon: "brain.head.profile",
            color: SomnaTheme.primaryTeal,
            bullets: [
                "Target: 90+ minutes (20% of night) of Slow-Wave Sleep.",
                "95% of daily pulsatile Human Growth Hormone (HGH) is secreted here.",
                "GLUT4 insulin sensitivity is restored across somatic skeletal muscle."
            ]
        ),
        OnboardingStep(
            tag: "STEP 02 • AUTONOMIC VAGAL TONE",
            title: "Nocturnal Blood Pressure Dipping & HRV",
            subtitle: "A healthy autonomic nervous system drops blood pressure by 10-20% at night and elevates Heart Rate Variability (RMSSD), relieving arterial endothelial stress.",
            icon: "heart.fill",
            color: SomnaTheme.vagalRose,
            bullets: [
                "Resting Heart Rate nadir typically reached around 03:00 AM.",
                "Non-dippers suffer 2.3x higher incidence of cardiovascular risk.",
                "Guided 4-7-8 breathwork stimulates immediate acetylcholine vagal release."
            ]
        ),
        OnboardingStep(
            tag: "STEP 03 • 7 CORE INTERACTIVE MODULES",
            title: "How to Navigate the SomnaLux App",
            subtitle: "The app is organized into 7 sequential modules accessible from the bottom navigation bar:",
            icon: "square.grid.2x2.fill",
            color: SomnaTheme.circadianIndigo,
            bullets: [
                "01 Telemetry: Live Restorative Score, What-If modeler & Hypnogram.",
                "02 Science: Interactive Glymphatic & Circadian SCN simulators.",
                "03 Longevity: 10-Year risk curves & Biological Sleep Age.",
                "04 CBT-I Clinic: Sleep restriction window & Caffeine decay curve.",
                "05 Audio & Breath: 2.5Hz Delta synthesizer & 4-7-8 breath pacer.",
                "06 HealthKit: Direct Apple Watch background telemetry sync.",
                "07 Dr. Somna: Neurologist AI consultation assistant."
            ]
        ),
        OnboardingStep(
            tag: "READY TO BEGIN",
            title: "Your Cellular Rejuvenation Journey Starts Tonight",
            subtitle: "You can explore clinical profiles, test acoustic wave entrainment, or sync your Apple Watch data directly.",
            icon: "sparkles",
            color: SomnaTheme.primaryTeal,
            bullets: [
                "Use the 'What-If' sliders on the dashboard to test biomarker shifts.",
                "Wear headphones when playing binaural delta beats for stereo entrainment.",
                "All health data stays private and encrypted on your device."
            ]
        )
    ]
    
    public var body: some View {
        ZStack {
            SomnaTheme.background.ignoresSafeArea()
            
            VStack(spacing: 24) {
                
                // Top Skip Bar
                HStack {
                    Spacer()
                    Button("Skip Tour") {
                        isPresented = false
                    }
                    .font(.caption.bold())
                    .foregroundColor(SomnaTheme.textMuted)
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                }
                
                // Tab Content
                TabView(selection: $currentStep) {
                    ForEach(0..<steps.count, id: \.self) { idx in
                        let step = steps[idx]
                        VStack(spacing: 24) {
                            
                            // Step Icon Halo
                            ZStack {
                                Circle()
                                    .fill(step.color.opacity(0.15))
                                    .frame(width: 90, height: 90)
                                    .blur(radius: 8)
                                
                                Circle()
                                    .stroke(step.color.opacity(0.4), lineWidth: 1.5)
                                    .frame(width: 80, height: 80)
                                    .background(Circle().fill(SomnaTheme.cardBackground))
                                
                                Image(systemName: step.icon)
                                    .font(.system(size: 34))
                                    .foregroundColor(step.color)
                            }
                            .padding(.top, 10)
                            
                            // Tag Badge
                            Text(step.tag)
                                .font(.system(size: 10, weight: .extrabold, design: .monospaced))
                                .foregroundColor(step.color)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(step.color.opacity(0.12))
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(step.color.opacity(0.3), lineWidth: 1)
                                )
                            
                            // Title & Subtitle
                            VStack(spacing: 8) {
                                Text(step.title)
                                    .font(.system(size: 22, weight: .bold))
                                    .foregroundColor(.white)
                                    .multilineTextAlignment(.center)
                                    .padding(.horizontal, 16)
                                
                                Text(step.subtitle)
                                    .font(.system(size: 13))
                                    .foregroundColor(SomnaTheme.textSecondary)
                                    .multilineTextAlignment(.center)
                                    .lineSpacing(4)
                                    .padding(.horizontal, 24)
                            }
                            
                            // Bullets Card
                            VStack(alignment: .leading, spacing: 12) {
                                ForEach(step.bullets, id: \.self) { bullet in
                                    HStack(alignment: .top, spacing: 10) {
                                        Image(systemName: "checkmark.circle.fill")
                                            .font(.system(size: 14))
                                            .foregroundColor(step.color)
                                            .padding(.top, 2)
                                        
                                        Text(bullet)
                                            .font(.system(size: 12))
                                            .foregroundColor(SomnaTheme.textSecondary)
                                            .lineSpacing(3)
                                    }
                                }
                            }
                            .padding(20)
                            .luxuryCard(borderColor: step.color.opacity(0.25), cornerRadius: 20)
                            .padding(.horizontal, 24)
                            
                            Spacer()
                        }
                        .tag(idx)
                    }
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
                
                // Bottom Page Indicator & Next Button
                VStack(spacing: 16) {
                    // Page Dots
                    HStack(spacing: 8) {
                        ForEach(0..<steps.count, id: \.self) { idx in
                            Circle()
                                .fill(currentStep == idx ? SomnaTheme.primaryTeal : SomnaTheme.cardBorder)
                                .frame(width: currentStep == idx ? 10 : 6, height: currentStep == idx ? 10 : 6)
                                .animation(.spring(), value: currentStep)
                        }
                    }
                    
                    // Action Button
                    Button(action: {
                        if currentStep < steps.count - 1 {
                            withAnimation { currentStep += 1 }
                        } else {
                            isPresented = false
                        }
                    }) {
                        HStack(spacing: 8) {
                            Text(currentStep == steps.count - 1 ? "Get Started" : "Continue")
                                .font(.system(size: 14, weight: .bold))
                            Image(systemName: "arrow.right")
                                .font(.system(size: 14, weight: .bold))
                        }
                        .foregroundColor(SomnaTheme.background)
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(SomnaTheme.primaryTeal)
                        .cornerRadius(18)
                        .shadow(color: SomnaTheme.primaryTeal.opacity(0.3), radius: 15, x: 0, y: 5)
                    }
                    .padding(.horizontal, 24)
                    .padding(.bottom, 20)
                }
            }
        }
    }
}

private struct OnboardingStep {
    let tag: String
    let title: String
    let subtitle: String
    let icon: String
    let color: Color
    let bullets: [String]
}
