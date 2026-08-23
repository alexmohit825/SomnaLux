//
//  ScientificMechanismsView.swift
//  SomnaLux
//  Interactive Cellular & Molecular Sleep Science Lab
//

import SwiftUI

public struct ScientificMechanismsView: View {
    @State private var activePillar: String = "glymphatic"
    @State private var glymphaticStage: String = "deep" // "awake" vs "deep"
    @State private var vagalStimulus: Double = 75
    @State private var circadianHour: Double = 22 // 10 PM
    
    private let pillars = [
        ("glymphatic", "1. Glymphatic Detox", "Aquaporin-4 CSF Waste Flush", "brain.head.profile", SomnaTheme.primaryTeal),
        ("autonomic", "2. Autonomic Vagal", "Parasympathetic BP Dipping", "heart.fill", SomnaTheme.vagalRose),
        ("circadian", "3. Circadian SCN", "Process S & Process C Clock", "clock.fill", SomnaTheme.circadianIndigo),
        ("endocrine", "4. Endocrine HGH", "Pulsatile Somatotropin & GLUT4", "bolt.fill", SomnaTheme.warningAmber)
    ]
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 24) {
                
                // Hero Science Banner
                VStack(alignment: .leading, spacing: 10) {
                    HStack(spacing: 6) {
                        Image(systemName: "atom")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(SomnaTheme.primaryTeal)
                        Text("HARVARD & STANFORD SLEEP MEDICINE FOUNDATIONS")
                            .font(.system(size: 9, weight: .extrabold, design: .monospaced))
                            .foregroundColor(SomnaTheme.primaryTeal)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(SomnaTheme.primaryTeal.opacity(0.12))
                    .cornerRadius(8)
                    
                    Text("Biological Cellular Mechanisms")
                        .font(.system(size: 20, weight: .extrabold))
                        .foregroundColor(.white)
                    
                    Text("Discover the exact molecular and physiological pathways through which slow-wave sleep orchestrates neuro-cleansing, cardiovascular dipping, and cellular longevity.")
                        .font(.system(size: 12))
                        .foregroundColor(SomnaTheme.textSecondary)
                        .lineSpacing(3)
                }
                .padding(20)
                .luxuryCard(borderColor: SomnaTheme.primaryTeal.opacity(0.3))
                
                // 4 Pillars Selector Ribbon
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(pillars, id: \.0) { pId, title, sub, icon, col in
                            let isSelected = activePillar == pId
                            Button(action: { activePillar = pId }) {
                                VStack(alignment: .leading, spacing: 6) {
                                    HStack {
                                        Image(systemName: icon)
                                            .font(.system(size: 14))
                                            .foregroundColor(col)
                                        Spacer()
                                    }
                                    Text(title)
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(.white)
                                    Text(sub)
                                        .font(.system(size: 10))
                                        .foregroundColor(SomnaTheme.textMuted)
                                        .lineLimit(1)
                                }
                                .padding(14)
                                .frame(width: 155)
                                .background(isSelected ? SomnaTheme.cardBackground : SomnaTheme.cardBackground.opacity(0.4))
                                .cornerRadius(18)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 18)
                                        .stroke(isSelected ? col : SomnaTheme.cardBorder, lineWidth: isSelected ? 1.5 : 1)
                                )
                            }
                        }
                    }
                }
                
                // Active Deep-Dive Lab Card
                if activePillar == "glymphatic" {
                    GlymphaticLabCard(glymphaticStage: $glymphaticStage)
                } else if activePillar == "autonomic" {
                    AutonomicVagalLabCard(vagalStimulus: $vagalStimulus)
                } else if activePillar == "circadian" {
                    CircadianLabCard(circadianHour: $circadianHour)
                } else {
                    EndocrineLabCard()
                }
                
            }
            .padding(20)
            .padding(.bottom, 80)
        }
        .background(SomnaTheme.background.ignoresSafeArea())
    }
}

// Pillar 1: Glymphatic Interactive View
private struct GlymphaticLabCard: View {
    @Binding var glymphaticStage: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            HStack {
                Text("Aquaporin-4 (AQP4) Hydrodynamic Simulation")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                Spacer()
            }
            
            // Toggle
            HStack(spacing: 8) {
                Button(action: { glymphaticStage = "awake" }) {
                    Text("Awake (Constricted)")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(glymphaticStage == "awake" ? SomnaTheme.warningAmber : SomnaTheme.textMuted)
                        .frame(maxWidth: .infinity)
                        .frame(height: 38)
                        .background(glymphaticStage == "awake" ? SomnaTheme.secondaryCard : Color.clear)
                        .cornerRadius(12)
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(glymphaticStage == "awake" ? SomnaTheme.warningAmber : SomnaTheme.cardBorder, lineWidth: 1))
                }
                
                Button(action: { glymphaticStage = "deep" }) {
                    Text("SWS (60% Channel Expansion)")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(glymphaticStage == "deep" ? SomnaTheme.background : SomnaTheme.textMuted)
                        .frame(maxWidth: .infinity)
                        .frame(height: 38)
                        .background(glymphaticStage == "deep" ? SomnaTheme.primaryTeal : Color.clear)
                        .cornerRadius(12)
                }
            }
            
            // Stats Grid
            VStack(spacing: 10) {
                GlymphaticParamRow(title: "Astrocyte Size", val: glymphaticStage == "awake" ? "100% (Dense Pack)" : "Shrunk by 60%", desc: glymphaticStage == "awake" ? "High noradrenaline limits interstitial channels" : "Noradrenaline drops, opening convective channels")
                GlymphaticParamRow(title: "CSF Flow Rate", val: glymphaticStage == "awake" ? "12% Basal Flow" : "100% Maximum Convective Flow", desc: glymphaticStage == "awake" ? "Superficial clearance only" : "Deep arterial pulsation flushes parenchymal tissue")
                GlymphaticParamRow(title: "Amyloid & Tau Clearance", val: glymphaticStage == "awake" ? "Minimal (Accumulation)" : "20x Accelerated Flush", desc: glymphaticStage == "awake" ? "Metabolic byproducts accumulate across synapses" : "Neurotoxic proteins flushed into cervical lymph nodes")
            }
            
            // Citations
            VStack(alignment: .leading, spacing: 6) {
                Text("Clinical Literature:")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(SomnaTheme.textSecondary)
                Text("• Nedergaard et al., Science 2013: Sleep Drives Metabolite Clearance from the Adult Brain.")
                    .font(.system(size: 9))
                    .foregroundColor(SomnaTheme.textFaint)
                Text("• Xie et al., Cell Stem Cell 2019: AQP4-dependent glymphatic solute transport in human aging.")
                    .font(.system(size: 9))
                    .foregroundColor(SomnaTheme.textFaint)
            }
            .padding(.top, 6)
        }
        .padding(20)
        .luxuryCard()
    }
}

private struct GlymphaticParamRow: View {
    let title: String
    let val: String
    let desc: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 3) {
            HStack {
                Text(title)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                Spacer()
                Text(val)
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(SomnaTheme.primaryTeal)
            }
            Text(desc)
                .font(.system(size: 10))
                .foregroundColor(SomnaTheme.textMuted)
        }
        .padding(12)
        .background(SomnaTheme.secondaryCard)
        .cornerRadius(12)
    }
}

// Pillar 2: Autonomic Vagal View
private struct AutonomicVagalLabCard: View {
    @Binding var vagalStimulus: Double
    
    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text("Parasympathetic Vagal Brake Simulator")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(.white)
            
            VStack(spacing: 8) {
                HStack {
                    Text("Vagal Nerve Activation:")
                        .font(.system(size: 12))
                        .foregroundColor(SomnaTheme.textSecondary)
                    Spacer()
                    Text("\(Int(vagalStimulus))% Brake")
                        .font(.system(size: 12, weight: .bold, design: .monospaced))
                        .foregroundColor(SomnaTheme.vagalRose)
                }
                Slider(value: $vagalStimulus, in: 20...100, step: 5)
                    .accentColor(SomnaTheme.vagalRose)
            }
            
            HStack(spacing: 10) {
                VStack(spacing: 2) {
                    Text("NOCTURNAL RMSSD")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundColor(SomnaTheme.textFaint)
                    Text("\(Int(25 + (vagalStimulus * 0.65))) ms")
                        .font(.system(size: 16, weight: .bold, design: .monospaced))
                        .foregroundColor(SomnaTheme.primaryTeal)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(SomnaTheme.secondaryCard)
                .cornerRadius(12)
                
                VStack(spacing: 2) {
                    Text("RESTING HR NADIR")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundColor(SomnaTheme.textFaint)
                    Text("\(Int(72 - (vagalStimulus * 0.25))) bpm")
                        .font(.system(size: 16, weight: .bold, design: .monospaced))
                        .foregroundColor(SomnaTheme.vagalRose)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(SomnaTheme.secondaryCard)
                .cornerRadius(12)
                
                VStack(spacing: 2) {
                    Text("BP DIPPING")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundColor(SomnaTheme.textFaint)
                    Text("-\(Int(4 + (vagalStimulus * 0.15)))%")
                        .font(.system(size: 16, weight: .bold, design: .monospaced))
                        .foregroundColor(SomnaTheme.emeraldOptimal)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(SomnaTheme.secondaryCard)
                .cornerRadius(12)
            }
            
            Text("Why BP Dipping Saves Lives: Healthy sleepers experience a 10-20% drop in nocturnal arterial blood pressure. Non-dippers suffer 2.3x higher risk of stroke and left ventricular hypertrophy.")
                .font(.system(size: 11))
                .foregroundColor(SomnaTheme.textSecondary)
                .lineSpacing(3)
        }
        .padding(20)
        .luxuryCard(borderColor: SomnaTheme.vagalRose.opacity(0.3))
    }
}

// Pillar 3: Circadian SCN View
private struct CircadianLabCard: View {
    @Binding var circadianHour: Double
    
    private var phaseTitle: String {
        let h = Int(circadianHour)
        if h >= 6 && h < 9 { return "Cortisol Awakening Response (CAR)" }
        if h >= 9 && h < 14 { return "Peak Working Memory & Executive Focus" }
        if h >= 14 && h < 17 { return "Post-Prandial Dip & Physical Peak" }
        if h >= 17 && h < 21 { return "Dim Light Melatonin Onset (DLMO)" }
        if h >= 21 && h < 24 { return "Slow-Wave Sleep Window" }
        return "Core Body Temperature Nadir & REM Dreams"
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text("24-Hour Solar Oscillator Scrubber")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(.white)
            
            VStack(spacing: 8) {
                HStack {
                    Text("Time of Day:")
                        .font(.system(size: 12))
                        .foregroundColor(SomnaTheme.textSecondary)
                    Spacer()
                    let h = Int(circadianHour)
                    Text("\(h % 12 == 0 ? 12 : h % 12):00 \(h >= 12 ? "PM" : "AM")")
                        .font(.system(size: 12, weight: .bold, design: .monospaced))
                        .foregroundColor(SomnaTheme.circadianIndigo)
                }
                Slider(value: $circadianHour, in: 0...23, step: 1)
                    .accentColor(SomnaTheme.circadianIndigo)
            }
            
            VStack(alignment: .leading, spacing: 6) {
                Text(phaseTitle)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(SomnaTheme.primaryTeal)
                Text("SCN master clock aligns peripheral cellular clock genes (BMAL1, CLOCK) via 480nm melanopsin ipRGC retinal ganglion photoreceptors.")
                    .font(.system(size: 11))
                    .foregroundColor(SomnaTheme.textMuted)
                    .lineSpacing(3)
            }
            .padding(14)
            .background(SomnaTheme.secondaryCard)
            .cornerRadius(12)
        }
        .padding(20)
        .luxuryCard(borderColor: SomnaTheme.circadianIndigo.opacity(0.3))
    }
}

// Pillar 4: Endocrine HGH View
private struct EndocrineLabCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Endocrine Secretion & Somatic Anabolism")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(.white)
            
            VStack(alignment: .leading, spacing: 10) {
                Text("• 95% of Daily Human Growth Hormone (HGH)")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(SomnaTheme.warningAmber)
                Text("Pituitary somatotropes release massive pulses during delta slow-wave bursts, rebuilding somatic muscle tissue and mineralizing bone.")
                    .font(.system(size: 11))
                    .foregroundColor(SomnaTheme.textSecondary)
                    .lineSpacing(3)
                
                Divider().background(SomnaTheme.cardBorder)
                
                Text("• GLUT4 Glucose Disposal Resensitization")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(SomnaTheme.primaryTeal)
                Text("A single night of sleep deprivation induces cellular insulin resistance comparable to aging 20 years. Adequate SWS restores normal glucose clearing.")
                    .font(.system(size: 11))
                    .foregroundColor(SomnaTheme.textSecondary)
                    .lineSpacing(3)
            }
            .padding(16)
            .background(SomnaTheme.secondaryCard)
            .cornerRadius(14)
        }
        .padding(20)
        .luxuryCard()
    }
}
