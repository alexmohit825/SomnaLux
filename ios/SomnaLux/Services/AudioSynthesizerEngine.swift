//
//  AudioSynthesizerEngine.swift
//  SomnaLux
//  Native AVAudioEngine Binaural Beat & Neuromodulation Waveform Generator
//

import Foundation
import AVFoundation
import Combine

public enum SoundscapeMode: String, CaseIterable, Identifiable {
    case delta = "2.5 Hz Delta Beats"
    case theta = "6.0 Hz Theta Waves"
    case brown = "Deep Brown Noise"
    case pink = "Organic Pink Noise"
    case ocean = "Tidal Ocean Surf"
    case solfeggio = "528 Hz Solfeggio"
    
    public var id: String { rawValue }
    
    public var subtitle: String {
        switch self {
        case .delta: return "Slow-Wave SWS Induction"
        case .theta: return "Hypnagogic REM Dream State"
        case .brown: return "Sub-Bass Tinnitus Mask"
        case .pink: return "1/f Power Spectral Sync"
        case .ocean: return "Modulated Lowpass Surf"
        case .solfeggio: return "Cellular DNA Repair Tone"
        }
    }
}

@MainActor
public final class AudioSynthesizerEngine: ObservableObject {
    public static let shared = AudioSynthesizerEngine()
    
    private var audioEngine = AVAudioEngine()
    private var sourceNode: AVAudioSourceNode?
    
    @Published public var isPlaying: Bool = false
    @Published public var selectedMode: SoundscapeMode = .delta
    @Published public var carrierFrequency: Double = 196.0 // G3 note
    @Published public var beatFrequency: Double = 2.5      // 2.5 Hz Delta
    @Published public var masterVolume: Float = 0.65
    
    private var phaseLeft: Double = 0.0
    private var phaseRight: Double = 0.0
    private var brownNoiseLast: Float = 0.0
    
    private init() {
        setupAudioSession()
    }
    
    private func setupAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers, .duckOthers])
            try session.setActive(true)
        } catch {
            print("Failed to configure AVAudioSession: \(error.localizedDescription)")
        }
    }
    
    public func togglePlayback() {
        if isPlaying {
            stop()
        } else {
            play(mode: selectedMode)
        }
    }
    
    public func play(mode: SoundscapeMode) {
        stop()
        self.selectedMode = mode
        
        let format = AVAudioFormat(standardFormatWithSampleRate: 44100, channels: 2)!
        let sampleRate = format.sampleRate
        
        let activeMode = mode
        let carrier = carrierFrequency
        let beat = mode == .delta ? 2.5 : (mode == .theta ? 6.0 : 0.0)
        let vol = masterVolume
        
        sourceNode = AVAudioSourceNode { [weak self] _, _, frameCount, audioBufferList -> OSStatus in
            guard let self = self else { return noErr }
            let ablPointer = UnsafeMutableAudioBufferListPointer(audioBufferList)
            guard ablPointer.count >= 2 else { return noErr }
            
            let bufferLeft = ablPointer[0].mData?.assumingMemoryBound(to: Float.self)
            let bufferRight = ablPointer[1].mData?.assumingMemoryBound(to: Float.self)
            
            let freqL = carrier
            let freqR = carrier + beat
            let incrL = 2.0 * .pi * freqL / sampleRate
            let incrR = 2.0 * .pi * freqR / sampleRate
            
            for frame in 0..<Int(frameCount) {
                var sampleL: Float = 0.0
                var sampleR: Float = 0.0
                
                switch activeMode {
                case .delta, .theta:
                    sampleL = Float(sin(self.phaseLeft)) * vol
                    sampleR = Float(sin(self.phaseRight)) * vol
                    self.phaseLeft += incrL
                    self.phaseRight += incrR
                    if self.phaseLeft > 2.0 * .pi { self.phaseLeft -= 2.0 * .pi }
                    if self.phaseRight > 2.0 * .pi { self.phaseRight -= 2.0 * .pi }
                    
                case .solfeggio:
                    let solfeggioIncr = 2.0 * .pi * 528.0 / sampleRate
                    sampleL = Float(sin(self.phaseLeft)) * vol
                    sampleR = sampleL
                    self.phaseLeft += solfeggioIncr
                    if self.phaseLeft > 2.0 * .pi { self.phaseLeft -= 2.0 * .pi }
                    
                case .brown, .pink, .ocean:
                    let white = Float.random(in: -1.0...1.0)
                    self.brownNoiseLast = (self.brownNoiseLast + (0.02 * white)) / 1.02
                    sampleL = self.brownNoiseLast * 3.5 * vol
                    sampleR = sampleL
                }
                
                bufferLeft?[frame] = sampleL
                bufferRight?[frame] = sampleR
            }
            return noErr
        }
        
        if let sourceNode = sourceNode {
            audioEngine.attach(sourceNode)
            audioEngine.connect(sourceNode, to: audioEngine.mainMixerNode, format: format)
            do {
                try audioEngine.start()
                self.isPlaying = true
            } catch {
                print("Failed to start audio engine: \(error)")
            }
        }
    }
    
    public func stop() {
        if audioEngine.isRunning {
            audioEngine.stop()
            if let sourceNode = sourceNode {
                audioEngine.detach(sourceNode)
                self.sourceNode = nil
            }
        }
        self.isPlaying = false
    }
}
