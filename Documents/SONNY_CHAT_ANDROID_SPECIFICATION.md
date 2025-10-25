# Sonny Chat - Standalone Android Application Specification
**Version:** 1.0.0  
**Last Updated:** October 13, 2025  
**Project:** Sonny Chat - Offline-First Safety Communications

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Technical Architecture](#technical-architecture)
4. [Core Features](#core-features)
5. [Minimal Feature Set](#minimal-feature-set)
6. [Database Schema](#database-schema)
7. [User Experience](#user-experience)
8. [Performance Requirements](#performance-requirements)
9. [Deployment Strategy](#deployment-strategy)

---

## Executive Summary

### What is Sonny Chat?

**Sonny Chat** is a lightweight, offline-first messaging and safety monitoring application designed for communities in areas with limited or no internet connectivity. Unlike traditional messaging apps that require constant internet access, Sonny operates primarily through **Bluetooth LE and Wi-Fi Direct mesh networking**, making it ideal for:

- **Rural and township communities** with intermittent connectivity
- **Low-end Android devices** (Android 8.0+, 1GB RAM minimum)
- **Safety-conscious users** who need reliable check-in systems
- **Community groups** sharing information without data costs

### Key Differentiators

1. **Offline-First by Design**
   - Bluetooth + WiFi mesh as primary communication
   - Internet only used when explicitly needed
   - All core features work without data/WiFi

2. **Trigger-Based Safety**
   - Automatic check-in reminders based on context
   - Escalating alerts to emergency contacts
   - Reciprocal monitoring for trips/visits

3. **Community Postbox**
   - Store-and-forward message routing
   - Announcements spread through community network
   - No central server required

4. **Trust & Consent**
   - Mutual ratings after interactions
   - Explicit consent for monitoring
   - Time-boxed, renewable permissions

5. **Ultra-Lightweight**
   - APK size < 15MB
   - Runs on 512MB RAM (optimized for 1GB+)
   - Battery-efficient background operation
   - Minimal storage footprint

---

## Product Vision

### Target Users

#### Primary Persona: Thandi (Township Resident)
- **Age:** 32
- **Location:** Soweto, South Africa
- **Device:** Samsung Galaxy A03 (Android 11, 3GB RAM)
- **Connectivity:** Prepaid data, 500MB/month
- **Needs:**
  - Check in with family when traveling
  - Receive community announcements
  - Monitor children's school trips
  - Emergency communication without airtime

#### Secondary Persona: Sipho (Rural Community Member)
- **Age:** 45
- **Location:** Eastern Cape village
- **Device:** Nokia G10 (Android 11, 3GB RAM)
- **Connectivity:** Intermittent 2G/3G
- **Needs:**
  - Coordinate with farmers' co-op
  - Emergency alerts during power outages
  - Family check-ins during load shedding
  - Church/community announcements

#### Tertiary Persona: Zanele (Student)
- **Age:** 18
- **Location:** University residence, Durban
- **Device:** Huawei Y6 (Android 10, 2GB RAM)
- **Connectivity:** Campus WiFi only
- **Needs:**
  - Safety check-ins when going out
  - Parent monitoring (with consent)
  - Friends location sharing
  - Study group coordination

### Use Cases

#### 1. Daily Commute Safety
```
Thandi takes a minibus taxi to work every day. She:
1. Sets up a "Morning Commute" trigger (6:30 AM - 7:30 AM)
2. Exchanges safety info with driver via QR scan
3. Gets auto check-in reminders every 15 minutes
4. Family gets alert if she doesn't confirm arrival
5. Rates driver at end of trip
```

#### 2. Child School Trip
```
Thandi's son takes the school bus. She:
1. Sets up "School Run" trigger (7:00 AM - 8:00 AM)
2. Monitors his location via mesh network
3. Receives auto notification when he arrives
4. Can see driver's trust score and ratings
5. Gets emergency alert if bus is delayed
```

#### 3. Community Announcement
```
Church pastor needs to share meeting update. He:
1. Creates community announcement in Sonny
2. Message spreads through mesh as people walk past church
3. Members receive it when in range of other members
4. No data costs, reaches 80% of congregation in 24 hours
5. Can optionally bridge online for remote members
```

#### 4. Rural Emergency
```
Sipho has a medical emergency during load shedding. He:
1. Activates emergency mode in Sonny
2. Alert spreads via mesh to nearby neighbors
3. Neighbor with car receives location
4. If no response in 5 minutes, alert goes online
5. Emergency services notified with GPS location
```

---

## Technical Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SONNY CHAT APP                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │                  UI LAYER (Compose)                │ │
│  │  • Chat • Triggers • Contacts • Settings           │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↓                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │               BUSINESS LOGIC LAYER                 │ │
│  │  • ChatService • TriggerManager • SafetyService    │ │
│  │  • ConsentManager • RatingService                  │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↓                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │                 DATA LAYER                         │ │
│  │  ┌──────────────┐  ┌──────────────┐               │ │
│  │  │ Room DB      │  │ Mesh Engine  │               │ │
│  │  │ (Offline)    │  │ (BLE/WiFi)   │               │ │
│  │  └──────────────┘  └──────────────┘               │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↓                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │            OPTIONAL: LIFESYNC BRIDGE               │ │
│  │  • Import LifeCV profile                           │ │
│  │  • Sync with LifeSync master app                   │ │
│  │  • Online fallback via Firebase                    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Core Framework
- **Language:** Kotlin 1.9+
- **Min SDK:** API 26 (Android 8.0)
- **Target SDK:** API 34 (Android 14)
- **UI:** Jetpack Compose (minimal subset)
- **Architecture:** MVVM + Clean Architecture

#### Key Libraries (Minimal Set)
```gradle
dependencies {
    // Core Android
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
    
    // Compose (minimal)
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    
    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.5")
    
    // Room (lightweight config)
    implementation("androidx.room:room-runtime:2.6.0")
    implementation("androidx.room:room-ktx:2.6.0")
    ksp("androidx.room:room-compiler:2.6.0")
    
    // Bluetooth/WiFi
    implementation("com.google.android.gms:play-services-nearby:19.0.0")
    
    // Location (optional, for GPS-based triggers)
    implementation("com.google.android.gms:play-services-location:21.0.1")
    
    // Encryption
    implementation("androidx.security:security-crypto:1.1.0-alpha06")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // Optional: Firebase (only for online bridge)
    implementation(platform("com.google.firebase:firebase-bom:32.7.0"))
    implementation("com.google.firebase:firebase-database-ktx")
    implementation("com.google.firebase:firebase-storage-ktx")
    
    // QR Code
    implementation("com.google.zxing:core:3.5.2")
}
```

### APK Size Target
- **Base APK:** < 10MB
- **With Firebase:** < 15MB
- **Installed Size:** < 40MB

---

## Core Features

### 1. Mesh Messaging

#### Architecture
```kotlin
@Singleton
class MeshMessagingService @Inject constructor(
    private val nearbyConnections: ConnectionsClient,
    private val database: SonnyDatabase,
    private val encryptionService: EncryptionService
) {
    // Peer discovery
    suspend fun startDiscovery(): Flow<Peer>
    suspend fun stopDiscovery()
    
    // Messaging
    suspend fun sendMessage(message: Message): Result<Unit>
    suspend fun receiveMessages(): Flow<Message>
    
    // Routing
    suspend fun forwardMessage(message: Message, nextHop: Peer): Result<Unit>
    suspend fun storeForForwarding(message: Message): Result<Unit>
    
    // Range monitoring
    fun monitorPeerRange(): Flow<PeerRangeEvent>
}

data class Message(
    val id: String,
    val senderId: String,
    val recipientId: String?, // null = broadcast
    val type: MessageType,
    val content: String, // Encrypted
    val timestamp: Long,
    val isPostbox: Boolean = false,
    val hopCount: Int = 0,
    val maxHops: Int = 6
)

enum class MessageType {
    TEXT, LOCATION, CHECK_IN, EMERGENCY
}
```

#### UI Components
```kotlin
@Composable
fun ChatScreen(
    viewModel: ChatViewModel
) {
    val messages by viewModel.messages.collectAsState()
    val peers by viewModel.activePeers.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Sonny Chat") },
                actions = {
                    // Connection indicator
                    Icon(
                        imageVector = if (peers.isNotEmpty()) 
                            Icons.Default.Bluetooth 
                            else Icons.Default.BluetoothDisabled,
                        contentDescription = "${peers.size} peers"
                    )
                    Text("${peers.size}")
                }
            )
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding)) {
            // Messages list
            LazyColumn(
                modifier = Modifier.weight(1f),
                reverseLayout = true
            ) {
                items(messages) { message ->
                    MessageBubble(message)
                }
            }
            
            // Input field
            MessageInput(
                onSend = { text ->
                    viewModel.sendMessage(text)
                }
            )
        }
    }
}
```

---

### 2. Safety Triggers

#### Trigger Types (Simplified)
```kotlin
enum class TriggerType {
    TRIP,           // Start → End with interval check-ins
    PERIODIC,       // Daily/weekly schedule (school, work)
    ONE_TIME        // Single event (visit, appointment)
}

data class SimpleTrigger(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val type: TriggerType,
    
    // Timing
    val startTime: Long,
    val endTime: Long,
    val checkInInterval: Long, // Milliseconds
    
    // Contacts
    val emergencyContacts: List<String>,
    val reciprocalParty: String?, // For trips
    
    // Status
    val isActive: Boolean = true,
    val lastCheckIn: Long? = null
)

@Singleton
class SimpleTriggerManager @Inject constructor(
    private val alarmManager: AlarmManager,
    private val notificationManager: NotificationManager
) {
    suspend fun createTrigger(trigger: SimpleTrigger): Result<String>
    suspend fun checkIn(triggerId: String): Result<Unit>
    suspend fun cancel(triggerId: String): Result<Unit>
    
    // Monitor triggers
    fun monitorActiveTriggers(): Flow<TriggerEvent>
}

sealed class TriggerEvent {
    data class CheckInRequired(val triggerId: String) : TriggerEvent()
    data class CheckInMissed(val triggerId: String) : TriggerEvent()
    data class TriggerCompleted(val triggerId: String) : TriggerEvent()
}
```

#### UI: Create Trigger
```kotlin
@Composable
fun CreateTriggerScreen(
    onTriggerCreated: (SimpleTrigger) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var type by remember { mutableStateOf(TriggerType.TRIP) }
    var startTime by remember { mutableStateOf<Long?>(null) }
    var endTime by remember { mutableStateOf<Long?>(null) }
    var interval by remember { mutableStateOf(15) } // Minutes
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Create Safety Trigger",
            style = MaterialTheme.typography.headlineMedium
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Name
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Name") },
            placeholder = { Text("Morning Commute") },
            modifier = Modifier.fillMaxWidth()
        )
        
        // Type selector
        Text("Type", style = MaterialTheme.typography.labelLarge)
        Row {
            FilterChip(
                selected = type == TriggerType.TRIP,
                onClick = { type = TriggerType.TRIP },
                label = { Text("Trip") }
            )
            Spacer(modifier = Modifier.width(8.dp))
            FilterChip(
                selected = type == TriggerType.PERIODIC,
                onClick = { type = TriggerType.PERIODIC },
                label = { Text("Periodic") }
            )
            Spacer(modifier = Modifier.width(8.dp))
            FilterChip(
                selected = type == TriggerType.ONE_TIME,
                onClick = { type = TriggerType.ONE_TIME },
                label = { Text("One Time") }
            )
        }
        
        // Time pickers
        TimePickerField(
            label = "Start Time",
            value = startTime,
            onValueChange = { startTime = it }
        )
        
        TimePickerField(
            label = "End Time",
            value = endTime,
            onValueChange = { endTime = it }
        )
        
        // Check-in interval
        Text("Check-in every:")
        Slider(
            value = interval.toFloat(),
            onValueChange = { interval = it.toInt() },
            valueRange = 5f..60f,
            steps = 11
        )
        Text("$interval minutes")
        
        // Emergency contacts
        Text("Emergency Contacts", style = MaterialTheme.typography.labelLarge)
        // (Contact picker UI)
        
        // Create button
        Button(
            onClick = {
                val trigger = SimpleTrigger(
                    name = name,
                    type = type,
                    startTime = startTime!!,
                    endTime = endTime!!,
                    checkInInterval = interval * 60 * 1000L,
                    emergencyContacts = emptyList() // Get from picker
                )
                onTriggerCreated(trigger)
            },
            enabled = name.isNotBlank() && startTime != null && endTime != null,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Create Trigger")
        }
    }
}
```

---

### 3. Reciprocal Safety Exchange

#### QR Code Exchange
```kotlin
@Composable
fun SafetyExchangeScreen(
    viewModel: SafetyExchangeViewModel
) {
    val mode by viewModel.mode.collectAsState()
    
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Safety Exchange",
            style = MaterialTheme.typography.headlineMedium
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Mode selector
        Row {
            Button(
                onClick = { viewModel.setMode(ExchangeMode.SHOW_QR) }
            ) {
                Text("Show My QR")
            }
            Spacer(modifier = Modifier.width(16.dp))
            Button(
                onClick = { viewModel.setMode(ExchangeMode.SCAN_QR) }
            ) {
                Text("Scan QR")
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        when (mode) {
            ExchangeMode.SHOW_QR -> {
                // Generate and display QR code
                val qrData by viewModel.qrData.collectAsState()
                QRCodeImage(data = qrData)
                
                Text(
                    text = "Ask the other person to scan this code",
                    style = MaterialTheme.typography.bodyMedium
                )
            }
            
            ExchangeMode.SCAN_QR -> {
                // Camera preview for scanning
                QRScannerView(
                    onQRScanned = { data ->
                        viewModel.processScannedQR(data)
                    }
                )
            }
            
            ExchangeMode.EXCHANGING -> {
                CircularProgressIndicator()
                Text("Exchanging safety information...")
            }
            
            ExchangeMode.COMPLETE -> {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Success",
                    tint = Color.Green,
                    modifier = Modifier.size(64.dp)
                )
                Text("Safety exchange complete!")
                
                // Show exchanged data
                val otherParty by viewModel.otherPartyData.collectAsState()
                otherParty?.let { party ->
                    SafetyDataCard(data = party)
                }
            }
        }
    }
}

data class SafetyData(
    val userId: String,
    val name: String,
    val photoUrl: String?,
    val phone: String,
    val emergencyContact: String,
    val trustScore: Int,
    val recentRatings: List<Rating>
)
```

---

### 4. Trust & Ratings

#### Simple Trust Score
```kotlin
data class TrustScore(
    val userId: String,
    val score: Int, // 0-100
    val tier: TrustTier,
    val checkInReliability: Float, // 0.0-1.0
    val averageRating: Float, // 0.0-5.0
    val totalInteractions: Int,
    val lastUpdated: Long
)

enum class TrustTier {
    NEW,        // 0-20: New user
    BRONZE,     // 21-40: Some history
    SILVER,     // 41-60: Regular user
    GOLD,       // 61-80: Reliable user
    PLATINUM    // 81-100: Highly trusted
}

@Singleton
class TrustService @Inject constructor(
    private val database: SonnyDatabase
) {
    suspend fun calculateTrustScore(userId: String): TrustScore
    suspend fun updateAfterCheckIn(userId: String, onTime: Boolean)
    suspend fun updateAfterRating(userId: String, rating: Rating)
    suspend fun getTrustScore(userId: String): TrustScore?
}

// Simple rating
data class Rating(
    val id: String = UUID.randomUUID().toString(),
    val fromUserId: String,
    val toUserId: String,
    val stars: Int, // 1-5
    val comment: String?,
    val context: String, // "trip", "visit", etc.
    val timestamp: Long
)

@Composable
fun RatingDialog(
    otherUserName: String,
    onRate: (Int, String?) -> Unit,
    onDismiss: () -> Unit
) {
    var stars by remember { mutableStateOf(5) }
    var comment by remember { mutableStateOf("") }
    
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Rate $otherUserName") },
        text = {
            Column {
                Text("How was your experience?")
                Spacer(modifier = Modifier.height(16.dp))
                
                // Star rating
                Row(
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    repeat(5) { index ->
                        IconButton(
                            onClick = { stars = index + 1 }
                        ) {
                            Icon(
                                imageVector = if (index < stars) 
                                    Icons.Default.Star 
                                    else Icons.Default.StarBorder,
                                contentDescription = "${index + 1} stars",
                                tint = if (index < stars) 
                                    Color(0xFFFFD700) 
                                    else Color.Gray
                            )
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Optional comment
                OutlinedTextField(
                    value = comment,
                    onValueChange = { comment = it },
                    label = { Text("Comment (optional)") },
                    modifier = Modifier.fillMaxWidth(),
                    maxLines = 3
                )
            }
        },
        confirmButton = {
            TextButton(onClick = { onRate(stars, comment.ifBlank { null }) }) {
                Text("Submit")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
```

---

## Minimal Feature Set

### Phase 1: MVP (Weeks 1-8)

#### Must Have
- [x] Basic mesh messaging (text only)
- [x] Contact list (phone contacts)
- [x] Simple triggers (trip start/end)
- [x] Check-in notifications
- [x] QR code safety exchange
- [x] Basic trust score display
- [x] Emergency alert

#### Should Have
- [ ] Location sharing
- [ ] Message delivery status
- [ ] Profile photos
- [ ] Rating system
- [ ] Consent management

#### Nice to Have
- [ ] Group chats
- [ ] Voice messages
- [ ] Image sharing
- [ ] Route planning
- [ ] Weather integration

### Phase 2: Enhancement (Weeks 9-16)

#### Must Have
- [x] Gossip routing (postbox)
- [x] Community broadcasts
- [x] Periodic triggers
- [x] Trust score calculation
- [x] Rating after interactions

#### Should Have
- [ ] LifeSync integration
- [ ] Firebase online bridge
- [ ] Export/import data
- [ ] Multi-language support

#### Nice to Have
- [ ] What3Words integration
- [ ] Advanced analytics
- [ ] Customizable themes

---

## Database Schema

### Simplified Schema for Sonny

```kotlin
@Database(
    entities = [
        UserProfile::class,
        Contact::class,
        Message::class,
        Trigger::class,
        CheckIn::class,
        SafetyExchange::class,
        Rating::class,
        TrustScore::class
    ],
    version = 1
)
abstract class SonnyDatabase : RoomDatabase() {
    abstract fun userProfileDao(): UserProfileDao
    abstract fun contactDao(): ContactDao
    abstract fun messageDao(): MessageDao
    abstract fun triggerDao(): TriggerDao
    abstract fun checkInDao(): CheckInDao
    abstract fun safetyExchangeDao(): SafetyExchangeDao
    abstract fun ratingDao(): RatingDao
    abstract fun trustScoreDao(): TrustScoreDao
}

// Core entities
@Entity(tableName = "user_profile")
data class UserProfile(
    @PrimaryKey val id: String,
    val name: String,
    val phone: String,
    val emergencyContact: String,
    val photoUrl: String?,
    val createdAt: Long
)

@Entity(tableName = "contacts")
data class Contact(
    @PrimaryKey val id: String,
    val name: String,
    val phone: String,
    val isFavorite: Boolean = false,
    val trustScore: Int? = null
)

@Entity(tableName = "messages")
data class Message(
    @PrimaryKey val id: String,
    val senderId: String,
    val recipientId: String?,
    val content: String,
    val timestamp: Long,
    val isRead: Boolean = false,
    val deliveryStatus: String, // sent, delivered, read
    val isPostbox: Boolean = false,
    val hopCount: Int = 0
)

@Entity(tableName = "triggers")
data class Trigger(
    @PrimaryKey val id: String,
    val name: String,
    val type: String,
    val startTime: Long,
    val endTime: Long,
    val checkInInterval: Long,
    val emergencyContacts: String, // JSON array
    val reciprocalParty: String?,
    val isActive: Boolean,
    val lastCheckIn: Long?
)

@Entity(tableName = "check_ins")
data class CheckIn(
    @PrimaryKey val id: String,
    val triggerId: String,
    val timestamp: Long,
    val latitude: Double?,
    val longitude: Double?,
    val onTime: Boolean
)

@Entity(tableName = "safety_exchanges")
data class SafetyExchange(
    @PrimaryKey val id: String,
    val myUserId: String,
    val theirUserId: String,
    val theirData: String, // JSON SafetyData
    val timestamp: Long,
    val contextId: String?
)

@Entity(tableName = "ratings")
data class Rating(
    @PrimaryKey val id: String,
    val fromUserId: String,
    val toUserId: String,
    val stars: Int,
    val comment: String?,
    val context: String,
    val timestamp: Long
)

@Entity(tableName = "trust_scores")
data class TrustScore(
    @PrimaryKey val userId: String,
    val score: Int,
    val tier: String,
    val checkInReliability: Float,
    val averageRating: Float,
    val totalInteractions: Int,
    val lastUpdated: Long
)
```

---

## User Experience

### Onboarding Flow

```kotlin
@Composable
fun OnboardingFlow(
    onComplete: () -> Unit
) {
    val pages = listOf(
        OnboardingPage(
            title = "Welcome to Sonny",
            description = "Stay safe and connected, even without internet",
            image = R.drawable.onboarding_1
        ),
        OnboardingPage(
            title = "Offline-First Messaging",
            description = "Chat with nearby people using Bluetooth and WiFi",
            image = R.drawable.onboarding_2
        ),
        OnboardingPage(
            title = "Safety Triggers",
            description = "Automatic check-ins when traveling or visiting",
            image = R.drawable.onboarding_3
        ),
        OnboardingPage(
            title = "Community Postbox",
            description = "Share announcements that spread through your community",
            image = R.drawable.onboarding_4
        )
    )
    
    // Standard HorizontalPager with pages
    // ...
}
```

### Main Navigation

```kotlin
@Composable
fun SonnyMainScreen() {
    var selectedTab by remember { mutableStateOf(SonnyTab.CHAT) }
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = selectedTab == SonnyTab.CHAT,
                    onClick = { selectedTab = SonnyTab.CHAT },
                    icon = { Icon(Icons.Default.Chat, "Chat") },
                    label = { Text("Chat") }
                )
                NavigationBarItem(
                    selected = selectedTab == SonnyTab.TRIGGERS,
                    onClick = { selectedTab = SonnyTab.TRIGGERS },
                    icon = { Icon(Icons.Default.Alarm, "Triggers") },
                    label = { Text("Safety") }
                )
                NavigationBarItem(
                    selected = selectedTab == SonnyTab.CONTACTS,
                    onClick = { selectedTab = SonnyTab.CONTACTS },
                    icon = { Icon(Icons.Default.People, "Contacts") },
                    label = { Text("Contacts") }
                )
                NavigationBarItem(
                    selected = selectedTab == SonnyTab.SETTINGS,
                    onClick = { selectedTab = SonnyTab.SETTINGS },
                    icon = { Icon(Icons.Default.Settings, "Settings") },
                    label = { Text("Settings") }
                )
            }
        }
    ) { padding ->
        when (selectedTab) {
            SonnyTab.CHAT -> ChatListScreen()
            SonnyTab.TRIGGERS -> TriggersScreen()
            SonnyTab.CONTACTS -> ContactsScreen()
            SonnyTab.SETTINGS -> SettingsScreen()
        }
    }
}
```

---

## Performance Requirements

### Target Metrics

#### Device Compatibility
- **Minimum:** Android 8.0 (API 26), 512MB RAM
- **Recommended:** Android 9.0 (API 28), 1GB RAM
- **Optimal:** Android 11+ (API 30), 2GB+ RAM

#### Performance Targets
- **App startup:** < 2 seconds (cold start)
- **Message send:** < 500ms (peer in range)
- **Mesh discovery:** < 5 seconds
- **Database query:** < 100ms (average)
- **Battery drain:** < 3% per hour (background)

#### Storage
- **APK size:** < 15MB
- **Installed size:** < 40MB
- **Database size:** < 50MB (1000 messages)
- **Cache:** < 20MB

#### Network (Mesh)
- **Peer range:** Up to 100m (Bluetooth LE)
- **Max peers:** 8 simultaneous connections
- **Message throughput:** 10 KB/s per peer
- **Hop delay:** < 1 second per hop

---

## Deployment Strategy

### Release Channels

#### 1. Internal Testing (Alpha)
- **Audience:** Development team (5-10 users)
- **Duration:** 2 weeks
- **Focus:** Core functionality, crash-free rate

#### 2. Closed Beta
- **Audience:** Township community group (50 users)
- **Duration:** 4 weeks
- **Focus:** Real-world usage, mesh reliability

#### 3. Open Beta
- **Audience:** Public (500 users)
- **Duration:** 8 weeks
- **Focus:** Scalability, diverse devices

#### 4. Production Release
- **Audience:** Google Play Store (public)
- **Channels:** 
  - Standard (main release)
  - Lite (< 10MB, minimal features)

### Distribution

#### Google Play Store
```
App Name: Sonny Chat
Package: com.salatiso.sonnychat
Category: Communication
Content Rating: Everyone
Price: Free
In-App Purchases: None
Permissions:
  - Bluetooth (required)
  - Location (required for safety features)
  - Camera (optional for QR scanning)
  - Contacts (optional)
  - Notifications (required)
```

#### Alternative Distribution
- **APK Direct Download** (for communities without Play Store access)
- **Samsung Galaxy Store**
- **Huawei AppGallery**
- **F-Droid** (open-source build)

### Localization

#### Launch Languages
- English
- Zulu (isiZulu)
- Xhosa (isiXhosa)
- Afrikaans
- Sesotho

#### Phase 2 Languages
- Swahili
- Shona
- Portuguese (Mozambique)
- French (West Africa)

---

## Appendices

### A. Permissions Justification

| Permission | Why Needed | User Benefit |
|------------|------------|--------------|
| Bluetooth | Mesh networking core functionality | Offline messaging |
| Location | Safety triggers, check-ins | Automatic arrival confirmation |
| Camera | QR code scanning | Quick safety exchange |
| Contacts | Find friends already using Sonny | Easy onboarding |
| Notifications | Check-in reminders, emergency alerts | Never miss safety check-ins |

### B. Privacy Policy Summary

- **No data leaves device** unless user explicitly chooses online mode
- **Encrypted messages** (end-to-end, Curve25519)
- **No tracking** or analytics in offline mode
- **User controls all data** (export/delete anytime)
- **Consent required** for all monitoring relationships

### C. Comparison with LifeSync

| Feature | Sonny Chat | LifeSync |
|---------|------------|----------|
| **Size** | < 15MB | ~50MB |
| **Focus** | Safety messaging | Full ecosystem hub |
| **Mesh** | Core feature | Optional |
| **LifeCV** | View only | Full management |
| **Triggers** | Simplified | Advanced |
| **Ecosystem Apps** | Not included | PigeeBack, Ekhaya, etc. |
| **Target Devices** | Low-end | Mid-to-high end |

### D. Migration Path

Users can start with **Sonny Chat** and later:
1. Import Sonny data into **LifeSync** (one-click)
2. Upgrade to full ecosystem features
3. Keep using Sonny alongside LifeSync (they sync)

---

**Document Status:** DRAFT v1.0  
**Next Steps:** 
1. Review with UX team
2. Technical feasibility assessment
3. Community user testing
4. Development kickoff

**Stakeholders:** Product, Engineering, UX, Community Outreach

