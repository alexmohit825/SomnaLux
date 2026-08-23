//
//  HypnogramCanvasView.swift
//  SomnaLux
//  GPU-Accelerated SwiftUI Canvas Rendering Hypnogram Sleep Architecture
//

import SwiftUI

public struct HypnogramCanvasView: View {
    public let epochs: [SleepEpoch]
    public let totalMinutes: Double
    
    public init(epochs: [SleepEpoch], totalMinutes: Double = 480) {
        self.epochs = epochs
        self.totalMinutes = totalMinutes
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            
            // Legend
            HStack(spacing: 12) {
                LegendDot(color: SomnaTheme.warningAmber, label: "Awake")
                LegendDot(color: SomnaTheme.remLavender, label: "REM")
                LegendDot(color: SomnaTheme.circadianIndigo, label: "Light")
                LegendDot(color: SomnaTheme.primaryTeal, label: "Deep")
                Spacer()
            }
            
            // Canvas Graph
            HStack(spacing: 8) {
                // Vertical Stage Labels
                VStack(alignment: .trailing, spacing: 0) {
                    ForEach(SleepStageType.allCases) { stage in
                        Text(stage.rawValue)
                            .font(.system(size: 9, weight: .semibold, design: .monospaced))
                            .foregroundColor(stage.color)
                            .frame(maxHeight: .infinity, alignment: .center)
                    }
                }
                .frame(width: 55)
                
                Canvas { context, size in
                    let stepHeight = size.height / 4.0
                    
                    // 1. Draw horizontal stage grid lines
                    for i in 0..<4 {
                        let y = CGFloat(i) * stepHeight + (stepHeight / 2.0)
                        var path = Path()
                        path.move(to: CGPoint(x: 0, y: y))
                        path.addLine(to: CGPoint(x: size.width, y: y))
                        context.stroke(path, with: .color(Color.white.opacity(0.06)), lineWidth: 1)
                    }
                    
                    guard !epochs.isEmpty else { return }
                    
                    // 2. Build stepped path
                    var hypnoPath = Path()
                    var areaPath = Path()
                    
                    let firstX = CGFloat(epochs[0].minuteOffset / totalMinutes) * size.width
                    let firstY = epochs[0].stage.levelIndex * stepHeight + (stepHeight / 2.0)
                    
                    hypnoPath.move(to: CGPoint(x: firstX, y: firstY))
                    areaPath.move(to: CGPoint(x: firstX, y: size.height))
                    areaPath.addLine(to: CGPoint(x: firstX, y: firstY))
                    
                    for epoch in epochs {
                        let x = CGFloat(epoch.minuteOffset / totalMinutes) * size.width
                        let y = epoch.stage.levelIndex * stepHeight + (stepHeight / 2.0)
                        
                        hypnoPath.addLine(to: CGPoint(x: x, y: hypnoPath.currentPoint?.y ?? y))
                        hypnoPath.addLine(to: CGPoint(x: x, y: y))
                        
                        areaPath.addLine(to: CGPoint(x: x, y: areaPath.currentPoint?.y ?? y))
                        areaPath.addLine(to: CGPoint(x: x, y: y))
                    }
                    
                    if let lastX = epochs.last.map({ CGFloat($0.minuteOffset / totalMinutes) * size.width }) {
                        areaPath.addLine(to: CGPoint(x: lastX, y: size.height))
                        areaPath.closeSubpath()
                    }
                    
                    // Fill gradient
                    let gradient = Gradient(colors: [
                        SomnaTheme.primaryTeal.opacity(0.25),
                        SomnaTheme.circadianIndigo.opacity(0.05),
                        Color.clear
                    ])
                    context.fill(areaPath, with: .linearGradient(gradient, startPoint: .zero, endPoint: CGPoint(x: 0, y: size.height)))
                    
                    // Stroke Line
                    context.stroke(hypnoPath, with: .color(SomnaTheme.primaryTeal), lineWidth: 2)
                }
                .frame(height: 120)
                .background(SomnaTheme.secondaryCard)
                .cornerRadius(12)
                .overlay(RoundedRectangle(cornerRadius: 12).stroke(SomnaTheme.cardBorder, lineWidth: 1))
            }
        }
    }
}

private struct LegendDot: View {
    let color: Color
    let label: String
    
    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(color)
                .frame(width: 6, height: 6)
            Text(label)
                .font(.system(size: 9, weight: .semibold))
                .foregroundColor(SomnaTheme.textMuted)
        }
    }
}
