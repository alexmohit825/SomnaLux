//
//  SomnaLuxWidget.swift
//  SomnaLux
//  iOS 17+ Lock Screen, Dynamic Island & Home Screen Sleep Score Widget
//

import WidgetKit
import SwiftUI

public struct SleepScoreEntry: TimelineEntry {
    public let date: Date
    public let sleepScore: Int
    public let deepPercentage: Int
    public let hrvAverage: Int
    public let biologicalAgeDelta: Double
}

public struct SomnaLuxWidgetEntryView : View {
    public var entry: SleepScoreEntry
    @Environment(\.widgetFamily) var family

    public var body: some View {
        switch family {
        case .accessoryCircular:
            ZStack {
                AccessoryWidgetBackground()
                VStack(spacing: -2) {
                    Text("\(entry.sleepScore)")
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                    Text("SCORE")
                        .font(.system(size: 8, weight: .semibold))
                }
            }
            
        case .accessoryRectangular:
            HStack(spacing: 8) {
                Image(systemName: "moon.stars.fill")
                    .foregroundColor(Color(red: 0.18, green: 0.83, blue: 0.75))
                VStack(alignment: .leading) {
                    Text("Sleep Score: \(entry.sleepScore)")
                        .font(.headline)
                    Text("Deep: \(entry.deepPercentage)% • HRV: \(entry.hrvAverage)ms")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            
        case .systemSmall:
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: "sparkles")
                        .foregroundColor(Color(red: 0.18, green: 0.83, blue: 0.75))
                    Text("SomnaLux")
                        .font(.caption)
                        .fontWeight(.bold)
                }
                Spacer()
                Text("\(entry.sleepScore)")
                    .font(.system(size: 38, weight: .bold, design: .rounded))
                    .foregroundColor(Color(red: 0.18, green: 0.83, blue: 0.75))
                Text("Restorative Index")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                Text(entry.biologicalAgeDelta < 0 ? "\(String(format: "%.1f", entry.biologicalAgeDelta)) yrs bio-age" : "Optimal SWS")
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(Color(red: 0.51, green: 0.55, blue: 0.97))
            }
            .padding()
            .background(Color(red: 0.06, green: 0.09, blue: 0.16))
            
        default:
            Text("Score: \(entry.sleepScore)")
        }
    }
}

public struct SomnaLuxWidgetBundle: WidgetBundle {
    public var body: some Widget {
        SomnaLuxScoreWidget()
    }
}

public struct SomnaLuxScoreWidget: Widget {
    let kind: String = "SomnaLuxScoreWidget"

    public var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SleepTimelineProvider()) { entry in
            SomnaLuxWidgetEntryView(entry: entry)
                .containerBackground(Color(red: 0.05, green: 0.07, blue: 0.12), for: .widget)
        }
        .configurationDisplayName("Sleep Longevity Score")
        .description("Tracks your nocturnal restorative score, HRV and biological rejuvenation.")
        .supportedFamilies([.accessoryCircular, .accessoryRectangular, .systemSmall, .systemMedium])
    }
}

public struct SleepTimelineProvider: TimelineProvider {
    public func placeholder(in context: Context) -> SleepScoreEntry {
        SleepScoreEntry(date: Date(), sleepScore: 88, deepPercentage: 22, hrvAverage: 54, biologicalAgeDelta: -2.1)
    }

    public func getSnapshot(in context: Context, completion: @escaping (SleepScoreEntry) -> ()) {
        completion(SleepScoreEntry(date: Date(), sleepScore: 88, deepPercentage: 22, hrvAverage: 54, biologicalAgeDelta: -2.1))
    }

    public func getTimeline(in context: Context, completion: @escaping (Timeline<SleepScoreEntry>) -> ()) {
        let entry = SleepScoreEntry(date: Date(), sleepScore: 86, deepPercentage: 20, hrvAverage: 52, biologicalAgeDelta: -1.8)
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}
