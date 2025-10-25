# LifeSync Android Application - Comprehensive Technical Specification
**Version:** 3.0.0 (Sonny Chat Integration & Ecosystem Enhancement)  
**Last Updated:** October 13, 2025  
**Project:** LifeSync + Sonny Chat - Complete Salatiso Ecosystem Platform

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Sonny Chat Integration - Offline-First Communications Backbone](#sonny-chat-integration)
3. [Trigger-Based Safety System](#trigger-based-safety-system)
4. [Reciprocal Monitoring & Data Exchange](#reciprocal-monitoring)
5. [Enhanced Location Services (What3Words + Weather)](#enhanced-location-services)
6. [Mesh Networking Architecture](#mesh-networking-architecture)
7. [Trust & Safety Framework](#trust-safety-framework)
8. [Updated Database Schema](#updated-database-schema)
9. [Ecosystem Integration Points](#ecosystem-integration)
10. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

### The Sonny Vision
LifeSync v3.0 integrates **Sonny Chat** as the offline-first communications and safety backbone of the entire Salatiso ecosystem. Sonny is not a standalone feature—it is the foundational layer that enables:

- **Offline-first messaging** via Bluetooth + Wi-Fi mesh
- **Trigger-based safety monitoring** with automatic escalation
- **Reciprocal data exchange** ensuring mutual accountability
- **Mesh postbox routing** for community-wide message distribution
- **Consent-driven monitoring** with time-boxed, renewable permissions
- **Trust scoring** integrated with LifeCV ratings and check-in history

### Core Principles

#### 1. Offline-First, Online-Optional
- Bluetooth + Wi-Fi mesh as default communication layer
- Internet only when explicitly chosen or triggered by safety rules
- All features work offline; online adds capabilities but is never required

#### 2. Reciprocity by Design
- Every sync is two-way: if I store your safety data, you store mine
- Monitoring roles must be accepted, logged, and renewable
- Ratings and check-ins are mutual—both parties rate each other

#### 3. Trigger-Based Safety Automation
- Users define check-in triggers (during trip, after arrival, at intervals)
- Missed triggers → local escalation → online escalation if unresolved
- Automatic notification of emergency contacts with reciprocal party details

#### 4. Trust Scoring
- Built from ratings, LifeCV history, reciprocity logs, check-in reliability
- Higher trust score = more reliable partners, safer interactions
- Integrated across all ecosystem apps (PigeeBack, Ekhaya, SafetyHelp, etc.)

#### 5. Consent as First Security Layer
- No monitoring or visibility without explicit opt-in
- Consent is time-boxed and renewable
- Users control their broadcast status and discovery settings

### Key Architectural Changes

1. **Sonny Mesh Engine** → Core offline messaging + routing layer
2. **Trigger Manager** → User-defined rules, timers, escalation logic
3. **Consent Ledger** → Immutable log of monitoring relationships
4. **Reciprocal Safety Exchange** → Mutual data storage during interactions
5. **Enhanced Location** → What3Words + Weather + Google Maps integration
6. **Gossip Routing** → Store-and-forward mesh postbox system

---

## Sonny Chat Integration

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   LIFESYNC MASTER HUB                   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │            SONNY MESH ENGINE (Core)                │ │
│  │  • Bluetooth LE + WiFi Direct Mesh                 │ │
│  │  • Gossip Routing (Store & Forward)                │ │
│  │  • Trigger Manager                                 │ │
│  │  • Consent Ledger                                  │ │
│  │  • Reciprocal Safety Exchange                      │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↓                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │              LIFECV (Identity Layer)               │ │
│  │  • Trust Score • Ratings • Endorsements            │ │
│  │  • Check-in History • Reciprocity Logs             │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↓                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │            LIFESYNC (Sync Engine)                  │ │
│  │  • Offline-First Sync • Data Propagation           │ │
│  │  • Online Bridge (Optional) • State Management     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │    ECOSYSTEM VERTICAL APPS          │
        ├─────────────────────────────────────┤
        │  • PigeeBack (Transportation)       │
        │  • Ekhaya (Family & Home)           │
        │  • SafetyHelp (Workplace OH&S)      │
        │  • HRHelp (HR & Visitor Management) │
        │  • Flamea Sazi (Community/Church)   │
        │  • Sazi Life Academy (Education)    │
        └─────────────────────────────────────┘
```

### Sonny Core Services

#### 1. Sonny Mesh Engine
```kotlin
@Singleton
class SonnyMeshEngine @Inject constructor(
    private val bluetoothManager: BluetoothManager,
    private val wifiP2pManager: WifiP2pManager,
    private val lifecvService: LifeCVService,
    private val triggerManager: TriggerManager,
    private val consentLedger: ConsentLedger
) {
    // Peer discovery and connection
    suspend fun discoverPeers(): Flow<MeshPeer>
    suspend fun connectToPeer(peerId: String): Result<MeshConnection>
    
    // Messaging (offline-first)
    suspend fun sendMessage(message: SonnyMessage): Result<Unit>
    suspend fun receiveMessages(): Flow<SonnyMessage>
    
    // Reciprocal safety exchange
    suspend fun exchangeSafetyData(
        peerId: String,
        contextId: String, // Trip ID, visit ID, etc.
        scope: SafetyDataScope
    ): Result<ReciprocExchange>
    
    // Gossip routing (postbox)
    suspend fun routeMessage(
        message: SonnyMessage,
        maxHops: Int = 6
    ): Result<RoutingInfo>
    
    // Range detection
    fun monitorPeerRange(): Flow<PeerRangeEvent>
    suspend fun notifyInRange(peerId: String)
}

data class SonnyMessage(
    val id: String,
    val senderId: String,
    val recipientIds: List<String>, // Empty = broadcast
    val type: MessageType,
    val content: ByteArray, // Encrypted
    val timestamp: Long,
    val ttl: Int = 24, // Hours
    val hopCount: Int = 0,
    val maxHops: Int = 6,
    val isPostbox: Boolean = false, // Store and forward
    val requiresOnline: Boolean = false,
    val priority: MessagePriority
)

enum class MessageType {
    TEXT, VOICE, VIDEO, IMAGE, LOCATION,
    SAFETY_CHECK_IN, EMERGENCY_ALERT,
    PROFILE_SYNC, RATING_UPDATE,
    COMMUNITY_ANNOUNCEMENT, POSTBOX_FORWARD
}

enum class MessagePriority {
    LOW, NORMAL, HIGH, URGENT, EMERGENCY
}
```

#### 2. Trigger Manager
```kotlin
@Singleton
class TriggerManager @Inject constructor(
    private val alarmManager: AlarmManager,
    private val notificationManager: NotificationManager,
    private val meshEngine: SonnyMeshEngine,
    private val escalationService: EscalationService
) {
    // Register user-defined triggers
    suspend fun registerTrigger(trigger: SafetyTrigger): Result<String>
    suspend fun cancelTrigger(triggerId: String): Result<Unit>
    
    // Check-in handling
    suspend fun checkIn(triggerId: String, status: CheckInStatus): Result<Unit>
    suspend fun missedCheckIn(triggerId: String): Result<EscalationAction>
    
    // Trigger monitoring
    fun monitorTriggers(): Flow<TriggerEvent>
    suspend fun evaluateTrigger(triggerId: String): TriggerEvaluation
}

data class SafetyTrigger(
    val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val name: String,
    val type: TriggerType,
    val contextId: String?, // Trip ID, route ID, etc.
    
    // Timing
    val startTime: Long?,
    val interval: Long?, // Milliseconds between check-ins
    val expectedDuration: Long?, // Total expected duration
    val checkInWindows: List<TimeWindow>?, // Specific check-in times
    
    // Check-in requirements
    val requiresLocationConfirm: Boolean = true,
    val requiresUserAction: Boolean = true, // Manual vs automatic
    val autoCheckInRadius: Float? = null, // Meters from expected location
    
    // Escalation policy
    val localEscalationContacts: List<String>, // Household/community
    val onlineEscalationContacts: List<String>, // Emergency contacts
    val escalationDelay: Long = 5 * 60 * 1000, // 5 minutes default
    val maxEscalationLevel: EscalationLevel = EscalationLevel.FULL_ONLINE,
    
    // Reciprocal party (if applicable)
    val reciprocalPartyId: String?, // Driver, host, etc.
    val reciprocalDataExchanged: Boolean = false,
    
    // Status
    val isActive: Boolean = true,
    val lastCheckIn: Long? = null,
    val missedCheckIns: Int = 0
)

enum class TriggerType {
    TRIP_START,         // Beginning of journey
    TRIP_MID_POINT,     // During journey
    TRIP_END,           // Arrival at destination
    ROUTE_CHECKPOINT,   // Specific location along route
    PERIODIC,           // Regular intervals (school, work)
    TIME_WINDOW,        // Expected to be somewhere at a time
    GEOFENCE_ENTRY,     // Entering a defined area
    GEOFENCE_EXIT,      // Leaving a defined area
    VISIT_DURATION,     // Length of stay at location
    ACTIVITY_BASED      // Custom activity trigger
}

enum class EscalationLevel {
    NONE,                   // No escalation
    LOCAL_NOTIFICATION,     // Device notification only
    MESH_LOCAL,             // Household/community via mesh
    MESH_EXTENDED,          // Extended network via mesh
    PARTIAL_ONLINE,         // Limited online notification
    FULL_ONLINE             // Full online escalation + reciprocal
}

data class CheckInStatus(
    val triggerId: String,
    val timestamp: Long,
    val location: LatLng?,
    val accuracy: Float?,
    val what3WordsAddress: String?,
    val userConfirmation: Boolean,
    val status: CheckInResult,
    val notes: String?
)

enum class CheckInResult {
    SUCCESS,
    SUCCESS_AUTO,       // Auto check-in via location
    LATE,
    MISSED,
    CANCELLED
}
```

#### 3. Consent Ledger
```kotlin
@Singleton
class ConsentLedger @Inject constructor(
    private val database: LifeSyncDatabase,
    private val lifecvService: LifeCVService
) {
    // Monitor-Monitored relationship management
    suspend fun requestMonitoringRole(
        request: MonitoringRequest
    ): Result<String>
    
    suspend fun respondToRequest(
        requestId: String,
        response: ConsentResponse
    ): Result<Unit>
    
    suspend fun renewConsent(
        relationshipId: String,
        duration: Long
    ): Result<Unit>
    
    suspend fun revokeConsent(relationshipId: String): Result<Unit>
    
    // Query relationships
    suspend fun getMonitoringRelationships(
        userId: String
    ): Flow<List<MonitoringRelationship>>
    
    suspend fun getActiveMonitors(userId: String): List<String>
    suspend fun getActiveMonitored(userId: String): List<String>
}

@Entity(tableName = "monitoring_relationships")
data class MonitoringRelationship(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val monitorId: String,      // Person doing monitoring
    val monitoredId: String,    // Person being monitored
    val relationship: RelationshipType,
    val level: MonitoringLevel,
    val scope: MonitoringScope,
    
    // Consent
    val consentGivenAt: Long,
    val consentExpiresAt: Long?,
    val isActive: Boolean = true,
    val autoRenew: Boolean = false,
    
    // Conditions
    val conditions: List<MonitoringCondition>,
    val allowedContexts: List<String>?, // Trip types, locations, etc.
    
    // Audit
    val accessLog: List<AccessLogEntry> = emptyList(),
    val lastAccessed: Long? = null
)

enum class RelationshipType {
    PARENT_CHILD, GUARDIAN_WARD,
    SPOUSE, SIBLING,
    FRIEND, COLLEAGUE,
    DRIVER_PASSENGER, HOST_VISITOR,
    EMPLOYER_EMPLOYEE, MENTOR_MENTEE,
    COMMUNITY_MEMBER, EMERGENCY_CONTACT
}

enum class MonitoringLevel {
    MINIMAL,        // Location only when check-in missed
    STANDARD,       // Regular check-ins + location
    ENHANCED,       // Real-time location + status
    FULL            // Real-time + safety data access
}

data class MonitoringScope(
    val includeLocation: Boolean = true,
    val includeCheckIns: Boolean = true,
    val includeSafetyData: Boolean = false,
    val includeLifeCV: Boolean = false,
    val contexts: List<ContextType> = emptyList()
)

enum class ContextType {
    ALL, TRAVEL, WORK, SCHOOL,
    VISITING, SHOPPING, HEALTHCARE,
    EMERGENCY_ONLY, SPECIFIC_ROUTES
}
```

#### 4. Reciprocal Safety Exchange
```kotlin
@Singleton
class ReciprocalSafetyService @Inject constructor(
    private val meshEngine: SonnyMeshEngine,
    private val lifecvService: LifeCVService,
    private val encryptionService: EncryptionService
) {
    suspend fun initiateSafetyExchange(
        peerId: String,
        contextId: String,
        scope: SafetyDataScope
    ): Result<ReciprocExchange>
    
    suspend fun storePeerSafetyData(
        exchange: ReciprocExchange
    ): Result<Unit>
    
    suspend fun retrieveSafetyData(
        peerId: String,
        contextId: String
    ): Result<SafetyDataPackage>
    
    suspend fun notifyExchangeParties(
        contextId: String,
        event: ExchangeEvent
    ): Result<Unit>
}

data class ReciprocExchange(
    val id: String = UUID.randomUUID().toString(),
    val contextId: String, // Trip ID, visit ID, etc.
    val initiatorId: String,
    val responderId: String,
    
    // Data packages (encrypted)
    val initiatorData: SafetyDataPackage,
    val responderData: SafetyDataPackage,
    
    // Exchange metadata
    val timestamp: Long = System.currentTimeMillis(),
    val expiresAt: Long?,
    val scope: SafetyDataScope,
    
    // Status
    val status: ExchangeStatus,
    val acknowledged: Boolean = false
)

data class SafetyDataPackage(
    val userId: String,
    val profileSummary: LifeCVSummary,
    val trustScore: Int,
    val trustTier: TrustTier,
    val emergencyContacts: List<EmergencyContact>,
    val currentLocation: LatLng?,
    val what3WordsAddress: String?,
    val photoUrl: String?,
    val vehicleInfo: VehicleInfo?, // For PigeeBack
    val relevantRatings: List<Rating>,
    val lastCheckIn: Long?,
    
    // Encrypted sensitive data
    val encryptedIdNumber: String?,
    val encryptedPhone: String?,
    val encryptedAddress: String?
)

data class SafetyDataScope(
    val includeProfile: Boolean = true,
    val includeContacts: Boolean = true,
    val includeLocation: Boolean = true,
    val includeVehicle: Boolean = false,
    val includeRatings: Boolean = true,
    val includeSensitiveData: Boolean = false,
    val duration: Long? = null // How long data is valid
)

enum class ExchangeStatus {
    INITIATED, ACCEPTED, COMPLETED,
    DECLINED, EXPIRED, ESCALATED
}

enum class ExchangeEvent {
    STARTED, CHECK_IN_MADE, CHECK_IN_MISSED,
    COMPLETED_NORMAL, EMERGENCY_ESCALATION,
    MANUAL_NOTIFICATION
}
```

---

## Trigger-Based Safety System

### User Journey Example: PigeeBack Ride

#### 1. Trip Setup (Before Ride)
```kotlin
// User sets up trip trigger
val tripTrigger = SafetyTrigger(
    userId = currentUserId,
    name = "School Trip - Morning",
    type = TriggerType.TRIP_START,
    contextId = pigeeback tripId,
    
    // Check-in requirements
    interval = 15 * 60 * 1000, // Check in every 15 min
    expectedDuration = 45 * 60 * 1000, // 45 min total
    checkInWindows = listOf(
        TimeWindow(start = tripStart, end = tripStart + 5 * 60 * 1000), // Start confirm
        TimeWindow(start = tripEnd - 5 * 60 * 1000, end = tripEnd + 10 * 60 * 1000) // Arrival confirm
    ),
    
    // Escalation
    localEscalationContacts = householdMembers,
    onlineEscalationContacts = emergencyContacts,
    escalationDelay = 5 * 60 * 1000,
    
    // Reciprocal party
    reciprocalPartyId = driverId
)

triggerManager.registerTrigger(tripTrigger)
```

#### 2. Boarding Vehicle (Sync & Exchange)
```kotlin
// Scan driver's QR or connect via mesh
val driverPeer = meshEngine.discoverPeers()
    .first { it.userId == driverId }

// Initiate reciprocal safety exchange
val exchange = reciprocalSafetyService.initiateSafetyExchange(
    peerId = driverPeer.id,
    contextId = tripId,
    scope = SafetyDataScope(
        includeProfile = true,
        includeContacts = true,
        includeLocation = true,
        includeVehicle = true,
        includeRatings = true,
        duration = 2 * 60 * 60 * 1000 // 2 hours
    )
)

// Both phones now store each other's safety data
// Rider has: driver's profile, contacts, vehicle info, trust score
// Driver has: rider's profile, contacts, location, trust score
```

#### 3. During Trip (Monitoring)
```kotlin
// App monitors trigger automatically
triggerManager.monitorTriggers()
    .filter { it.triggerId == tripTrigger.id }
    .collect { event ->
        when (event) {
            is TriggerEvent.CheckInRequired -> {
                // Show notification for manual check-in
                notificationManager.showCheckInNotification(event)
            }
            
            is TriggerEvent.AutoCheckInSuccess -> {
                // Location-based auto check-in succeeded
                meshEngine.notifyPeerInRange(driverId)
            }
            
            is TriggerEvent.CheckInMissed -> {
                // User missed check-in, start escalation
                escalationService.startEscalation(
                    triggerId = tripTrigger.id,
                    exchange = exchange
                )
            }
        }
    }
```

#### 4. Escalation Flow (If Check-In Missed)
```kotlin
// Level 1: Local mesh notification (household)
escalationService.notifyMeshLocal(
    triggerId = tripTrigger.id,
    contacts = tripTrigger.localEscalationContacts
)

// Wait escalationDelay (5 minutes)
delay(tripTrigger.escalationDelay)

// Level 2: Still no response, go online
if (!escalationService.isResolved(tripTrigger.id)) {
    escalationService.notifyOnline(
        triggerId = tripTrigger.id,
        riderContacts = tripTrigger.onlineEscalationContacts,
        riderData = exchange.initiatorData,
        driverContacts = exchange.responderData.emergencyContacts,
        driverData = exchange.responderData
    )
    
    // Send SMS/Email with:
    // - Last known location
    // - Driver details (name, photo, vehicle, trust score)
    // - Rider details (name, photo, trust score)
    // - Trip details (start, expected end, route)
    // - Reciprocal exchange ID for follow-up
}
```

#### 5. Arrival & Rating
```kotlin
// User confirms arrival
triggerManager.checkIn(
    triggerId = tripTrigger.id,
    status = CheckInStatus(
        triggerId = tripTrigger.id,
        timestamp = System.currentTimeMillis(),
        location = destinationLocation,
        userConfirmation = true,
        status = CheckInResult.SUCCESS
    )
)

// Trigger deactivates
// Prompt mutual rating
ratingService.promptMutualRating(
    contextId = tripId,
    party1 = currentUserId,
    party2 = driverId,
    context = RatingContext.PIGEEBACK_TRIP
)

// Both users rate each other
// Ratings update trust scores
// Check-in success improves trust score
```

---

## Enhanced Location Services

### Integration Points

#### 1. What3Words Integration
```kotlin
@Singleton
class What3WordsService @Inject constructor(
    private val apiKey: String = "EE350714"
) {
    suspend fun getWhat3WordsAddress(
        latitude: Double,
        longitude: Double
    ): Result<What3WordsAddress>
    
    suspend fun getCoordinates(
        what3words: String
    ): Result<LatLng>
    
    suspend fun getSuggestions(
        partial: String
    ): Result<List<What3WordsSuggestion>>
}

data class What3WordsAddress(
    val words: String, // e.g., "table.chair.lamp"
    val language: String = "en",
    val coordinates: LatLng,
    val nearestPlace: String?,
    val country: String
)
```

#### 2. Weather Integration (OpenWeatherMap)
```kotlin
@Singleton
class WeatherService @Inject constructor(
    private val apiKey: String = "6a36a434a17e560f2eb5014b9dd056b8"
) {
    suspend fun getCurrentWeather(
        location: LatLng
    ): Result<WeatherData>
    
    suspend fun getWeatherForecast(
        location: LatLng,
        days: Int = 7
    ): Result<List<WeatherForecast>>
    
    suspend fun getWeatherAlerts(
        location: LatLng
    ): Result<List<WeatherAlert>>
}

data class WeatherData(
    val temperature: Double, // Celsius
    val feelsLike: Double,
    val condition: WeatherCondition,
    val description: String,
    val humidity: Int, // Percentage
    val windSpeed: Double, // m/s
    val visibility: Int, // Meters
    val uvIndex: Double?,
    val timestamp: Long
)

enum class WeatherCondition {
    CLEAR, CLOUDY, RAIN, THUNDERSTORM,
    SNOW, MIST, FOG, WINDY, EXTREME
}
```

#### 3. Enhanced Location Component
```kotlin
@Composable
fun EnhancedLocationCard(
    location: LatLng,
    accuracy: Float?,
    modifier: Modifier = Modifier
) {
    val what3Words by rememberWhat3Words(location)
    val weather by rememberWeather(location)
    
    Card(modifier = modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Coordinates
            Text(
                text = "Coordinates: ${location.latitude}, ${location.longitude}",
                style = MaterialTheme.typography.bodySmall
            )
            
            // What3Words
            what3Words?.let {
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.LocationOn, "What3Words")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = it.words,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = { /* Copy to clipboard */ }) {
                        Icon(Icons.Default.ContentCopy, "Copy")
                    }
                }
                Text(
                    text = "Near: ${it.nearestPlace}",
                    style = MaterialTheme.typography.bodySmall
                )
            }
            
            // Weather
            weather?.let {
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        WeatherIcon(it.condition)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "${it.temperature}°C",
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                    Text(
                        text = it.description,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
            
            // Accuracy
            accuracy?.let {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Accuracy: ±${it}m",
                    style = MaterialTheme.typography.bodySmall,
                    color = if (it < 50) Color.Green else Color.Orange
                )
            }
            
            // Google Maps button
            OutlinedButton(
                onClick = { /* Open Google Maps */ },
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.Map, "Open in Maps")
                Spacer(modifier = Modifier.width(8.dp))
                Text("View in Google Maps")
            }
        }
    }
}
```

#### 4. Offline/Online Mode Indicator
```kotlin
@Composable
fun ConnectionModeIndicator(
    isFullyOnline: Boolean,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = if (isFullyOnline) 
                Color(0xFF4CAF50) else Color(0xFFFFA726)
        )
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = if (isFullyOnline) 
                    Icons.Default.CloudDone else Icons.Default.CloudOff,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Column {
                Text(
                    text = if (isFullyOnline) "Full Online" else "Offline Mode",
                    style = MaterialTheme.typography.labelMedium,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = if (isFullyOnline) 
                        "All features available" 
                        else "Mesh + Basic features",
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.White.copy(alpha = 0.9f)
                )
            }
        }
    }
}

@Composable
fun FeatureAvailabilityDialog(
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Feature Availability") },
        text = {
            Column {
                Text(
                    "Offline Mode (Default)",
                    fontWeight = FontWeight.Bold
                )
                Text("✓ Mesh messaging (Bluetooth/WiFi)")
                Text("✓ Safety triggers & check-ins")
                Text("✓ Profile sync with nearby users")
                Text("✓ Basic location (GPS)")
                Text("✓ Local community features")
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    "Full Online Mode",
                    fontWeight = FontWeight.Bold
                )
                Text("✓ All offline features")
                Text("✓ What3Words precise location")
                Text("✓ Real-time weather data")
                Text("✓ Google Maps integration")
                Text("✓ Cloud sync & backup")
                Text("✓ Extended emergency escalation")
                Text("✓ Global messaging")
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Got it")
            }
        }
    )
}
```

---

## Mesh Networking Architecture

### Gossip Routing & Postbox System

#### 1. Message Routing Engine
```kotlin
@Singleton
class GossipRoutingEngine @Inject constructor(
    private val meshEngine: SonnyMeshEngine,
    private val database: LifeSyncDatabase
) {
    // Store and forward
    suspend fun routeMessage(
        message: SonnyMessage,
        maxHops: Int = 6
    ): Result<RoutingInfo>
    
    // Peer relay
    suspend fun relayToNextHop(
        message: SonnyMessage,
        availablePeers: List<MeshPeer>
    ): Result<Unit>
    
    // Message storage for forwarding
    suspend fun storeForForwarding(
        message: SonnyMessage,
        targetUserId: String
    ): Result<Unit>
    
    // Deliver when peer in range
    suspend fun deliverPendingMessages(
        peerId: String
    ): Flow<SonnyMessage>
    
    // Community broadcast
    suspend fun broadcastToCommunity(
        message: SonnyMessage,
        communityId: String
    ): Result<BroadcastStats>
}

data class RoutingInfo(
    val messageId: String,
    val status: RoutingStatus,
    val currentHop: Int,
    val deliveredTo: List<String>,
    val pendingDelivery: List<String>,
    val failedDelivery: List<String>,
    val estimatedReach: Int // Estimated number of users who will receive
)

enum class RoutingStatus {
    PENDING,        // Waiting for delivery opportunity
    IN_TRANSIT,     // Being relayed through mesh
    DELIVERED,      // Reached intended recipient(s)
    PARTIALLY_DELIVERED, // Some recipients reached
    MAX_HOPS_REACHED,    // Hit hop limit
    EXPIRED         // TTL expired
}

// Postbox storage
@Entity(tableName = "postbox_messages")
data class PostboxMessage(
    @PrimaryKey val id: String,
    val message: SonnyMessage,
    val targetUserId: String?,
    val targetCommunityId: String?,
    val isDelivered: Boolean = false,
    val hopCount: Int = 0,
    val receivedFrom: String,
    val storedAt: Long = System.currentTimeMillis(),
    val expiresAt: Long,
    val priority: MessagePriority
)
```

#### 2. Community Postbox Example
```kotlin
// Scenario: Community announcement, completely offline

// Community leader creates announcement
val announcement = SonnyMessage(
    id = UUID.randomUUID().toString(),
    senderId = leaderUserId,
    recipientIds = emptyList(), // Broadcast
    type = MessageType.COMMUNITY_ANNOUNCEMENT,
    content = encryptForCommunity("Church service moved to 10 AM"),
    isPostbox = true,
    maxHops = 6,
    requiresOnline = false,
    priority = MessagePriority.HIGH
)

// Send via gossip routing
gossipEngine.broadcastToCommunity(
    message = announcement,
    communityId = "church_community_123"
)

// As users walk around with their phones:
// 1. Leader's phone broadcasts to nearby community members
// 2. Those members store the message in their postbox
// 3. As they move, they relay to new community members
// 4. Eventually, all community members receive the message
// 5. No internet required, but if someone has internet,
//    they can optionally bridge it online for faster distribution

// Optional: Internet bridge
if (userHasInternet && message.canBridgeOnline) {
    onlineBridgeService.distributeOnline(
        message = announcement,
        communityMembers = getCommunityMembers(communityId)
    )
}
```

#### 3. Route-Based Message Delivery
```kotlin
// Scenario: Message delivery along walking route

// User's morning route
val morningRoute = Route(
    id = "morning_route_home_to_work",
    userId = currentUserId,
    name = "Home to Work",
    waypoints = listOf(
        Waypoint(home, "Home"),
        Waypoint(friend1House, "Sarah's House"),
        Waypoint(shop, "Spaza Shop"),
        Waypoint(friend2House, "Thabo's House"),
        Waypoint(busStop, "Bus Stop"),
        Waypoint(work, "Work")
    ),
    schedule = listOf(
        RouteSchedule(
            dayOfWeek = DayOfWeek.MONDAY_TO_FRIDAY,
            departureTime = LocalTime.of(6, 30),
            arrivalTime = LocalTime.of(7, 30)
        )
    ),
    contacts = listOf("sarah_id", "thabo_id", "shop_owner_id")
)

// System monitors route
routeMonitor.monitorRoute(morningRoute)
    .collect { event ->
        when (event) {
            is RouteEvent.WaypointApproaching -> {
                // User approaching Sarah's house
                // Check for messages to deliver
                val pendingMessages = postboxService
                    .getMessagesForUser("sarah_id")
                
                if (pendingMessages.isNotEmpty()) {
                    meshEngine.connectToPeer("sarah_peer_id")
                    pendingMessages.forEach { msg ->
                        meshEngine.sendMessage(msg)
                    }
                }
            }
            
            is RouteEvent.ContactInRange -> {
                // Sarah detected in range
                // Auto check-in: "Passed Sarah's house"
                triggerManager.checkIn(
                    triggerId = routeTriggerId,
                    status = CheckInStatus(
                        triggerId = routeTriggerId,
                        location = event.location,
                        userConfirmation = false,
                        status = CheckInResult.SUCCESS_AUTO
                    )
                )
                
                // Notify household
                meshEngine.notifyMeshLocal(
                    "User passed Sarah's house - trip on schedule"
                )
            }
        }
    }
```

---

## Updated Database Schema

### New Entities for Sonny Integration

```kotlin
// Sonny Messages
@Entity(tableName = "sonny_messages")
data class SonnyMessageEntity(
    @PrimaryKey val id: String,
    val senderId: String,
    val recipientIds: String, // JSON array
    val type: String, // MessageType enum
    val content: ByteArray, // Encrypted
    val timestamp: Long,
    val ttl: Int,
    val hopCount: Int,
    val maxHops: Int,
    val isPostbox: Boolean,
    val requiresOnline: Boolean,
    val priority: String, // MessagePriority enum
    val deliveryStatus: String, // Delivered, pending, failed
    val readAt: Long? = null
)

// Safety Triggers
@Entity(tableName = "safety_triggers")
data class SafetyTriggerEntity(
    @PrimaryKey val id: String,
    val userId: String,
    val name: String,
    val type: String, // TriggerType enum
    val contextId: String?,
    
    // Timing (JSON serialized)
    val startTime: Long?,
    val interval: Long?,
    val expectedDuration: Long?,
    val checkInWindows: String?, // JSON array
    
    // Requirements
    val requiresLocationConfirm: Boolean,
    val requiresUserAction: Boolean,
    val autoCheckInRadius: Float?,
    
    // Escalation (JSON serialized)
    val localEscalationContacts: String, // JSON array
    val onlineEscalationContacts: String, // JSON array
    val escalationDelay: Long,
    val maxEscalationLevel: String, // EscalationLevel enum
    
    // Reciprocal
    val reciprocalPartyId: String?,
    val reciprocalDataExchanged: Boolean,
    
    // Status
    val isActive: Boolean,
    val lastCheckIn: Long?,
    val missedCheckIns: Int,
    val createdAt: Long,
    val expiresAt: Long?
)

// Check-In History
@Entity(tableName = "check_in_history")
data class CheckInHistoryEntity(
    @PrimaryKey val id: String,
    val triggerId: String,
    val userId: String,
    val timestamp: Long,
    val latitude: Double?,
    val longitude: Double?,
    val accuracy: Float?,
    val what3WordsAddress: String?,
    val userConfirmation: Boolean,
    val status: String, // CheckInResult enum
    val notes: String?,
    val wasEscalated: Boolean,
    val escalationLevel: String?
)

// Reciprocal Exchanges
@Entity(tableName = "reciprocal_exchanges")
data class ReciprocalExchangeEntity(
    @PrimaryKey val id: String,
    val contextId: String,
    val initiatorId: String,
    val responderId: String,
    
    // Data packages (JSON serialized, encrypted)
    val initiatorData: String,
    val responderData: String,
    
    // Metadata
    val timestamp: Long,
    val expiresAt: Long?,
    val scope: String, // SafetyDataScope JSON
    
    // Status
    val status: String, // ExchangeStatus enum
    val acknowledged: Boolean,
    val escalated: Boolean = false,
    val escalationDetails: String? = null
)

// Monitoring Relationships (Consent Ledger)
@Entity(tableName = "monitoring_relationships")
data class MonitoringRelationshipEntity(
    @PrimaryKey val id: String,
    val monitorId: String,
    val monitoredId: String,
    val relationship: String, // RelationshipType enum
    val level: String, // MonitoringLevel enum
    val scope: String, // MonitoringScope JSON
    
    // Consent
    val consentGivenAt: Long,
    val consentExpiresAt: Long?,
    val isActive: Boolean,
    val autoRenew: Boolean,
    
    // Conditions (JSON serialized)
    val conditions: String,
    val allowedContexts: String?,
    
    // Audit (JSON serialized)
    val accessLog: String,
    val lastAccessed: Long?
)

// Routes
@Entity(tableName = "routes")
data class RouteEntity(
    @PrimaryKey val id: String,
    val userId: String,
    val name: String,
    val waypoints: String, // JSON array of Waypoint
    val schedule: String, // JSON array of RouteSchedule
    val contacts: String, // JSON array of user IDs
    val isActive: Boolean,
    val lastUsed: Long?,
    val createdAt: Long
)

// What3Words Cache
@Entity(tableName = "what3words_cache")
data class What3WordsCacheEntity(
    @PrimaryKey val id: String,
    val latitude: Double,
    val longitude: Double,
    val words: String,
    val nearestPlace: String?,
    val country: String,
    val cachedAt: Long,
    val expiresAt: Long
)

// Weather Cache
@Entity(tableName = "weather_cache")
data class WeatherCacheEntity(
    @PrimaryKey val id: String,
    val latitude: Double,
    val longitude: Double,
    val temperature: Double,
    val condition: String,
    val description: String,
    val humidity: Int,
    val windSpeed: Double,
    val cachedAt: Long,
    val expiresAt: Long
)
```

---

## Ecosystem Integration Points

### 1. PigeeBack Integration
```kotlin
// PigeeBack uses Sonny for:
// - Driver-Rider safety exchange
// - Trip monitoring triggers
// - Emergency escalation
// - Mutual rating post-trip

interface PigeeBackSonnyBridge {
    suspend fun startPigeeBackTrip(
        rideId: String,
        driverId: String,
        riderId: String,
        route: Route
    ): Result<PigeeBackTripMonitoring>
    
    suspend fun exchangeRideDetails(
        rideId: String,
        driverPeer: MeshPeer,
        riderPeer: MeshPeer
    ): Result<ReciprocExchange>
    
    suspend fun monitorTrip(
        rideId: String
    ): Flow<TripMonitoringEvent>
}
```

### 2. Ekhaya Integration
```kotlin
// Ekhaya uses Sonny for:
// - Household member monitoring
// - Family check-ins
// - Visitor management
// - Property safety

interface EkhayaSonnyBridge {
    suspend fun monitorFamilyMember(
        memberId: String,
        monitoring: MonitoringRelationship
    ): Result<Unit>
    
    suspend fun setupVisitorMonitoring(
        visitorId: String,
        householdId: String,
        duration: Long
    ): Result<VisitorMonitoring>
}
```

### 3. SafetyHelp/HRHelp Integration
```kotlin
// SafetyHelp uses Sonny for:
// - Visitor check-in/out
// - OH&S compliance monitoring
// - Emergency evacuation tracking
// - Contractor safety

interface SafetyHelpSonnyBridge {
    suspend fun checkInVisitor(
        visitorId: String,
        siteId: String
    ): Result<VisitorSession>
    
    suspend fun trackEvacuation(
        siteId: String,
        emergencyId: String
    ): Flow<EvacuationStatus>
}
```

### 4. Flamea Sazi (Community/Church) Integration
```kotlin
// Flamea Sazi uses Sonny for:
// - Community announcements
// - Event notifications
// - Hymn sharing
// - Member communication

interface FlameaSaziSonnyBridge {
    suspend fun broadcastAnnouncement(
        communityId: String,
        announcement: SonnyMessage
    ): Result<BroadcastStats>
    
    suspend fun shareHymn(
        hymnId: String,
        recipientIds: List<String>
    ): Result<Unit>
}
```

### 5. Sazi Life Academy Integration
```kotlin
// Sazi Life Academy uses Sonny for:
// - Student safety monitoring
// - Assignment distribution (offline)
// - Parent-teacher communication
// - Dormitory check-ins

interface SaziAcademySonnyBridge {
    suspend fun monitorStudent(
        studentId: String,
        guardianId: String,
        schedule: StudentSchedule
    ): Result<StudentMonitoring>
    
    suspend fun distributeAssignment(
        assignmentId: String,
        classId: String
    ): Result<BroadcastStats>
}
```

---

## Implementation Roadmap

### Phase 1: Core Sonny Engine (Weeks 1-4)
**Goal:** Build foundational mesh networking + trigger system

**Deliverables:**
- [ ] Sonny Mesh Engine (Bluetooth LE + WiFi Direct)
- [ ] Basic messaging (text, location)
- [ ] Trigger Manager with simple triggers
- [ ] Consent Ledger core functionality
- [ ] Database schema v8.0 with new entities
- [ ] Basic UI for messaging and triggers

**Testing:**
- Peer discovery and connection
- Message send/receive (2 devices)
- Simple trigger (trip start/end)
- Consent request/response flow

---

### Phase 2: Reciprocal Safety Exchange (Weeks 5-7)
**Goal:** Implement mutual data storage and escalation

**Deliverables:**
- [ ] Reciprocal Safety Service
- [ ] Safety data package creation
- [ ] Escalation system (local + online)
- [ ] Emergency contact notification
- [ ] Trip monitoring UI
- [ ] Rating system integration

**Testing:**
- PigeeBack ride simulation
- Missed check-in escalation
- Reciprocal data exchange
- Emergency notification flow

---

### Phase 3: Gossip Routing & Postbox (Weeks 8-10)
**Goal:** Store-and-forward mesh messaging

**Deliverables:**
- [ ] Gossip Routing Engine
- [ ] Postbox message storage
- [ ] Multi-hop relay logic
- [ ] Community broadcast system
- [ ] Route-based delivery
- [ ] Internet bridge (optional)

**Testing:**
- Multi-hop message delivery
- Community announcement propagation
- Route-based auto-delivery
- Online/offline hybrid scenarios

---

### Phase 4: Enhanced Location (Weeks 11-12)
**Goal:** Integrate What3Words and Weather

**Deliverables:**
- [ ] What3Words Service integration (API: EE350714)
- [ ] Weather Service integration (API: 6a36a434a17e560f2eb5014b9dd056b8)
- [ ] Enhanced Location Component
- [ ] Location caching
- [ ] Offline/online mode indicator
- [ ] Feature availability education

**Testing:**
- What3Words address lookup
- Weather data retrieval
- Offline degradation (GPS only)
- Cache expiration handling

---

### Phase 5: Ecosystem Integration (Weeks 13-16)
**Goal:** Connect Sonny to all ecosystem apps

**Deliverables:**
- [ ] PigeeBack bridge implementation
- [ ] Ekhaya bridge implementation
- [ ] SafetyHelp bridge implementation
- [ ] Flamea Sazi bridge implementation
- [ ] Sazi Life Academy bridge implementation
- [ ] Cross-app testing suite

**Testing:**
- End-to-end PigeeBack trip with Sonny
- Household monitoring via Ekhaya
- Visitor check-in via SafetyHelp
- Community announcement via Flamea Sazi
- Student monitoring via Sazi Academy

---

### Phase 6: Web App Sync (Weeks 17-18)
**Goal:** Enable LifeSync web app as internet bridge

**Deliverables:**
- [ ] Web app Sonny message viewer
- [ ] Web-to-app sync service
- [ ] Smart TV browser support
- [ ] Desktop/laptop bridge functionality
- [ ] WebRTC mesh extension (optional)

**Testing:**
- Web app message sync
- Smart TV interface
- Desktop as internet bridge
- Multi-device consistency

---

### Phase 7: Trust Score Integration (Weeks 19-20)
**Goal:** Connect check-ins and ratings to trust scoring

**Deliverables:**
- [ ] Check-in reliability scoring
- [ ] Reciprocity tracking
- [ ] Rating system enhancement
- [ ] Trust score calculation update
- [ ] Trust tier progression

**Testing:**
- Trust score increases with successful check-ins
- Rating integration
- Reciprocity impact on trust
- Trust tier transitions

---

### Phase 8: Polish & Optimization (Weeks 21-24)
**Goal:** Production-ready performance and UX

**Deliverables:**
- [ ] Battery optimization
- [ ] Background service efficiency
- [ ] Mesh network optimization
- [ ] UI/UX refinements
- [ ] Onboarding flow
- [ ] Help/tutorial system
- [ ] Comprehensive testing
- [ ] Documentation

**Testing:**
- Battery drain testing
- Network stability testing
- Edge case handling
- User acceptance testing
- Performance benchmarking

---

## Success Metrics

### Technical Metrics
- [ ] Mesh connection success rate > 95%
- [ ] Message delivery rate > 98% (within 6 hops)
- [ ] Check-in accuracy > 99%
- [ ] Battery drain < 5% per hour (background)
- [ ] Peer discovery time < 5 seconds

### User Experience Metrics
- [ ] User completes safety exchange < 30 seconds
- [ ] Check-in completion < 10 seconds
- [ ] Emergency escalation < 60 seconds (local)
- [ ] Community message reach > 80% (24 hours)
- [ ] Trust score comprehension > 90%

### Safety Metrics
- [ ] Zero missed escalations
- [ ] 100% reciprocal data storage
- [ ] Emergency response time < 5 minutes
- [ ] Check-in compliance > 95%
- [ ] Consent revocation < 5 seconds

---

## Appendices

### A. API Keys & Configuration
```kotlin
// What3Words
const val WHAT3WORDS_API_KEY = "EE350714"

// OpenWeatherMap
const val OPENWEATHER_API_KEY = "6a36a434a17e560f2eb5014b9dd056b8"

// Google Maps (existing)
const val GOOGLE_MAPS_API_KEY = "[Your existing key]"
```

### B. Privacy & Security
- All mesh messages encrypted (Curve25519 + ChaCha20)
- Safety data encrypted at rest (AES-256-GCM)
- Consent ledger immutable (append-only)
- Trust score calculations transparent
- User data portability (export/import)

### C. Offline Limitations
**Offline Mode (Default):**
- ✓ Mesh messaging (Bluetooth/WiFi)
- ✓ Basic GPS location
- ✓ Safety triggers & check-ins
- ✓ Reciprocal exchanges
- ✓ Local escalation
- ✗ What3Words lookup
- ✗ Weather data
- ✗ Google Maps navigation
- ✗ Global messaging
- ✗ Cloud backup

**Full Online Mode:**
- ✓ All offline features
- ✓ What3Words precise location
- ✓ Real-time weather
- ✓ Google Maps integration
- ✓ Extended escalation
- ✓ Cloud sync

---

**Document Status:** DRAFT v3.0  
**Next Review:** After Sonny Android Specification  
**Stakeholders:** Development Team, Product, Security, UX
