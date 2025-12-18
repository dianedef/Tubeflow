---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - /workspaces/Tubeflow/_bmad-output/analysis/brainstorming-session-2025-12-18.md
  - /workspaces/Tubeflow/_bmad-output/index.md
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 1
workflowType: "prd"
lastStep: 0
project_name: "Tubeflow"
user_name: "Codespace"
date: "Thu Dec 18 2025"
---

# Product Requirements Document - Tubeflow

**Author:** Codespace
**Date:** Thu Dec 18 2025

## Executive Summary

Tubeflow aims to transform video consumption by shifting the focus from algorithm-driven discoverability to user-controlled efficiency. Leveraging our existing full-stack architecture, we will build a specialized YouTube playback experience that empowers users to manage and consume their subscribed content with precision and speed. The platform will feature rapid, gesture-based controls for luminosity, speed, and volume, along with intuitive playlist management through channel grouping and swipe interactions. By integrating note-taking capabilities from our template foundation, users can also capture insights directly alongside their video content, creating a productivity-focused media environment.

### What Makes This Special

Tubeflow differentiates itself by rejecting the "rabbit hole" of recommendation algorithms in favor of a disciplined, user-centric workflow.

- **Rapid Efficiency:** Custom, accessible controls for playback parameters (speed, luminosity, volume) and navigation prioritize the user's time and viewing preferences.
- **Curated Focus:** By strictly streaming content from user-defined groups of subscribed channels, the platform eliminates distractions and keeps the user in their "subscriptions only" zone.
- **Active Consumption:** The integration of note-taking turns passive watching into an active learning or research process, directly leveraging the app's architectural roots.
- **Intuitive Triage:** Tinder-style swipe gestures (left/right) for managing playlist items (remove/archive) provide a tactile and fast way to process video queues.

## Project Classification

**Technical Type:** mobile_app, web_app
**Domain:** Consumer Media / Productivity
**Complexity:** Medium
**Project Context:** Brownfield - extending existing system (repurposing Note App template)

**Key Technical Requirements:**

- **YouTube Integration:** Reliable video playback and metadata fetching within app constraints.
- **Gesture System:** Robust touch handling for swipes and rapid control adjustments.
- **State Management:** Real-time synchronization of playlists, groups, and notes via Convex.
- **Cross-Platform UI:** Consistent efficient UX across Web (Next.js) and Native (React Native/Expo).

## Success Criteria

### User Success

- **Efficiency:** Users can start watching desired content within **10 seconds** of app launch ("Time to Content").
- **Engagement:** Daily Active Users (DAU) complete at least one "Triage Session" (swiping through new videos) or watch >15 minutes of content per day.
- **Retention:** >40% of users usually return to the app at Day 30 (D30), validating the "daily workflow" value proposition.
- **Control:** Users utilize gesture controls for >80% of playback adjustments (speed, luminosity, volume), indicating successful UI adoption.

### Business Success

- **Launch Timeline:** MVP released to App Store (iOS) and Play Store (Android) within **3 months**.
- **User Acquisition:** Acquire first **100 active beta users** within 30 days of launch (Organic/TestFlight).
- **Stability:** Maintain **>99% crash-free sessions** to ensure trust in the "rapid" workflow.

### Technical Success

- **Performance:** App load time < 2 seconds; Gesture interaction latency < 16ms (consistent 60fps) to maintain "fluid" feel.
- **Integration Reliability:** 100% successful parsing of standard YouTube channel feeds and metadata.
- **Synchronization:** Playlist and Note state synchronizes between Web and Native clients in **< 1 second** via Convex.

### Measurable Outcomes

- **Primary Metric:** Daily Active Triage Sessions (users clearing their feed).
- **Secondary Metric:** Notes created per video watched (measuring "Active Consumption").

## Product Scope

### MVP - Minimum Viable Product

- **Authentication:** Google Auth with YouTube Data API scope (for subscription import).
- **Core Workflow:** "Triage" View (Tinder-style Swipe Left to Archive, Swipe Right to Playlist).
- **Playback:** Custom Video Player with rapid gesture controls (Vertical Pan Left: Brightness, Vertical Pan Right: Volume, Horizontal Pan: Seek, Long Press: Speed).
- **Organization:** Create and manage "Channel Groups" (e.g., "Tech", "Music", "News").
- **Productivity:** Basic Markdown note-taking synced to the current video timestamp.
- **Infrastructure:** Real-time state sync via Convex backend.

### Growth Features (Post-MVP)

- **AI Intelligence:** Auto-summarization of videos and "Key Insight" extraction (leveraging template AI features).
- **Advanced Organization:** Smart filtering/sorting of subscriptions based on viewing history.
- **Export:** Sync notes to external tools (Notion, Obsidian).

### Vision (Future)

- **Knowledge OS:** The central operating system for video-based learning, transforming passive consumption into active knowledge management across all video platforms (not just YouTube).

## User Journeys

### Journey 1: Alex - The Triage Morning Routine (The Curator)

Alex is a senior developer who follows 50+ tech channels. He dreads the clutter of the standard YouTube feed. With Tubeflow, he opens the app and selects his "React & Web" **Channel Group**.

He toggles between two view modes for his dashboard. First, he checks the **List View** to quickly scan titles, using a quick Left Swipe to trash obviously irrelevant videos. Then, for the remaining items, he enters **Triage Mode (Tinder-style)** to focus on each thumbnail. He swipes **Left** to Archive and **Right** to Add to Playlist. In under 60 seconds, he has processed 20 incoming videos into a lean, 3-video playlist for his morning coffee, feeling zero "feed anxiety."

### Journey 2: Sarah - The High-Speed Commuter (The Consumer)

Sarah is watching a tech news update on the subway. The presenter is speaking slowly, and she wants to get through the content before her stop.

She engages Tubeflow's unique **Right-Side Vertical Pan** gesture. As she slides her thumb up the right edge of the screen, the playback speed smoothly accelerates from 1.0x to 1.5x, then 2.0x, with pitch correction keeping the audio clear. When the video cuts to a complex diagram, she slides her thumb down to slow it to 0.75x for a moment, then back up to 2.0x. She adjusts the brightness with a **Left-Side Pan** and fine-tunes the volume with a **Center Pan**. She consumes a 20-minute video in 10 minutes, feeling completely in command of the flow.

### Journey Requirements Summary

- **Dashboard Views (Core):**
  - **List View:** Traditional vertical list with Swipe-Left to Trash.
  - **Triage View:** Tinder-style card stack for focused decision making (Swipe Left/Right).
  - **Toggle:** Seamless switch between List and Triage modes.
- **Channel Groups (Core):** Ability to create custom groups of subscriptions (e.g., "Dev", "News") to filter the feed.
- **Custom Gesture Map (Core):**
  - **Left Vertical Pan:** Luminosity
  - **Center Vertical Pan:** Volume
  - **Right Vertical Pan:** **Playback Speed** (Smooth variable adjustment)
  - **Horizontal Pan:** Seek
- **Playlist Flow:** "Right-swiped" videos automatically form a continuous playback queue.
