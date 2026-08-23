//
//  AICoachChatView.swift
//  SomnaLux
//  Dr. Somna AI Sleep Neurologist Chat Consultation Interface
//

import SwiftUI

public struct AICoachChatView: View {
    @Binding public var currentRecord: SleepRecord
    
    @State private var inputText: String = ""
    @State private var messages: [ChatMessage] = [
        ChatMessage(
            id: "msg-1",
            sender: .ai,
            text: "Hello, I am Dr. Somna, your predictive sleep and circadian medicine assistant. I have reviewed last night's session: \(78) min of Slow-Wave Sleep and an average HRV of 54ms. How can I optimize your sleep architecture today?",
            timestamp: "Just now"
        )
    ]
    @State private var isTyping: Bool = false
    
    private let promptChips = [
        "Why is my Deep Sleep low?",
        "Explain Glymphatic Detoxification",
        "How to stop 3 AM awakenings",
        "Explain caffeine half-life"
    ]
    
    public var body: some View {
        VStack(spacing: 0) {
            
            // Header Banner
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(SomnaTheme.primaryTeal.opacity(0.15))
                        .frame(width: 40, height: 40)
                    Image(systemName: "moon.stars.fill")
                        .foregroundColor(SomnaTheme.primaryTeal)
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Text("Dr. Somna AI")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        Text("ONLINE")
                            .font(.system(size: 8, weight: .extrabold, design: .monospaced))
                            .foregroundColor(SomnaTheme.primaryTeal)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(SomnaTheme.primaryTeal.opacity(0.15))
                            .cornerRadius(6)
                    }
                    Text("Predictive Sleep Neurologist")
                        .font(.system(size: 11))
                        .foregroundColor(SomnaTheme.textMuted)
                }
                Spacer()
            }
            .padding(16)
            .background(SomnaTheme.cardBackground)
            .overlay(Divider().background(SomnaTheme.cardBorder), alignment: .bottom)
            
            // Messages Stream
            ScrollViewReader { proxy in
                ScrollView(showsIndicators: false) {
                    LazyVStack(spacing: 14) {
                        ForEach(messages) { msg in
                            ChatBubble(message: msg)
                                .id(msg.id)
                        }
                        
                        if isTyping {
                            HStack {
                                Text("Dr. Somna is formulating clinical advice...")
                                    .font(.system(size: 11, weight: .medium))
                                    .foregroundColor(SomnaTheme.primaryTeal)
                                    .padding(12)
                                    .background(SomnaTheme.secondaryCard)
                                    .cornerRadius(14)
                                Spacer()
                            }
                        }
                    }
                    .padding(16)
                }
                .onChange(of: messages.count) { _ in
                    if let last = messages.last {
                        withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                    }
                }
            }
            
            // Suggested Prompts Carousel
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(promptChips, id: \.self) { chip in
                        Button(action: {
                            sendMessage(text: chip)
                        }) {
                            Text(chip)
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(SomnaTheme.circadianIndigo)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(SomnaTheme.cardBackground)
                                .cornerRadius(12)
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(SomnaTheme.circadianIndigo.opacity(0.3), lineWidth: 1))
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
            }
            
            // Input Bar
            HStack(spacing: 10) {
                TextField("Ask Dr. Somna about your sleep science...", text: $inputText)
                    .font(.system(size: 12))
                    .foregroundColor(.white)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(SomnaTheme.secondaryCard)
                    .cornerRadius(14)
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(SomnaTheme.cardBorder, lineWidth: 1))
                
                Button(action: {
                    if !inputText.trimmingCharacters(in: .whitespaces).isEmpty {
                        sendMessage(text: inputText)
                        inputText = ""
                    }
                }) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(SomnaTheme.primaryTeal)
                }
            }
            .padding(14)
            .background(SomnaTheme.cardBackground)
        }
        .background(SomnaTheme.background.ignoresSafeArea())
    }
    
    private func sendMessage(text: String) {
        let userMsg = ChatMessage(id: UUID().uuidString, sender: .user, text: text, timestamp: "Just now")
        messages.append(userMsg)
        
        isTyping = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            isTyping = false
            let replyText = generateClinicalResponse(to: text)
            let aiMsg = ChatMessage(id: UUID().uuidString, sender: .ai, text: replyText, timestamp: "Just now")
            messages.append(aiMsg)
        }
    }
    
    private func generateClinicalResponse(to text: String) -> String {
        let lower = text.lowercased()
        if lower.contains("deep") || lower.contains("sws") {
            return "Slow-Wave Sleep (SWS) is driven by homeostatic adenosine buildup and core body temperature drops. To increase your SWS from \(currentRecord.deepMinutes)m towards the 90m target: 1) Keep your bedroom strictly at 66°F to facilitate peripheral heat dumping, 2) Complete a 5-minute warm shower 45 minutes before bed, and 3) Utilize our 2.5 Hz Delta acoustic synthesizer."
        } else if lower.contains("glymphatic") || lower.contains("detox") {
            return "The glymphatic system is the brain's waste clearance network discovered by Dr. Maiken Nedergaard. During slow-wave delta sleep, astrocytes express AQP4 channels that dilate interstitial spaces by 60%, allowing cerebrospinal fluid (CSF) to wash over neural tissue and flush Beta-Amyloid and Tau proteins into the cervical lymph nodes."
        } else if lower.contains("caffeine") {
            return "Caffeine has an average metabolic half-life of 5 to 7 hours in healthy adults. It works by antagonizing A1 and A2A adenosine receptors. Even when you can fall asleep with caffeine in your bloodstream, it suppresses the amplitude of slow-wave sleep spindles by up to 35%."
        } else {
            return "Based on your polysomnographic metrics (\(currentRecord.restorativeScore)/100 Restorative Score), your priority should be anchoring your morning circadian wake time and using 4-7-8 vagal breathing before lights out to stimulate parasympathetic deceleration."
        }
    }
}

public struct ChatMessage: Identifiable {
    public enum Sender { case user, ai }
    public let id: String
    public let sender: Sender
    public let text: String
    public let timestamp: String
}

private struct ChatBubble: View {
    let message: ChatMessage
    
    var body: some View {
        HStack {
            if message.sender == .user { Spacer() }
            
            VStack(alignment: message.sender == .user ? .trailing : .leading, spacing: 4) {
                Text(message.text)
                    .font(.system(size: 12))
                    .foregroundColor(message.sender == .user ? SomnaTheme.background : SomnaTheme.textSecondary)
                    .lineSpacing(3)
                    .padding(14)
                    .background(message.sender == .user ? SomnaTheme.primaryTeal : SomnaTheme.cardBackground)
                    .cornerRadius(18)
                    .overlay(
                        RoundedRectangle(cornerRadius: 18)
                            .stroke(message.sender == .user ? Color.clear : SomnaTheme.cardBorder, lineWidth: 1)
                    )
            }
            .frame(maxWidth: 280, alignment: message.sender == .user ? .trailing : .leading)
            
            if message.sender == .ai { Spacer() }
        }
    }
}
