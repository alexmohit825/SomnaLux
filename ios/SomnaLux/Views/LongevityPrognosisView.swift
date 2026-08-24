//
//  LongevityPrognosisView.swift
//  SomnaLux
//  10-Year Health Impact, Cardiovascular Hazard & Epigenetic Longevity
//

import SwiftUI

public struct LongevityPrognosisView: View {
    @Binding public var currentRecord: SleepRecord
    @State private var projectedYears: Double = 10
    
    public init(currentRecord: Binding<SleepRecord>) {
        self._currentRecord = currentRecord
    }
    
    private var bioAgeDivergence: Double {
        currentRecord.biologicalAgeShift
    }
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 24) {
                
                // Hero Banner
                VStack(alignment: .leading, spacing: 10) {
                    HStack(spacing: 6) {
                        Image(systemName: "shield.checkered")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(SomnaTheme.circadianIndigo)
                        Text("10-YEAR PROGNOSTIC TRAJECTORY")
                            .font(.system(size: 9, weight: .heavy, design: .monospaced))
                            .foregroundColor(SomnaTheme.circadianIndigo)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(SomnaTheme.circadianIndigo.opacity(0.12))
                    .cornerRadius(8)
                    
                    Text("Biological Sleep Age & Longevity Prognosis")
                        .font(.system(size: 20, weight: .heavy))
                        .foregroundColor(.white)
                    
                    Text("Quantifies how cumulative slow-wave delta deficits or autonomic recovery alter systemic cellular aging, arterial elasticity, and neurocognitive resilience.")
                        .font(.system(size: 12))
                        .foregroundColor(SomnaTheme.textSecondary)
                        .lineSpacing(3)
                }
                .padding(20)
                .luxuryCard(borderColor: SomnaTheme.circadianIndigo.opacity(0.3))
                
                // Biological Age Divergence Meter
                VStack(spacing: 16) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("BIOLOGICAL SLEEP AGE DIVERGENCE")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(SomnaTheme.textMuted)
                            Text(bioAgeDivergence < 0 ? "\(String(format: "%.1f", bioAgeDivergence)) Years" : "+\(String(format: "%.1f", bioAgeDivergence)) Years")
                                .font(.system(size: 28, weight: .heavy, design: .rounded))
                                .foregroundColor(bioAgeDivergence < 0 ? SomnaTheme.primaryTeal : SomnaTheme.warningAmber)
                        }
                        Spacer()
                        Image(systemName: bioAgeDivergence < 0 ? "arrow.down.right.and.arrow.up.left" : "exclamationmark.triangle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(bioAgeDivergence < 0 ? SomnaTheme.primaryTeal : SomnaTheme.warningAmber)
                    }
                    
                    Text(bioAgeDivergence < 0
                         ? "Your slow-wave sleep density (\(currentRecord.deepPercentage)%) and vagal recovery (\(currentRecord.hrvAverage)ms HRV) place your cellular rejuvenation trajectory \(abs(bioAgeDivergence)) years younger than chronological baseline."
                         : "Sub-optimal slow-wave sleep is accelerating biological age by \(bioAgeDivergence) years due to elevated nocturnal cortisol and suppressed glymphatic CSF clearing.")
                        .font(.system(size: 12))
                        .foregroundColor(SomnaTheme.textSecondary)
                        .lineSpacing(3)
                }
                .padding(20)
                .luxuryCard()
                
                // 10-Year Hazard Ratio Cards
                VStack(alignment: .leading, spacing: 12) {
                    Text("10-Year Relative Hazard Ratios:")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.white)
                    
                    HazardRow(
                        title: "Cardiovascular Endothelial Stress",
                        hazard: bioAgeDivergence < 0 ? "-24% Hazard Reduction" : "+38% Relative Risk",
                        desc: "Nocturnal blood pressure dipping prevents coronary artery calcification.",
                        isPositive: bioAgeDivergence < 0
                    )
                    
                    HazardRow(
                        title: "Neurocognitive Tau Accumulation",
                        hazard: bioAgeDivergence < 0 ? "-32% Waste Retention" : "+45% Amyloid Burden",
                        desc: "Hydrodynamic interstitial flushing during slow-wave delta bursts.",
                        isPositive: bioAgeDivergence < 0
                    )
                    
                    HazardRow(
                        title: "Metabolic Insulin Sensitivity (GLUT4)",
                        hazard: bioAgeDivergence < 0 ? "+28% Glucose Disposal" : "-22% Cellular Sensitivity",
                        desc: "SWS restores peripheral tissue insulin receptor phosphorylation.",
                        isPositive: bioAgeDivergence < 0
                    )
                }
                
            }
            .padding(20)
            .padding(.bottom, 80)
        }
        .background(SomnaTheme.background.ignoresSafeArea())
    }
}

private struct HazardRow: View {
    let title: String
    let hazard: String
    let desc: String
    let isPositive: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(title)
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.white)
                Spacer()
                Text(hazard)
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(isPositive ? SomnaTheme.primaryTeal : SomnaTheme.warningAmber)
            }
            Text(desc)
                .font(.system(size: 11))
                .foregroundColor(SomnaTheme.textMuted)
        }
        .padding(14)
        .luxuryCard()
    }
}
