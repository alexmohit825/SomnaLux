//
//  Theme.swift
//  SomnaLux
//  Design System & Luxury Dark Theme Tokens
//

import SwiftUI

public enum SomnaTheme {
    // Core Brand Colors matching Elegant Dark
    public static let background = Color(hex: 0x050505)
    public static let cardBackground = Color(hex: 0x0F172A)
    public static let cardBorder = Color(hex: 0x1E293B)
    public static let secondaryCard = Color(hex: 0x070A11)
    
    // Biomarker Accents
    public static let primaryTeal = Color(hex: 0x2DD4BF)      // Slow-Wave SWS & Recovery
    public static let circadianIndigo = Color(hex: 0x818CF8)  // Circadian & Melatonin
    public static let deepIndigo = Color(hex: 0x6366F1)       // CTAs & Interactive Controls
    public static let vagalRose = Color(hex: 0xF43F5E)        // Heart Rate & Vagal Tone
    public static let remLavender = Color(hex: 0xC084FC)      // REM Dream Stage
    public static let warningAmber = Color(hex: 0xF59E0B)     // Sleep Debt & Adenosine
    public static let emeraldOptimal = Color(hex: 0x10B981)   // Optimal Thresholds
    
    // Typography Colors
    public static let textPrimary = Color(hex: 0xF9FAFB)
    public static let textSecondary = Color(hex: 0xCBD5E1)
    public static let textMuted = Color(hex: 0x94A3B8)
    public static let textFaint = Color(hex: 0x64748B)
}

// Color Hex Initializer
extension Color {
    public init(hex: UInt, alpha: Double = 1.0) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255.0,
            green: Double((hex >> 8) & 0xFF) / 255.0,
            blue: Double(hex & 0xFF) / 255.0,
            opacity: alpha
        )
    }
}

// Glassmorphism Luxury Card Modifier
public struct LuxuryCardModifier: ViewModifier {
    public var borderColor: Color = SomnaTheme.cardBorder
    public var cornerRadius: CGFloat = 24
    
    public func body(content: Content) -> some View {
        content
            .background(SomnaTheme.cardBackground)
            .cornerRadius(cornerRadius)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(borderColor, lineWidth: 1)
            )
            .shadow(color: Color.black.opacity(0.4), radius: 12, x: 0, y: 6)
    }
}

extension View {
    public func luxuryCard(borderColor: Color = SomnaTheme.cardBorder, cornerRadius: CGFloat = 24) -> some View {
        self.modifier(LuxuryCardModifier(borderColor: borderColor, cornerRadius: cornerRadius))
    }
}
