# Salatiso Android App Specification (Phase 4 - Mobile Integration)

Date: 2025-10-13

## Goal
Deliver a React Native Android app that brings Sonny family networking, safety automation, and Ubuntu-guided collaboration to mobile with offline-first support and background services.

## Architecture
- Stack: React Native (Expo or bare RN), TypeScript, Reanimated, React Query.
- Native Modules:
  - Bluetooth LE (react-native-ble-plx)
  - Wi-Fi Direct (custom module or react-native-wifi-p2p)
  - Foreground service for background mesh & safety (Headless JS + Foreground Service)
  - Geolocation (react-native-geolocation-service)
  - Push Notifications (Firebase FCM)

## Core Modules
1. SonnyBridge Mobile Adapter
    - WebSocket + FCM fallback for internet bridge
    - Background delivery for alerts and messages
2. MeshEngine Mobile Adapter
    - BLE peripheral/central roles, Wi-Fi Direct group owner negotiation
    - Opportunistic sync when internet becomes available
3. TriggerManager Mobile
    - Panic button (hardware button mapping double-tap power optional)
    - Periodic check-in notifications, geofence entry/exit events
4. ConsentLedger Mobile
    - Local encrypted store with periodic cloud sync
5. TrustFramework Mobile
    - On-device scoring cache; sync diffs when online

## Data & Permissions
- Permissions: Location (Always), Bluetooth, Nearby devices, Notifications, Background activity.
- Storage: Secure storage for keys, SQLite for logs and offline queues.
- Privacy: Ubuntu-first consent screens; emergency override with audit logging.

## Screens
1. Onboarding & Consent
2. Family Network (status, proximity, members)
3. Safety Center (panic, check-in, geofences)
4. Messages (family chat, urgent alerts)
5. Trust (profile, badges, Ubuntu qualities)
6. Settings (permissions, debug, data export)

## Background Services
- Foreground notification: “Sonny Mesh active”
- Worker tasks: Routing updates, retry queues, geofence checks, heartbeat

## RN Services API (Parity with Web)
- useSonnyServicesRN(config)
- useSonnyBridgeRN(config)
- useSafetyManagerRN(config)
- useConsentManagerRN(config)
- useTrustNetworkRN(config)

## Interop
- Message schema parity with web MeshEngineService
- Shared protobuf/TypeScript schema via codegen (ts-proto)

## MVP Acceptance Criteria
- Panic alert end-to-end within 3s online / 10s offline-to-online
- Check-in workflow with notification prompts
- BLE discovery of nearby family device and simple message delivery
- Geofence trigger
- Consent request/approval flow

## Security
- Keypair per device; sign messages; rotate keys every 30 days
- Encrypted local storage; secure enclave where available

## Next Steps
- Choose RN bootstrap (Expo EAS vs bare RN); create RN workspace `salatiso-mobile`
- Build native BLE + Wi-Fi Direct adapters; mirror web service interfaces
- Implement hook parity and shared tests
- Integrate FCM for push and background handlers
# Android App Specification - Salatiso Mobile App
## Mlandeli-Notemba Investments Ecosystem

**Document Version:** 2.0.0 - Corrected App Identity
**Last Updated:** October 13, 2025
**Platform:** Android 8.0+ (API Level 26+)
**Development Framework:** React Native

---

## 1. APP OVERVIEW

### 1.1 Purpose
The Salatiso Mobile App provides mobile access to the complete Mlandeli-Notemba Investments ecosystem, mirroring all web platform functionality including family enterprise management, project tracking, business planning, and Ubuntu philosophy integration. The app serves as a full mobile companion to the Salatiso web platform, offering offline capabilities and mobile-optimized features.

### 1.2 Target Audience
- Family members managing family enterprise operations
- Ubuntu philosophy practitioners and community leaders
- South African families building generational wealth
- Entrepreneurs using MNI business planning tools
- Users requiring offline access to family and business data

### 1.3 Core Philosophy
"I am because we are" - Ubuntu principles guide all app interactions, emphasizing community, family unity, and collective prosperity.

---

## 2. FEATURE SPECIFICATIONS

### 2.1 Authentication & Security
**Status:** ✅ Mirror Web App

**Features:**
- Google OAuth Single Sign-On (same as web)
- Biometric authentication (Fingerprint/Face ID)
- Secure offline data storage
- Family member role-based access
- Auto-logout after inactivity

### 2.2 Core Modules (Mirroring Web App)

#### 2.2.1 Family Dashboard
- Welcome widget with Ubuntu quotes
- Family health overview
- Quick action buttons
- Gamification progress
- Offline sync status

#### 2.2.2 Family Tree
- Interactive family tree visualization
- Member profile access
- Relationship mapping
- Ubuntu wisdom sharing
- Offline family data

#### 2.2.3 Project Management
- MNI Registration project tracking
- Task completion checklists
- Progress visualization
- Offline task management
- Team collaboration (when online)

#### 2.2.4 Business Management
- Family business planning tools
- Financial tracking and budgeting
- Revenue and expense management
- Investment tracking
- Business milestone management

#### 2.2.5 Intranet Access
- Family intranet mobile interface
- Document library access
- Company registration tracking
- Strategic planning tools
- Communication hub

#### 2.2.6 Ubuntu Integration
- Daily Ubuntu quotes and screensaver
- Family philosophy implementation
- Community contribution tracking
- Cultural wisdom library
- Multi-language support (English, Afrikaans, isiXhosa, isiZulu)

### 2.3 Mobile-Specific Features

#### 2.3.1 Offline Capabilities
- Core family data offline access
- Task completion without internet
- Local data sync when online
- Emergency contact access
- Basic Ubuntu content offline

#### 2.3.2 Native Mobile Features
- Push notifications for family updates
- Camera integration for receipts/documents
- Voice notes for task updates
- Location services for family check-ins
- Contact integration for family directory

#### 2.3.3 Accessibility Features
- Screen reader compatibility
- Large text options
- High contrast mode
- Voice commands for hands-free operation
- Gesture navigation support

### 2.6 Sonny Integration & Mesh Communications
**Status:** 🚧 Phase 3 Implementation (Core Platform Integration)

**Overview:**
The Salatiso mobile app will fully integrate with Sonny Chat's offline-first mesh networking capabilities, providing comprehensive family enterprise coordination even when internet connectivity is limited. This integration enables seamless communication across the entire MNI ecosystem including LifeSync, PigeeBack, SafetyHelp, and BizHelp applications.

**Core Integration Features:**

#### Sonny Bridge Mode
```kotlin
interface SonnyBridgeClient {
    // Connect to LifeSync master device
    suspend fun discoverLifeSyncDevices(): List<MeshPeer>
    suspend fun connectToLifeSync(peerId: String): Result<Connection>
    
    // Sync essential family data via mesh
    suspend fun syncFamilyStatus(): Result<FamilyStatus>
    suspend fun syncTriggerAlerts(): Result<List<TriggerAlert>>
    
    // Lightweight messaging
    suspend fun sendQuickMessage(message: QuickMessage): Result<Unit>
    suspend fun receiveMessages(): Flow<QuickMessage>
}
```

#### Essential Mesh Features (Lite Mode)
- **Family Presence:** See who's online via mesh network
- **Quick Check-ins:** Simple "I'm safe" messages without full LifeSync
- **Emergency Alerts:** Receive critical safety triggers from family members
- **Location Sharing:** Basic location broadcast to nearby family devices
- **Trust Display:** Show trust scores from family ecosystem interactions

#### Hybrid Sync Strategy
```kotlin
// Data sync priority: Mesh first, Internet fallback
class HybridSyncManager {
    suspend fun syncFamilyData(): SyncResult {
        return try {
            // 1. Try mesh sync with LifeSync master device
            meshSync.syncWithLifeSync()
        } catch (meshException) {
            // 2. Fallback to internet sync if available
            internetSync.syncWithFirebase()
        } catch (internetException) {
            // 3. Use cached data with offline indicators
            offlineCache.getLastKnownData()
        }
    }
}
```

#### Consent Integration (Simplified)
```kotlin
interface ConsentManagerLite {
    // Basic consent for family mesh networking
    suspend fun requestMeshConsent(familyMemberId: String): ConsentStatus
    
    // Simple location sharing permission
    suspend fun shareLocationWithFamily(enabled: Boolean): Result<Unit>
    
    // Emergency override (always allowed for family safety)
    suspend fun enableEmergencyMode(): Result<Unit>
}
```

**Integration Scenarios:**

#### Scenario 1: Full Ecosystem Mesh Integration
```
Family Setup:
- Parent has LifeSync (mesh coordinator)  
- Teen has Salatiso app (full ecosystem access)
- Business operations coordinated across all apps
- Devices connected via hybrid mesh network

Workflow:
1. Salatiso app discovers family mesh via Bluetooth LE
2. Establishes full mesh connection with complete protocol
3. Syncs comprehensive data: family status, business data, project updates
4. Displays unified family enterprise dashboard
5. Enables cross-app communication and coordination
```

#### Scenario 2: Business Coordination Bridge
```
Setup:
- Salatiso user manages business operations remotely
- Family mesh network coordinates local activities
- App synchronizes business and family data

Workflow:  
1. Salatiso app connects to family mesh when available
2. Syncs business updates, project status, financial data
3. Bridges family enterprise data to cloud services
4. Downloads business updates for entire family network
5. Coordinates cross-ecosystem business operations
```

#### Scenario 3: Offline Enterprise Management
```
Setup:
- Salatiso user managing family business offline
- Complete enterprise functionality without connectivity

Workflow:
1. Access cached family and business data
2. Continue project management and task completion
3. Update business plans and financial tracking offline  
4. Queue all updates and communications for sync
5. Provide complete offline family enterprise dashboard
6. Auto-sync all business data when connectivity returns
```

**Technical Implementation:**

#### Mesh Protocol Adapter
```kotlin
class SonnyLiteAdapter {
    // Lightweight version of full Sonny mesh protocol
    private val meshEngine = SimpleMeshEngine(
        maxHops = 3,           // Reduced from full Sonny
        messageTypes = listOf( // Essential types only
            MessageType.FAMILY_STATUS,
            MessageType.EMERGENCY_ALERT,
            MessageType.QUICK_CHECKIN,
            MessageType.LOCATION_UPDATE
        )
    )
    
    // Simplified message routing
    suspend fun routeMessage(message: LiteMessage): Result<Unit> {
        return when {
            isLifeSyncAvailable() -> routeViaLifeSync(message)
            isInternetAvailable() -> routeViaInternet(message)
            else -> queueForLaterDelivery(message)
        }
    }
}
```

#### Data Model Compatibility
```kotlin
// Shared data models with LifeSync (subset)
data class FamilyStatusLite(
    val memberId: String,
    val displayName: String,
    val lastSeen: Instant,
    val presenceStatus: PresenceStatus, // ONLINE, OFFLINE, MESH_ONLY
    val trustTier: TrustTier,           // From full ecosystem
    val activeTriggersCount: Int,       // Summary only
    val lastLocation: LocationSummary?  // Simplified location
)

data class TriggerAlertLite(
    val triggerId: String,
    val memberName: String,
    val alertLevel: AlertLevel,         // LOW, MEDIUM, HIGH, EMERGENCY  
    val message: String,                // User-friendly summary
    val timestamp: Instant,
    val requiresResponse: Boolean
)
```

**Performance Optimizations:**
- Reduced mesh message payload (essential data only)
- Aggressive caching of family status for offline use
- Battery-optimized Bluetooth LE scanning intervals
- Background sync limitations to preserve battery life
- Simplified UI rendering for mesh-only mode

**Security Considerations:**
- End-to-end encryption for mesh communications (simplified keys)
- Family-only mesh discovery (no public broadcasts)
- Consent verification before any data sharing
- Audit logging for all mesh interactions
- Emergency override with full audit trail

**Future Roadmap:**
- **v2.1:** Full Sonny Chat integration (match LifeSync capabilities)
- **v2.2:** Smart TV casting for family dashboard
- **v2.3:** Advanced mesh routing and community postbox
- **v2.4:** Voice message support over mesh
- **v3.0:** Full ecosystem integration with all MNI apps

---

## 3. TECHNICAL ARCHITECTURE

### 3.1 Technology Stack
```json
{
  "framework": "React Native 0.72+",
  "language": "TypeScript",
  "state_management": "Redux Toolkit / Zustand",
  "navigation": "React Navigation 6.x",
  "database": "SQLite (offline) + Firestore (online)",
  "storage": "AsyncStorage + Firebase Storage",
  "authentication": "Firebase Auth",
  "notifications": "Firebase Cloud Messaging",
  "analytics": "Firebase Analytics"
}
```

### 3.2 App Structure
```
android/
├── app/src/main/
│   ├── java/com/salatiso/app/
│   │   ├── MainApplication.kt
│   │   ├── MainActivity.kt
│   │   └── services/
│   │       ├── NotificationService.kt
│   │       ├── SyncService.kt
│   │       └── SonnyMeshService.kt
│   ├── res/
│   │   ├── drawable/     # Ubuntu-themed icons
│   │   ├── layout/       # Native layouts
│   │   ├── values/       # Ubuntu color scheme
│   │   └── xml/          # App configurations
│   └── AndroidManifest.xml
├── app/build.gradle
└── gradle.properties

src/
├── components/           # Shared React Native components
├── screens/             # App screens
├── services/            # API and local services
├── utils/               # Helper functions
├── types/               # TypeScript definitions
└── constants/           # App constants
```

### 3.3 Data Synchronization
- **Real-time Sync:** Firestore live listeners
- **Offline Queue:** Action queue for offline operations
- **Conflict Resolution:** Last-write-wins with timestamps
- **Data Compression:** Optimized for mobile networks

---

## 4. USER INTERFACE DESIGN

### 4.1 Design Language
- **Ubuntu Design System:** Consistent with web platform
- **Color Palette:** Ubuntu-inspired warm colors
- **Typography:** Ubuntu font family
- **Icons:** Custom Ubuntu-themed icon set

### 4.2 Navigation Structure
```
Bottom Tab Navigation:
├── 🏠 Dashboard (Family Enterprise Overview)
├── 👨‍👩‍👧‍👦 Family (Tree, Directory, Ubuntu Hub)
├── � Business (Planning, Finance, Projects)
├── 📋 Intranet (Documents, Communication, Resources)
├── � Ecosystem (Connected Apps, Sonny Mesh)
└── ⚙️ Settings (Preferences, Security, Sync)
```

### 4.3 Key Screens

#### 4.3.1 Home Dashboard
- Ubuntu greeting with time-based messages
- Family health indicators
- Quick action cards
- Recent activity feed
- Offline sync status

#### 4.3.2 Family Tree Screen
- Zoomable family tree
- Member detail cards
- Relationship indicators
- Ubuntu wisdom display
- Search functionality

#### 4.3.3 Task Management
- Project progress overview
- Task completion interface
- Subtask checklists
- Note-taking capabilities
- Due date reminders

#### 4.3.4 Business Management Screen
- Family business dashboard
- Financial tracking interface
- Revenue and expense management
- Investment portfolio overview
- Strategic planning tools

#### 4.3.5 Intranet Portal
- Mobile document library
- Communication hub
- Resource center
- Company registration tracking
- Team collaboration tools

#### 4.3.6 Ecosystem Integration
- Connected apps overview
- Sonny mesh status
- Cross-app messaging
- Trust framework display
- Ubuntu community features

---

## 5. PERFORMANCE REQUIREMENTS

### 5.1 App Size & Performance
- **APK Size:** < 50MB (initial download)
- **RAM Usage:** < 200MB (normal operation)
- **Battery Impact:** Minimal background sync
- **Storage:** < 100MB (excluding user data)

### 5.2 Offline Performance
- **Core Features:** 100% offline capable
- **Sync Frequency:** Every 15 minutes when online
- **Data Retention:** 30 days offline data
- **Emergency Access:** Always available

---

## 6. SECURITY & PRIVACY

### 6.1 Data Protection
- **Encryption:** AES-256 for local storage
- **Authentication:** Firebase Auth with biometric
- **Network:** HTTPS-only communications
- **Permissions:** Minimal required permissions

### 6.2 Privacy Compliance
- **POPIA:** South African data protection
- **Family Data:** Encrypted and access-controlled
- **Location Data:** Opt-in only for family features
- **Contact Data:** Local storage only

---

## 7. DEVELOPMENT ROADMAP

### 7.1 Phase 1: MVP (Q1 2026)
- Basic authentication and dashboard
- Family tree viewer
- Offline task management
- Core eKhaya features

### 7.2 Phase 2: Enhancement (Q2 2026)
- Push notifications
- Camera integration
- Voice features
- Advanced offline capabilities

### 7.3 Phase 3: Ecosystem Integration (Q3 2026)
- Cross-app data sharing
- Advanced Ubuntu features
- Multi-language support
- Performance optimizations

---

## 8. TESTING & QUALITY ASSURANCE

### 8.1 Testing Strategy
- **Unit Tests:** Jest + React Native Testing Library
- **Integration Tests:** Detox for E2E testing
- **Device Testing:** Firebase Test Lab
- **Accessibility:** Mobile accessibility guidelines

### 8.2 Beta Testing
- **Family Beta Group:** Internal family testing
- **Community Beta:** Ubuntu community testing
- **Performance Testing:** Real-world usage scenarios

---

## 9. DEPLOYMENT & DISTRIBUTION

### 9.1 App Store Presence
- **Google Play Store:** Primary distribution
- **Internal Testing:** Firebase App Distribution
- **Beta Channel:** Open beta testing

### 9.2 Update Strategy
- **Automatic Updates:** Background app updates
- **Forced Updates:** Critical security updates
- **Feature Flags:** Gradual feature rollout

---

## 10. MAINTENANCE & SUPPORT

### 10.1 Version Control
- **Release Cycle:** Monthly feature updates
- **Hotfixes:** As needed for critical issues
- **Beta Releases:** Weekly for active development

### 10.2 Support Channels
- **In-App Support:** Integrated help system
- **Email:** hub@salatiso.com, lifecvhub@gmail.com
- **Community:** Ubuntu community forums
- **Documentation:** Integrated app help

---

## 11. SUCCESS METRICS

### 11.1 User Engagement
- **Daily Active Users:** Target 70% of family members
- **Task Completion Rate:** >80% for assigned tasks
- **Offline Usage:** >50% of sessions offline-capable

### 11.2 Technical Performance
- **App Store Rating:** Target 4.5+ stars
- **Crash Rate:** <0.1% of sessions
- **Load Time:** <3 seconds cold start

---

## 12. BUDGET & RESOURCES

### 12.1 Development Team
- **Lead Developer:** React Native specialist
- **UI/UX Designer:** Ubuntu design system expert
- **QA Engineer:** Mobile testing specialist
- **DevOps:** Firebase and mobile deployment

### 12.2 Timeline & Milestones
- **Planning:** November 2025
- **Development:** December 2025 - February 2026
- **Testing:** March 2026
- **Launch:** April 2026

---

**Document Status:** ✅ Specification Complete
**Next Review:** November 13, 2025
**Maintained By:** Salatiso Technology Team

---

*This specification ensures the Android app mirrors all web app functionality while optimizing for mobile usage patterns, offline capabilities, and native Android features. The app maintains Ubuntu philosophy integration while providing practical home management tools for South African families.*
