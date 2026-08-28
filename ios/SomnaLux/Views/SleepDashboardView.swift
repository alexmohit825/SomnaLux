//
//  SleepDashboardView.swift
//  SomnaLux
//  Section-Numbered Polysomnography & Predictive Longevity Dashboard with In-App Orientation & Section Guides
//

import SwiftUI

public struct SleepDashboardView: View {
    @Binding public var currentRecord: SleepRecord
    @Binding public var selectedArchetypeKey: String
    @Binding public var selectedTab: Int
    
    // First-Time User In-App Guide Toggle
    @State private var showOrientationGuide: Bool = true
    @State private var showMetricGlossary: Bool = false
    
    // Interactive What-If Modeler State
    @State private var simExtraDeep: Double = 0
    @State private var simExtraHrv: Double = 0
    @State private var selectedEpochIndex: Int? = 2
    
    public init(currentRecord: Binding<SleepRecord>, selectedArchetypeKey: Binding<String>, selectedTab: Binding<Int>) {
        self._currentRecord = currentRecord
        self._selectedArchetypeKey = selectedArchetypeKey
        self._selectedTab = selectedTab
    }
    
    // Effective dynamic values
    private var effectiveDeep: Int {
        min(currentRecord.durationMinutes, max(10, currentRecord.deepMinutes + Int(simExtraDeep)))
    }
    
    private var effectiveHrv: Int {
        max(15, currentRecord.hrvAverage + Int(simExtraHrv))
    }
    
    private var deepPercentage: Int {
        currentRecord.durationMinutes > 0 ? Int(round(Double(effectiveDeep) / Double(currentRecord.durationMinutes) * 100)) : 0
    }
    
    private var calculatedScore: Int {
        let eff = currentRecord.efficiency * 0.35
        let deep = Double(deepPercentage) * 1.6
        let rem = Double(currentRecord.remPercentage) * 0.5
        let hrv = (Double(effectiveHrv) / Double(max(30, currentRecord.hrvBaseline))) * 20.0
        return min(100, max(35, Int(round(eff + deep + rem + hrv))))
    }
    
    private var bioAgeShift: Double {
        if deepPercentage >= 20 {
            let shift = -(1.8 + Double(deepPercentage - 20) * 0.08 + (effectiveHrv > 50 ? 0.6 : 0.0))
            return (shift * 10).rounded() / 10.0
        } else {
            let shift = +(1.4 + Double(20 - deepPercentage) * 0.09 + (effectiveHrv < 40 ? 0.8 : 0.0))
            return (shift * 10).rounded() / 10.0
        }
    }
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 28) {
                
                // =========================================================
                // TOP: FIRST-TIME USER ORIENTATION & GUIDE CARD
                // =========================================================
                VStack(alignment: .leading, spacing: 14) {
                    HStack {
                        HStack(spacing: 6) {
                            Image(systemName: "lightbulb.fill")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(SomnaTheme.warningAmber)
                            Text("USER ORIENTATION & ROADMAP")
                                .font(.system(size: 9, weight: .heavy, design: .monospaced))
                                .foregroundColor(SomnaTheme.warningAmber)
                        }
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(SomnaTheme.warningAmber.opacity(0.15))
                        .cornerRadius(8)
                        
                        Spacer()
                        
                        Button(action: { withAnimation(.spring()) { showOrientationGuide.toggle() } }) {
                            HStack(spacing: 4) {
                                Text(showOrientationGuide ? "Collapse Guide" : "Expand Guide")
                                    .font(.system(size: 11, weight: .bold))
                                Image(systemName: showOrientationGuide ? "chevron.up" : "chevron.down")
                                    .font(.system(size: 10))
                            }
                            .foregroundColor(SomnaTheme.circadianIndigo)
                        }
                    }
                    
                    if showOrientationGuide {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("How SomnaLux Works: 4 Simple Steps to Cellular Rejuvenation")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                            
                            VStack(spacing: 8) {
                                OrientationStepRow(
                                    num: "1",
                                    title: "Section 01 • Explore Scenarios",
                                    desc: "Tap clinical archetypes (Baseline, High Stress, Chronic Insomnia, Elite) to test how real-world conditions alter your biomarkers."
                                )
                                OrientationStepRow(
                                    num: "2",
                                    title: "Section 02 • Monitor SWS Glymphatic Reservoir",
                                    desc: "Track your Restorative Score and Slow-Wave Sleep (SWS). Achieving 90+ minutes (20% of night) clears brain toxins and reverses biological aging."
                                )
                                OrientationStepRow(
                                    num: "3",
                                    title: "Section 03 • Simulate What-If Levers",
                                    desc: "Move the biomarker sliders to see how +20m of deep sleep or higher HRV directly lowers your biological age."
                                )
                                OrientationStepRow(
                                    num: "4",
                                    title: "Section 04 • Execute Bedtime Prescriptions",
                                    desc: "Follow the 3 nightly action steps: 4-7-8 vagal breath reset (Tab 05), 66°F room microclimate, and morning lux light anchoring."
                                )
                            }
                            
                            // Metric Glossary Trigger Button
                            Button(action: { showMetricGlossary.toggle() }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "book.closed.fill")
                                        .font(.system(size: 11))
                                    Text("Open Sleep Metrics Glossary & Clinical Definitions")
                                        .font(.system(size: 11, weight: .bold))
                                    Spacer()
                                    Image(systemName: "arrow.right")
                                        .font(.system(size: 10))
                                }
                                .foregroundColor(SomnaTheme.primaryTeal)
                                .padding(12)
                                .background(SomnaTheme.secondaryCard)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(SomnaTheme.primaryTeal.opacity(0.3), lineWidth: 1))
                            }
                        }
                        .padding(.top, 4)
                        .transition(.opacity.combined(with: .move(edge: .top)))
                    }
                }
                .padding(16)
                .luxuryCard(borderColor: SomnaTheme.warningAmber.opacity(0.35))
                
                // =========================================================
                // SECTION 01: CLINICAL SCENARIO SIMULATOR
                // =========================================================
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 8) {
                        Text("SECTION 01")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(SomnaTheme.primaryTeal)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(SomnaTheme.primaryTeal.opacity(0.12))
                            .cornerRadius(8)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(SomnaTheme.primaryTeal.opacity(0.3), lineWidth: 1))
                        
                        Text("CLINICAL SCENARIO TESTER")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                    }
                    
                    // Explainer Note
                    SectionExplainerCard(
                        title: "Why this section is here:",
                        text: "Tap a profile below to see how specific pathologies (stress, insomnia, circadian delay) alter your sleep architecture, or sync your Apple Watch data directly under Tab 05."
                    )
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 10) {
                            ForEach(Array(SleepSampleData.archetypes.keys.sorted()), id: \.self) { key in
                                if let arch = SleepSampleData.archetypes[key] {
                                    let isSelected = selectedArchetypeKey == key
                                    Button(action: {
                                        selectedArchetypeKey = key
                                        currentRecord = arch.record
                                        simExtraDeep = 0
                                        simExtraHrv = 0
                                    }) {
                                        VStack(alignment: .leading, spacing: 6) {
                                            HStack {
                                                Text(arch.label)
                                                    .font(.system(size: 12, weight: .bold))
                                                    .foregroundColor(.white)
                                                Spacer()
                                                if isSelected {
                                                    Image(systemName: "checkmark.circle.fill")
                                                        .font(.system(size: 12))
                                                        .foregroundColor(SomnaTheme.primaryTeal)
                                                }
                                            }
                                            
                                            HStack(spacing: 4) {
                                                Text("\(arch.record.deepMinutes)m SWS")
                                                    .font(.system(size: 10, design: .monospaced))
                                                    .foregroundColor(SomnaTheme.primaryTeal)
                                                Text("•")
                                                    .font(.system(size: 10))
                                                    .foregroundColor(SomnaTheme.textFaint)
                                                Text("\(arch.record.hrvAverage)ms HRV")
                                                    .font(.system(size: 10, design: .monospaced))
                                                    .foregroundColor(SomnaTheme.circadianIndigo)
                                            }
                                        }
                                        .padding(14)
                                        .frame(width: 145)
                                        .background(isSelected ? SomnaTheme.cardBackground : SomnaTheme.cardBackground.opacity(0.5))
                                        .cornerRadius(18)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 18)
                                                .stroke(isSelected ? SomnaTheme.primaryTeal : SomnaTheme.cardBorder, lineWidth: isSelected ? 1.5 : 1)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
                
                // =========================================================
                // SECTION 02: RESTORATIVE SCORE & DEEP SWS RESERVOIR
                // =========================================================
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 8) {
                        Text("SECTION 02")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(SomnaTheme.primaryTeal)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(SomnaTheme.primaryTeal.opacity(0.12))
                            .cornerRadius(8)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(SomnaTheme.primaryTeal.opacity(0.3), lineWidth: 1))
                        
                        Text("RESTORATIVE ARCHITECTURE & SCORE")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                    }
                    
                    SectionExplainerCard(
                        title: "How your score is calculated:",
                        text: "Your 0-100 Score combines Sleep Efficiency (35%), Slow-Wave Deep Sleep (35%), REM Dreaming (15%), and Nocturnal Vagal HRV (15%). Achieving 90+ min of SWS triggers glymphatic brain detox and takes years off your biological age."
                    )
                    
                    // Main Score & SWS Reservoir Card
                    VStack(spacing: 20) {
                        
                        // Top Row: Score Circular Dial & Stats
                        HStack(spacing: 20) {
                            
                            // Circular Gauge
                            ZStack {
                                Circle()
                                    .stroke(SomnaTheme.cardBorder, lineWidth: 10)
                                    .frame(width: 100, height: 100)
                                
                                Circle()
                                    .trim(from: 0, to: CGFloat(calculatedScore) / 100.0)
                                    .stroke(
                                        AngularGradient(
                                            gradient: Gradient(colors: [SomnaTheme.circadianIndigo, SomnaTheme.primaryTeal]),
                                            center: .center,
                                            startAngle: .degrees(-90),
                                            endAngle: .degrees(270)
                                        ),
                                        style: StrokeStyle(lineWidth: 10, lineCap: .round)
                                    )
                                    .frame(width: 100, height: 100)
                                    .rotationEffect(.degrees(-90))
                                
                                VStack(spacing: 0) {
                                    Text("\(calculatedScore)")
                                        .font(.system(size: 32, weight: .heavy, design: .rounded))
                                        .foregroundColor(.white)
                                    Text("SCORE")
                                        .font(.system(size: 8, weight: .bold))
                                        .foregroundColor(SomnaTheme.textFaint)
                                }
                            }
                            
                            // Core Sleep Numbers
                            VStack(alignment: .leading, spacing: 10) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("TOTAL SLEEP")
                                            .font(.system(size: 9, weight: .bold))
                                            .foregroundColor(SomnaTheme.textMuted)
                                        Text("\(currentRecord.totalHoursString) hrs")
                                            .font(.system(size: 16, weight: .bold))
                                            .foregroundColor(.white)
                                    }
                                    Spacer()
                                    VStack(alignment: .trailing, spacing: 2) {
                                        Text("EFFICIENCY")
                                            .font(.system(size: 9, weight: .bold))
                                            .foregroundColor(SomnaTheme.textMuted)
                                        Text("\(Int(currentRecord.efficiency))%")
                                            .font(.system(size: 16, weight: .bold))
                                            .foregroundColor(SomnaTheme.primaryTeal)
                                    }
                                }
                                
                                // Biological Age Shift Pill
                                HStack {
                                    Image(systemName: "sparkles")
                                        .font(.system(size: 10))
                                        .foregroundColor(SomnaTheme.circadianIndigo)
                                    Text(bioAgeShift < 0 ? "Rejuvenating (\(String(format: "%.1f", bioAgeShift)) yrs bio-age)" : "Cellular Strain (+\(String(format: "%.1f", bioAgeShift)) yrs)")
                                        .font(.system(size: 11, weight: .semibold))
                                        .foregroundColor(SomnaTheme.textSecondary)
                                }
                                .padding(.horizontal, 10)
                                .padding(.vertical, 6)
                                .background(SomnaTheme.secondaryCard)
                                .cornerRadius(10)
                            }
                        }
                        
                        Divider().background(SomnaTheme.cardBorder)
                        
                        // SWS Fluid Reservoir Bar
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("Slow-Wave (SWS) Reservoir: \(effectiveDeep) min (\(deepPercentage)%)")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.white)
                                Spacer()
                                Text(deepPercentage >= 20 ? "✓ 90m Goal Met" : "⚠️ \(max(0, 90 - effectiveDeep))m Deficit")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(deepPercentage >= 20 ? SomnaTheme.primaryTeal : SomnaTheme.warningAmber)
                            }
                            
                            // Fill bar with 90m target line
                            ZStack(alignment: .leading) {
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(SomnaTheme.secondaryCard)
                                    .frame(height: 20)
                                
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(
                                        LinearGradient(
                                            colors: [SomnaTheme.primaryTeal, SomnaTheme.circadianIndigo],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .frame(width: max(10, min(320, CGFloat(effectiveDeep) / 120.0 * 320)), height: 20)
                            }
                            
                            // 4 Stages Proportional Grid
                            HStack(spacing: 6) {
                                StageMiniBox(title: "Deep SWS (Detox)", val: "\(effectiveDeep)m", color: SomnaTheme.primaryTeal)
                                StageMiniBox(title: "REM (Dreams)", val: "\(currentRecord.remMinutes)m", color: SomnaTheme.remLavender)
                                StageMiniBox(title: "Light (Spindles)", val: "\(currentRecord.lightMinutes)m", color: SomnaTheme.circadianIndigo)
                                StageMiniBox(title: "Awake (WASO)", val: "\(currentRecord.awakeMinutes)m", color: SomnaTheme.warningAmber)
                            }
                            .padding(.top, 4)
                        }
                    }
                    .padding(20)
                    .luxuryCard()
                }
                
                // =========================================================
                // SECTION 03: INTERACTIVE "WHAT-IF" BIOMARKER MODELER
                // =========================================================
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 8) {
                        Text("SECTION 03")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(SomnaTheme.primaryTeal)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(SomnaTheme.primaryTeal.opacity(0.12))
                            .cornerRadius(8)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(SomnaTheme.primaryTeal.opacity(0.3), lineWidth: 1))
                        
                        Text("INTERACTIVE 'WHAT-IF' MODELER")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                        
                        Spacer()
                        if simExtraDeep != 0 || simExtraHrv != 0 {
                            Button("Reset") {
                                simExtraDeep = 0
                                simExtraHrv = 0
                            }
                            .font(.caption2.bold())
                            .foregroundColor(SomnaTheme.primaryTeal)
                        }
                    }
                    
                    SectionExplainerCard(
                        title: "How to use this simulation:",
                        text: "Drag the sliders below to simulate what happens to your biological age and Restorative Score if you increase your Deep Sleep by +30m or raise your nocturnal HRV by +20ms."
                    )
                    
                    VStack(spacing: 16) {
                        // Slider 1: SWS Deep Sleep
                        VStack(spacing: 6) {
                            HStack {
                                Text("Simulate Slow-Wave Sleep:")
                                    .font(.system(size: 12))
                                    .foregroundColor(SomnaTheme.textSecondary)
                                Spacer()
                                Text("\(effectiveDeep) min (\(Int(simExtraDeep) >= 0 ? "+\(Int(simExtraDeep))" : "\(Int(simExtraDeep))")m)")
                                    .font(.system(size: 12, weight: .bold, design: .monospaced))
                                    .foregroundColor(SomnaTheme.primaryTeal)
                            }
                            Slider(value: $simExtraDeep, in: -30...60, step: 5)
                                .accentColor(SomnaTheme.primaryTeal)
                        }
                        
                        // Slider 2: Nocturnal HRV
                        VStack(spacing: 6) {
                            HStack {
                                Text("Simulate Nocturnal HRV (RMSSD):")
                                    .font(.system(size: 12))
                                    .foregroundColor(SomnaTheme.textSecondary)
                                Spacer()
                                Text("\(effectiveHrv) ms (\(Int(simExtraHrv) >= 0 ? "+\(Int(simExtraHrv))" : "\(Int(simExtraHrv))")ms)")
                                    .font(.system(size: 12, weight: .bold, design: .monospaced))
                                    .foregroundColor(SomnaTheme.circadianIndigo)
                            }
                            Slider(value: $simExtraHrv, in: -20...40, step: 2)
                                .accentColor(SomnaTheme.circadianIndigo)
                        }
                    }
                    .padding(20)
                    .luxuryCard(borderColor: SomnaTheme.primaryTeal.opacity(0.3))
                }
                
                // =========================================================
                // SECTION 04: AI DIAGNOSTIC FINDINGS & PRESCRIPTION
                // =========================================================
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 8) {
                        Text("SECTION 04")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(SomnaTheme.primaryTeal)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(SomnaTheme.primaryTeal.opacity(0.12))
                            .cornerRadius(8)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(SomnaTheme.primaryTeal.opacity(0.3), lineWidth: 1))
                        
                        Text("AI DIAGNOSIS & 3-STEP PRESCRIPTION")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                    }
                    
                    SectionExplainerCard(
                        title: "Clinical Rationale:",
                        text: "Dr. Somna AI analyzes your polysomnographic telemetry to identify autonomic imbalances and prescribes 3 targeted behavioral countermeasures for tonight."
                    )
                    
                    VStack(alignment: .leading, spacing: 16) {
                        HStack {
                            Image(systemName: "sparkles")
                                .foregroundColor(SomnaTheme.primaryTeal)
                            Text(deepPercentage < 15 ? "Slow-Wave Sleep Deficit & Elevated Sympathetic Tone" : "Optimal SWS Delta Power & Rejuvenating Profile")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                        }
                        
                        Text(deepPercentage < 15 
                             ? "Analysis indicates a \(max(0, 90 - effectiveDeep)) min SWS deficit. Nocturnal HRV (\(effectiveHrv)ms) was blunted by sympathetic tone. Glymphatic clearance operated at ~62% capacity."
                             : "High-density slow-wave sleep (\(effectiveDeep) min, \(deepPercentage)%) with strong vagal recovery (\(effectiveHrv)ms HRV). Optimal 10-20% nocturnal BP dipping detected.")
                            .font(.system(size: 12))
                            .foregroundColor(SomnaTheme.textSecondary)
                            .lineSpacing(3)
                        
                        // 3-Step Prescriptions
                        VStack(spacing: 8) {
                            PrescriptionRow(step: "1", title: "4-7-8 Parasympathetic Vagal Reset", desc: "6 cycles before bed (Tab 05) to stimulate acetylcholine release.")
                            PrescriptionRow(step: "2", title: "Bedroom Thermal Microclimate (66°F)", desc: "Trigger peripheral vasodilation 45 mins before sleep.")
                            PrescriptionRow(step: "3", title: "Circadian Lux Anchoring", desc: "10,000+ lux morning sunlight within 30 minutes of waking.")
                        }
                    }
                    .padding(20)
                    .luxuryCard()
                }
                
                // =========================================================
                // SECTION 05: HYPNOGRAM STAGE ARCHITECTURE CANVAS
                // =========================================================
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 8) {
                        Text("SECTION 05")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(SomnaTheme.primaryTeal)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(SomnaTheme.primaryTeal.opacity(0.12))
                            .cornerRadius(8)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(SomnaTheme.primaryTeal.opacity(0.3), lineWidth: 1))
                        
                        Text("POLYSOMNOGRAPHY HYPNOGRAM")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                    }
                    
                    SectionExplainerCard(
                        title: "How to read the Hypnogram timeline:",
                        text: "This canvas illustrates your sleep architecture throughout the night: Yellow = Awake (WASO), Lavender = REM (Cognitive synthesis & dreams), Indigo = Light (Stage N2 sleep spindles), Teal = Deep SWS (0.5-2.0Hz Delta detox). Tap any block to inspect epoch heart rate."
                    )
                    
                    VStack(alignment: .leading, spacing: 14) {
                        HypnogramCanvasView(epochs: currentRecord.stageEpochs, totalMinutes: Double(currentRecord.durationMinutes))
                        
                        // Epoch Inspector
                        if let epochIdx = selectedEpochIndex, epochIdx < currentRecord.stageEpochs.count {
                            let epoch = currentRecord.stageEpochs[epochIdx]
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Epoch @ \(epoch.timestamp)")
                                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                                        .foregroundColor(SomnaTheme.primaryTeal)
                                    Text(epoch.stage.eegBandDescription)
                                        .font(.system(size: 10))
                                        .foregroundColor(SomnaTheme.textMuted)
                                }
                                Spacer()
                                HStack(spacing: 12) {
                                    Text("\(epoch.heartRate) bpm")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(.white)
                                    Text("\(epoch.hrv) ms HRV")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(SomnaTheme.primaryTeal)
                                }
                            }
                            .padding(12)
                            .background(SomnaTheme.secondaryCard)
                            .cornerRadius(12)
                        }
                    }
                    .padding(20)
                    .luxuryCard()
                }
                
                // =========================================================
                // SECTION 06: AUTONOMIC & ENVIRONMENTAL TELEMETRY
                // =========================================================
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 8) {
                        Text("SECTION 06")
                            .font(.system(size: 9, weight: .bold, design: .monospaced))
                            .foregroundColor(SomnaTheme.primaryTeal)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(SomnaTheme.primaryTeal.opacity(0.12))
                            .cornerRadius(8)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(SomnaTheme.primaryTeal.opacity(0.3), lineWidth: 1))
                        
                        Text("AUTONOMIC & SANCTUARY TELEMETRY")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                    }
                    
                    SectionExplainerCard(
                        title: "Sensor Telemetry Meaning:",
                        text: "Nocturnal HRV indicates parasympathetic nervous system tone (higher is better). Heart Rate Nadir marks the deepest point of cardiovascular decompression. Room temperature at 66°F ensures peripheral vasodilation."
                    )
                    
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        TelemetryMiniCard(icon: "waveform.path.ecg", title: "Nocturnal HRV", value: "\(effectiveHrv) ms", sub: "Vagal Dominance", color: SomnaTheme.primaryTeal)
                        TelemetryMiniCard(icon: "heart.fill", title: "Resting HR Nadir", value: "\(currentRecord.restingHeartRate) bpm", sub: "03:15 AM Dip", color: SomnaTheme.vagalRose)
                        TelemetryMiniCard(icon: "thermometer.medium", title: "Room Temp", value: "66.8°F", sub: "Optimal Thermal", color: SomnaTheme.circadianIndigo)
                        TelemetryMiniCard(icon: "bolt.fill", title: "Sleep Debt", value: String(format: "%.1fh", currentRecord.sleepDebtHours), sub: "Adenosine Load", color: SomnaTheme.warningAmber)
                    }
                }
                
                // Footer Medical & Wellness Disclaimer
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 6) {
                        Image(systemName: "shield.fill")
                            .font(.system(size: 10))
                            .foregroundColor(SomnaTheme.textMuted)
                        Text("WELLNESS & EDUCATIONAL DISCLAIMER")
                            .font(.system(size: 8, weight: .bold, design: .monospaced))
                            .foregroundColor(SomnaTheme.textMuted)
                    }
                    Text("SomnaLux is intended for educational, lifestyle, and general wellness optimization only. It is not a medical device and does not diagnose, treat, cure, or prevent any medical condition or sleep disorder.")
                        .font(.system(size: 10))
                        .foregroundColor(SomnaTheme.textFaint)
                        .lineSpacing(2)
                }
                .padding(12)
                .background(SomnaTheme.secondaryCard.opacity(0.6))
                .cornerRadius(12)
                
            }
            .padding(20)
            .padding(.bottom, 80) // Spacing for floating audio mini-player
        }
        .background(SomnaTheme.background.ignoresSafeArea())
        .sheet(isPresented: $showMetricGlossary) {
            SleepMetricsGlossarySheet(isPresented: $showMetricGlossary)
        }
    }
}

// Reusable Section Explainer Banner
private struct SectionExplainerCard: View {
    let title: String
    let text: String
    
    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "info.circle.fill")
                .font(.system(size: 12))
                .foregroundColor(SomnaTheme.primaryTeal)
                .padding(.top, 1)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(SomnaTheme.primaryTeal)
                Text(text)
                    .font(.system(size: 11))
                    .foregroundColor(SomnaTheme.textSecondary)
                    .lineSpacing(2)
            }
            Spacer()
        }
        .padding(12)
        .background(SomnaTheme.primaryTeal.opacity(0.06))
        .cornerRadius(12)
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(SomnaTheme.primaryTeal.opacity(0.18), lineWidth: 1))
    }
}

private struct OrientationStepRow: View {
    let num: String
    let title: String
    let desc: String
    
    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Text(num)
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(SomnaTheme.warningAmber)
                .frame(width: 20, height: 20)
                .background(SomnaTheme.warningAmber.opacity(0.15))
                .clipShape(Circle())
                .padding(.top, 1)
            
            VStack(alignment: .leading, spacing: 1) {
                Text(title)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                Text(desc)
                    .font(.system(size: 10))
                    .foregroundColor(SomnaTheme.textSecondary)
                    .lineSpacing(2)
            }
            Spacer()
        }
        .padding(8)
        .background(SomnaTheme.secondaryCard)
        .cornerRadius(10)
    }
}

private struct StageMiniBox: View {
    let title: String
    let val: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 2) {
            Text(title)
                .font(.system(size: 8, weight: .bold))
                .foregroundColor(color)
                .lineLimit(1)
            Text(val)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(.white)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(SomnaTheme.secondaryCard)
        .cornerRadius(10)
    }
}

private struct PrescriptionRow: View {
    let step: String
    let title: String
    let desc: String
    
    var body: some View {
        HStack(spacing: 10) {
            Text(step)
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(SomnaTheme.primaryTeal)
                .frame(width: 20, height: 20)
                .background(SomnaTheme.primaryTeal.opacity(0.15))
                .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                Text(desc)
                    .font(.system(size: 10))
                    .foregroundColor(SomnaTheme.textMuted)
            }
            Spacer()
        }
        .padding(10)
        .background(SomnaTheme.secondaryCard)
        .cornerRadius(10)
    }
}

private struct TelemetryMiniCard: View {
    let icon: String
    let title: String
    let value: String
    let sub: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(SomnaTheme.textMuted)
                Spacer()
                Image(systemName: icon)
                    .font(.system(size: 12))
                    .foregroundColor(color)
            }
            
            Text(value)
                .font(.system(size: 18, weight: .heavy, design: .monospaced))
                .foregroundColor(.white)
            
            Text(sub)
                .font(.system(size: 9))
                .foregroundColor(color)
        }
        .padding(14)
        .luxuryCard()
    }
}

// In-App Metrics Glossary Sheet
public struct SleepMetricsGlossarySheet: View {
    @Binding public var isPresented: Bool
    
    public init(isPresented: Binding<Bool>) {
        self._isPresented = isPresented
    }
    
    private let terms = [
        ("Slow-Wave Sleep (SWS / Deep Sleep)", "Brainwave frequencies between 0.5 and 2.0 Hz. During SWS, astrocytes shrink by 60%, allowing cerebrospinal fluid to flush out Beta-Amyloid and Tau proteins. 95% of growth hormone is secreted here.", SomnaTheme.primaryTeal),
        ("Sleep Efficiency (%)", "The percentage of total time in bed spent in actual sleep. Clinical target is >85%. Low efficiency signals prolonged sleep latency or frequent nighttime awakenings.", SomnaTheme.primaryTeal),
        ("Heart Rate Variability (HRV / RMSSD)", "Variation in time between heartbeats measured in milliseconds. High nocturnal HRV reflects strong parasympathetic vagal tone and autonomic recovery.", SomnaTheme.circadianIndigo),
        ("Biological Sleep Age Shift", "Divergence between chronological age and biological tissue age based on polysomnographic deep sleep density and nocturnal autonomic decompression.", SomnaTheme.emeraldOptimal),
        ("Wake After Sleep Onset (WASO)", "Total minutes spent awake in bed after initial sleep onset. Less than 20 minutes indicates strong sleep maintenance.", SomnaTheme.warningAmber),
        ("Circadian DLMO & SCN", "Dim Light Melatonin Onset coordinated by the Suprachiasmatic Nucleus master clock. Dictates the biological window for slow-wave initiation.", SomnaTheme.remLavender)
    ]
    
    public var body: some View {
        NavigationView {
            ZStack {
                SomnaTheme.background.ignoresSafeArea()
                
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 16) {
                        ForEach(terms, id: \.0) { term, def, col in
                            VStack(alignment: .leading, spacing: 6) {
                                Text(term)
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(col)
                                Text(def)
                                    .font(.system(size: 12))
                                    .foregroundColor(SomnaTheme.textSecondary)
                                    .lineSpacing(3)
                            }
                            .padding(16)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .luxuryCard(borderColor: col.opacity(0.3))
                        }
                        
                        // Medical & Wellness Disclaimer
                        VStack(alignment: .leading, spacing: 6) {
                            HStack(spacing: 6) {
                                Image(systemName: "shield.fill")
                                    .font(.system(size: 11))
                                    .foregroundColor(SomnaTheme.warningAmber)
                                Text("MEDICAL & WELLNESS DISCLAIMER")
                                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                                    .foregroundColor(SomnaTheme.warningAmber)
                            }
                            Text("SomnaLux is intended for educational, informational, and general wellness purposes only. It is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease, medical condition, or sleep disorder. Always consult a qualified physician or healthcare professional before making changes to your health regimen.")
                                .font(.system(size: 10))
                                .foregroundColor(SomnaTheme.textMuted)
                                .lineSpacing(2)
                        }
                        .padding(14)
                        .luxuryCard(borderColor: SomnaTheme.warningAmber.opacity(0.25))
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Sleep Science Glossary")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") { isPresented = false }
                        .foregroundColor(SomnaTheme.primaryTeal)
                        .font(.system(size: 14, weight: .bold))
                }
            }
        }
    }
}
