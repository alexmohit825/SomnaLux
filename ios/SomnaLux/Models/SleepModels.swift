//
//  SleepModels.swift
//  SomnaLux
//  Data models for Polysomnography, Stages, Archetypes, and Longevity
//

import Foundation
import SwiftUI

public enum SleepStageType: String, CaseIterable, Identifiable, Sendable {
    case awake = "Awake"
    case rem = "REM"
    case light = "Light"
    case deep = "Deep (SWS)"
    
    public var id: String { rawValue }
    
    public var levelIndex: CGFloat {
        switch self {
        case .awake: return 0
        case .rem: return 1
        case .light: return 2
        case .deep: return 3
        }
    }
    
    public var color: Color {
        switch self {
        case .awake: return SomnaTheme.warningAmber
        case .rem: return SomnaTheme.remLavender
        case .light: return SomnaTheme.circadianIndigo
        case .deep: return SomnaTheme.primaryTeal
        }
    }
    
    public var eegBandDescription: String {
        switch self {
        case .awake: return "15-30 Hz Beta (Arousal & Motor Planning)"
        case .rem: return "4-8 Hz Theta (Desynchronized Dream Consolidation)"
        case .light: return "12-14 Hz Sleep Spindles & K-Complexes"
        case .deep: return "0.5-4 Hz Synchronous Delta Slow Waves"
        }
    }
}

public struct SleepEpoch: Identifiable, Sendable {
    public let id: String
    public let timestamp: String
    public let minuteOffset: Double
    public let stage: SleepStageType
    public let durationMinutes: Int
    public let heartRate: Int
    public let hrv: Int
    
    public init(id: String = UUID().uuidString, timestamp: String, minuteOffset: Double, stage: SleepStageType, durationMinutes: Int, heartRate: Int, hrv: Int) {
        self.id = id
        self.timestamp = timestamp
        self.minuteOffset = minuteOffset
        self.stage = stage
        self.durationMinutes = durationMinutes
        self.heartRate = heartRate
        self.hrv = hrv
    }
}

public struct SleepRecord: Identifiable, Sendable {
    public let id: String
    public var date: String
    public var bedTime: String
    public var wakeTime: String
    public var durationMinutes: Int
    public var inBedMinutes: Int
    public var efficiency: Double
    public var deepMinutes: Int
    public var remMinutes: Int
    public var lightMinutes: Int
    public var awakeMinutes: Int
    public var latencyMinutes: Int
    public var awakeningsCount: Int
    public var hrvAverage: Int
    public var hrvBaseline: Int
    public var restingHeartRate: Int
    public var respiratoryRate: Double
    public var temperatureDelta: Double
    public var sleepDebtHours: Double
    public var tags: [String]
    public var stageEpochs: [SleepEpoch]
    
    public var deepPercentage: Int {
        durationMinutes > 0 ? Int(round(Double(deepMinutes) / Double(durationMinutes) * 100)) : 0
    }
    
    public var remPercentage: Int {
        durationMinutes > 0 ? Int(round(Double(remMinutes) / Double(durationMinutes) * 100)) : 0
    }
    
    public var lightPercentage: Int {
        durationMinutes > 0 ? Int(round(Double(lightMinutes) / Double(durationMinutes) * 100)) : 0
    }
    
    public var totalHoursString: String {
        String(format: "%.1f", Double(durationMinutes) / 60.0)
    }
    
    public var restorativeScore: Int {
        let effScore = efficiency * 0.35
        let deepScore = Double(deepPercentage) * 1.6
        let remScore = Double(remPercentage) * 0.5
        let hrvRatio = (Double(hrvAverage) / Double(max(30, hrvBaseline))) * 20.0
        let composite = effScore + deepScore + remScore + hrvRatio
        return min(100, max(35, Int(round(composite))))
    }
    
    public var biologicalAgeShift: Double {
        if deepPercentage >= 20 {
            let shift = -(1.8 + Double(deepPercentage - 20) * 0.08 + (hrvAverage > 50 ? 0.6 : 0.0))
            return (shift * 10).rounded() / 10.0
        } else {
            let shift = +(1.4 + Double(20 - deepPercentage) * 0.09 + (hrvAverage < 40 ? 0.8 : 0.0))
            return (shift * 10).rounded() / 10.0
        }
    }
}

public struct ClinicalSleepArchetype: Identifiable {
    public let id: String
    public let label: String
    public let description: String
    public let record: SleepRecord
}

public struct SleepSampleData {
    public static let sampleEpochs: [SleepEpoch] = [
        SleepEpoch(timestamp: "11:15 PM", minuteOffset: 0, stage: .awake, durationMinutes: 15, heartRate: 64, hrv: 42),
        SleepEpoch(timestamp: "11:30 PM", minuteOffset: 15, stage: .light, durationMinutes: 30, heartRate: 58, hrv: 48),
        SleepEpoch(timestamp: "12:00 AM", minuteOffset: 45, stage: .deep, durationMinutes: 45, heartRate: 52, hrv: 62),
        SleepEpoch(timestamp: "12:45 AM", minuteOffset: 90, stage: .light, durationMinutes: 20, heartRate: 55, hrv: 50),
        SleepEpoch(timestamp: "01:05 AM", minuteOffset: 110, stage: .rem, durationMinutes: 25, heartRate: 60, hrv: 44),
        SleepEpoch(timestamp: "01:30 AM", minuteOffset: 135, stage: .deep, durationMinutes: 40, heartRate: 50, hrv: 65),
        SleepEpoch(timestamp: "02:10 AM", minuteOffset: 175, stage: .light, durationMinutes: 35, heartRate: 54, hrv: 52),
        SleepEpoch(timestamp: "02:45 AM", minuteOffset: 210, stage: .rem, durationMinutes: 30, heartRate: 62, hrv: 45),
        SleepEpoch(timestamp: "03:15 AM", minuteOffset: 240, stage: .deep, durationMinutes: 20, heartRate: 48, hrv: 70),
        SleepEpoch(timestamp: "03:35 AM", minuteOffset: 260, stage: .light, durationMinutes: 45, heartRate: 53, hrv: 55),
        SleepEpoch(timestamp: "04:20 AM", minuteOffset: 305, stage: .rem, durationMinutes: 35, heartRate: 61, hrv: 46),
        SleepEpoch(timestamp: "04:55 AM", minuteOffset: 340, stage: .light, durationMinutes: 40, heartRate: 55, hrv: 51),
        SleepEpoch(timestamp: "05:35 AM", minuteOffset: 380, stage: .rem, durationMinutes: 40, heartRate: 63, hrv: 48),
        SleepEpoch(timestamp: "06:15 AM", minuteOffset: 420, stage: .light, durationMinutes: 20, heartRate: 56, hrv: 50),
        SleepEpoch(timestamp: "06:35 AM", minuteOffset: 440, stage: .awake, durationMinutes: 10, heartRate: 66, hrv: 40)
    ]
    
    public static let archetypes: [String: ClinicalSleepArchetype] = [
        "baseline": ClinicalSleepArchetype(
            id: "baseline",
            label: "Baseline",
            description: "Modern busy professional baseline with moderate sleep debt",
            record: SleepRecord(
                id: "rec-baseline",
                date: "Last Night",
                bedTime: "11:15 PM",
                wakeTime: "06:45 AM",
                durationMinutes: 420,
                inBedMinutes: 450,
                efficiency: 93.3,
                deepMinutes: 78,
                remMinutes: 95,
                lightMinutes: 222,
                awakeMinutes: 25,
                latencyMinutes: 14,
                awakeningsCount: 2,
                hrvAverage: 54,
                hrvBaseline: 52,
                restingHeartRate: 53,
                respiratoryRate: 14.2,
                temperatureDelta: -0.4,
                sleepDebtHours: 1.2,
                tags: ["Magnesium", "Late Meal", "Screen 30m"],
                stageEpochs: sampleEpochs
            )
        ),
        "stress": ClinicalSleepArchetype(
            id: "stress",
            label: "High Stress",
            description: "Elevated nocturnal sympathetic tone, blunted HRV and delayed slow-wave sleep",
            record: SleepRecord(
                id: "rec-stress",
                date: "Simulated Stress Session",
                bedTime: "12:30 AM",
                wakeTime: "06:15 AM",
                durationMinutes: 310,
                inBedMinutes: 345,
                efficiency: 89.8,
                deepMinutes: 38,
                remMinutes: 62,
                lightMinutes: 185,
                awakeMinutes: 25,
                latencyMinutes: 28,
                awakeningsCount: 4,
                hrvAverage: 32,
                hrvBaseline: 52,
                restingHeartRate: 64,
                respiratoryRate: 15.8,
                temperatureDelta: +0.2,
                sleepDebtHours: 3.1,
                tags: ["Work Deadline", "Elevated Cortisol", "Sympathetic Tone"],
                stageEpochs: sampleEpochs
            )
        ),
        "insomnia": ClinicalSleepArchetype(
            id: "insomnia",
            label: "Insomnia & WASO",
            description: "Conditioned bedroom arousal, high sleep latency and fragmented awakenings",
            record: SleepRecord(
                id: "rec-insomnia",
                date: "Simulated Insomnia Night",
                bedTime: "10:30 PM",
                wakeTime: "07:15 AM",
                durationMinutes: 360,
                inBedMinutes: 525,
                efficiency: 68.5,
                deepMinutes: 42,
                remMinutes: 68,
                lightMinutes: 190,
                awakeMinutes: 125,
                latencyMinutes: 55,
                awakeningsCount: 6,
                hrvAverage: 38,
                hrvBaseline: 52,
                restingHeartRate: 61,
                respiratoryRate: 15.0,
                temperatureDelta: -0.1,
                sleepDebtHours: 2.8,
                tags: ["Clock Watching", "Racing Thoughts", "Excess Time in Bed"],
                stageEpochs: sampleEpochs
            )
        ),
        "circadian": ClinicalSleepArchetype(
            id: "circadian",
            label: "Circadian Lag",
            description: "Delayed Melatonin Onset due to blue photon ocular stimulation",
            record: SleepRecord(
                id: "rec-circadian",
                date: "Simulated Circadian Phase Shift",
                bedTime: "01:45 AM",
                wakeTime: "08:30 AM",
                durationMinutes: 380,
                inBedMinutes: 405,
                efficiency: 93.8,
                deepMinutes: 58,
                remMinutes: 110,
                lightMinutes: 192,
                awakeMinutes: 20,
                latencyMinutes: 22,
                awakeningsCount: 1,
                hrvAverage: 46,
                hrvBaseline: 52,
                restingHeartRate: 56,
                respiratoryRate: 14.5,
                temperatureDelta: -0.3,
                sleepDebtHours: 1.8,
                tags: ["Late Screen Light", "Delayed DLMO", "Morning Grogginess"],
                stageEpochs: sampleEpochs
            )
        ),
        "longevity": ClinicalSleepArchetype(
            id: "longevity",
            label: "Elite Longevity",
            description: "Maximized slow-wave delta power, 20% blood pressure dipping, and deep vagal dominance",
            record: SleepRecord(
                id: "rec-longevity",
                date: "Optimized Longevity Protocol",
                bedTime: "10:15 PM",
                wakeTime: "06:30 AM",
                durationMinutes: 470,
                inBedMinutes: 495,
                efficiency: 94.9,
                deepMinutes: 120,
                remMinutes: 115,
                lightMinutes: 215,
                awakeMinutes: 20,
                latencyMinutes: 8,
                awakeningsCount: 1,
                hrvAverage: 78,
                hrvBaseline: 52,
                restingHeartRate: 47,
                respiratoryRate: 13.5,
                temperatureDelta: -0.6,
                sleepDebtHours: 0.0,
                tags: ["66°F Bedroom", "4-7-8 Vagal Breath", "Magnesium L-Threonate", "NSDR"],
                stageEpochs: sampleEpochs
            )
        )
    ]
}
