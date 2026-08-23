//
//  NeuromodulationStudioView.swift
//  SomnaLux
//  AVAudioEngine Waveform Generator, Oscilloscope & Vagal Breath Pacer
//

import SwiftUI

public struct NeuromodulationStudioView: View {
    @StateObject private var audio = AudioSynthesizerEngine.shared
    
    // Breath Pacer State
    @State private var breathMode: String = "4-7-8"
    @State private var breathPhase: String = "Inhale (4s)"
    @State private var breathScale: CGFloat = 1.0
    @State private var isPacing: Bool = false
    @State private var timer: Timer? = nil
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 24) {
                
                // Hero Banner
                VStack(alignment: .leading, spacing: 10) {
                    HStack(spacing: 6) {
                        Image(systemName: "waveform")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(SomnaTheme.primaryTeal)
                        Text("OFFLINE LOW-LATENCY AVAudioEngine")
                            .font(.system(size: 9, weight: .extrabold, design: .monospaced))
                            .foregroundColor(SomnaTheme.primaryTeal)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(SomnaTheme.primaryTeal.opacity(0.12))
                    .cornerRadius(8)
                    
                    Text("Acoustic Neuromodulation Studio")
                        .font(.system(size: 20, weight: .extrabold))
                        .foregroundColor(.white)
                    
                    Text("Hardware-accelerated binaural delta wave synthesis and vagal parasympathetic breath pacing for sleep induction.")
                        .font(.system(size: 12))
                        .foregroundColor(SomnaTheme.textSecondary)
                        .lineSpacing(3)
                }
                .padding(20)
                .luxuryCard(borderColor: SomnaTheme.primaryTeal.opacity(0.3))
                
                // Soundscape Synthesizer Card
                VStack(alignment: .leading, spacing: 18) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("BINAURAL FREQUENCY GENERATOR")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(SomnaTheme.textMuted)
                            Text(audio.selectedMode.rawValue)
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                        }
                        Spacer()
                        
                        // Master Play/Stop Button
                        Button(action: {
                            audio.togglePlayback()
                        }) {
                            HStack(spacing: 6) {
                                Image(systemName: audio.isPlaying ? "stop.fill" : "play.fill")
                                    .font(.system(size: 14))
                                Text(audio.isPlaying ? "Stop" : "Play Soundscape")
                                    .font(.system(size: 12, weight: .bold))
                            }
                            .foregroundColor(audio.isPlaying ? .white : SomnaTheme.background)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(audio.isPlaying ? SomnaTheme.vagalRose : SomnaTheme.primaryTeal)
                            .cornerRadius(14)
                            .shadow(color: (audio.isPlaying ? SomnaTheme.vagalRose : SomnaTheme.primaryTeal).opacity(0.3), radius: 10)
                        }
                    }
                    
                    // Waveform Oscilloscope Canvas
                    ZStack {
                        RoundedRectangle(cornerRadius: 14)
                            .fill(SomnaTheme.secondaryCard)
                            .frame(height: 90)
                        
                        TimelineView(.animation) { timeline in
                            Canvas { context, size in
                                let midY = size.height / 2.0
                                var path = Path()
                                path.move(to: CGPoint(x: 0, y: midY))
                                
                                let freq: CGFloat = audio.isPlaying ? (audio.selectedMode == .delta ? 4.0 : 8.0) : 1.0
                                let amp: CGFloat = audio.isPlaying ? 24.0 : 2.0
                                let time = timeline.date.timeIntervalSinceReferenceDate
                                
                                for x in stride(from: 0, to: size.width, by: 2) {
                                    let relX = x / size.width
                                    let y = midY + sin(relX * freq * .pi * 2 + CGFloat(time * 6.0)) * amp
                                    path.addLine(to: CGPoint(x: x, y: y))
                                }
                                
                                context.stroke(
                                    path,
                                    with: .color(audio.isPlaying ? SomnaTheme.primaryTeal : SomnaTheme.textFaint),
                                    lineWidth: 2
                                )
                            }
                        }
                        .frame(height: 90)
                    }
                    
                    // Soundscape Selector Grid
                    VStack(spacing: 8) {
                        ForEach(SoundscapeMode.allCases) { mode in
                            let isSelected = audio.selectedMode == mode
                            Button(action: {
                                audio.play(mode: mode)
                            }) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(mode.rawValue)
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundColor(isSelected ? SomnaTheme.primaryTeal : .white)
                                        Text(mode.subtitle)
                                            .font(.system(size: 10))
                                            .foregroundColor(SomnaTheme.textMuted)
                                    }
                                    Spacer()
                                    if isSelected && audio.isPlaying {
                                        Image(systemName: "speaker.wave.3.fill")
                                            .font(.system(size: 12))
                                            .foregroundColor(SomnaTheme.primaryTeal)
                                    }
                                }
                                .padding(12)
                                .background(isSelected ? SomnaTheme.secondaryCard : Color.clear)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(isSelected ? SomnaTheme.primaryTeal : SomnaTheme.cardBorder, lineWidth: 1))
                            }
                        }
                    }
                }
                .padding(20)
                .luxuryCard()
                
                // Vagal 4-7-8 Breathwork Pacer Card
                VStack(spacing: 16) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("PARASYMPATHETIC BREATH PACER")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(SomnaTheme.textMuted)
                            Text("4-7-8 Vagal Nerve Reset")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                        }
                        Spacer()
                        
                        Button(action: toggleBreathPacer) {
                            Text(isPacing ? "Stop Pacer" : "Start 4-7-8")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(isPacing ? SomnaTheme.vagalRose : SomnaTheme.deepIndigo)
                                .cornerRadius(10)
                        }
                    }
                    
                    // Animated Breathing Ring
                    ZStack {
                        Circle()
                            .fill(SomnaTheme.primaryTeal.opacity(0.15))
                            .frame(width: 140 * breathScale, height: 140 * breathScale)
                            .blur(radius: 12)
                        
                        Circle()
                            .stroke(SomnaTheme.primaryTeal, lineWidth: 3)
                            .frame(width: 120 * breathScale, height: 120 * breathScale)
                            .background(Circle().fill(SomnaTheme.cardBackground))
                        
                        VStack(spacing: 4) {
                            Image(systemName: "wind")
                                .font(.system(size: 20))
                                .foregroundColor(SomnaTheme.primaryTeal)
                            Text(breathPhase)
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                    .frame(height: 180)
                    
                    Text("Prolonged 8-second exhalations trigger the baroreceptor reflex, stimulating vagal acetylcholine release to slow heart rate before sleep.")
                        .font(.system(size: 11))
                        .foregroundColor(SomnaTheme.textMuted)
                        .lineSpacing(2)
                }
                .padding(20)
                .luxuryCard(borderColor: SomnaTheme.primaryTeal.opacity(0.3))
                
            }
            .padding(20)
            .padding(.bottom, 80)
        }
        .background(SomnaTheme.background.ignoresSafeArea())
    }
    
    private func toggleBreathPacer() {
        if isPacing {
            isPacing = false
            timer?.invalidate()
            timer = nil
            withAnimation(.spring()) {
                breathScale = 1.0
                breathPhase = "4-7-8 Ready"
            }
        } else {
            isPacing = true
            runBreathCycle()
        }
    }
    
    private func runBreathCycle() {
        guard isPacing else { return }
        
        // 1. Inhale 4s
        breathPhase = "Inhale (4s)"
        withAnimation(.easeInOut(duration: 4.0)) {
            breathScale = 1.4
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 4.0) {
            guard self.isPacing else { return }
            
            // 2. Hold 7s
            self.breathPhase = "Hold (7s)"
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 7.0) {
                guard self.isPacing else { return }
                
                // 3. Exhale 8s
                self.breathPhase = "Exhale (8s)"
                withAnimation(.easeInOut(duration: 8.0)) {
                    self.breathScale = 0.85
                }
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 8.0) {
                    if self.isPacing {
                        self.runBreathCycle()
                    }
                }
            }
        }
    }
}
