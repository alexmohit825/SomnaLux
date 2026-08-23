//
//  SomnaLuxApp.swift
//  SomnaLux
//  Predictive Sleep & Cellular Longevity iOS App Entry Point
//

import SwiftUI
import HealthKit

@main
struct SomnaLuxApp: App {
    
    init() {
        // Enforce dark mode status bar & appearance
        UIView.appearance().overrideUserInterfaceStyle = .dark
    }
    
    var body: some Scene {
        WindowGroup {
            MainTabView()
                .preferredColorScheme(.dark)
                .task {
                    // Pre-request HealthKit permissions on initial launch
                    await HealthKitSleepManager.shared.requestAuthorization()
                }
        }
    }
}
