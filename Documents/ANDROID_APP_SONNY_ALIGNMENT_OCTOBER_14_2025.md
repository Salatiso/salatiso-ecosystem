# Android App Sonny Network Alignment Guide
**Date:** October 14, 2025
**Web App Version:** v1.0.0 (Safety Triggers Complete)
**Deployment Status:** ✅ LIVE on Firebase
**Live URLs:**
- **Primary**: https://salatiso-lifecv.web.app
- **Test**: https://lifecv-d2724.web.app
**Purpose:** Complete implementation guide to align Android app with web app functionality

---

## 📊 Current Status

### Web App Features ✅ IMPLEMENTED & DEPLOYED
- ✅ **Safety Triggers System** (90% complete)
  - Full CRUD operations
  - 3 trigger types (Trip, Periodic, One-Time)
  - Check-in functionality
  - Emergency contact selection
  - Filtering and status management
- ✅ **Navigation Improvements**
  - Back to dashboard button
  - Sidebar navigation links
- ✅ **Production Build** (Ready for deployment)
- ✅ **Firebase Deployment** (Live and accessible)

### Android App Gap Analysis
**Current Implementation:** ~5% (Basic Sonny screens exist)
**Target Implementation:** 90% (Match web app Safety Triggers)
**Missing Features:** 85% of web functionality
**Priority:** HIGH - Align with deployed web version

---

## 🎯 Implementation Roadmap

### Phase 1: Safety Triggers System (Priority: HIGH)
**Estimated Time:** 6 hours
**Web Components to Replicate:**
- `TriggerForm.tsx` → `TriggerFormActivity.kt`
- `TriggerCard.tsx` → `TriggerCardView.kt`
- `TriggerList.tsx` → `TriggerListFragment.kt`

#### Data Models
```kotlin
enum class TriggerType {
    TRIP, PERIODIC, ONE_TIME
}

enum class TriggerStatus {
    SCHEDULED, ACTIVE, COMPLETED, INACTIVE
}

data class SafetyTrigger(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val type: TriggerType,
    val startDate: Date,
    val endDate: Date? = null,
    val checkInInterval: Int = 30, // minutes
    val emergencyContacts: List<String> = emptyList(),
    val reciprocalParty: String? = null, // for trips
    val isActive: Boolean = true,
    val lastCheckIn: Date? = null,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

data class CheckInRecord(
    val id: String = UUID.randomUUID().toString(),
    val triggerId: String,
    val timestamp: Date = Date(),
    val location: Location? = null,
    val isManual: Boolean = true,
    val notes: String? = null
)
```

#### UI Components Required

##### 1. TriggerListFragment
```kotlin
class TriggerListFragment : Fragment() {
    // Features needed:
    // - RecyclerView with TriggerCardView items
    // - Dual filtering (status + type)
    // - Filter chips with counts
    // - FAB for creating new triggers
    // - Empty state handling
    // - Swipe to delete
    // - Pull to refresh
}
```

##### 2. TriggerFormActivity
```kotlin
class TriggerFormActivity : AppCompatActivity() {
    // Features needed:
    // - Name input field
    // - Trigger type selector (Trip/Periodic/One-Time)
    // - Date/time pickers for start/end
    // - Check-in interval slider (5-60 min)
    // - Emergency contacts multi-select
    // - Reciprocal party selector (for trips)
    // - Active/inactive toggle
    // - Form validation
    // - Save/Cancel actions
}
```

##### 3. TriggerCardView
```kotlin
class TriggerCardView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : CardView(context, attrs, defStyleAttr) {
    // Features needed:
    // - Status badge with color coding
    // - Trigger name and type
    // - Timing information
    // - Emergency contacts count
    // - Action buttons (Edit/Delete/Toggle/Check-in)
    // - "Check-in needed" alert
    // - Last check-in timestamp
}
```

#### Firebase Integration
```kotlin
// Firestore Collections Structure
object FirebaseCollections {
    const val TRIGGERS = "triggers"
    const val CHECKINS = "checkins"
    const val EMERGENCY_CONTACTS = "emergency_contacts"
}

// Repository Pattern
class TriggerRepository(private val firestore: FirebaseFirestore) {
    fun getTriggers(userId: String): Flow<List<SafetyTrigger>>
    fun saveTrigger(userId: String, trigger: SafetyTrigger): Task<Void>
    fun deleteTrigger(userId: String, triggerId: String): Task<Void>
    fun recordCheckIn(triggerId: String, checkIn: CheckInRecord): Task<Void>
}
```

### Phase 2: Navigation Updates (Priority: MEDIUM)
**Estimated Time:** 2 hours

#### Navigation Menu Updates
```xml
<!-- res/menu/nav_menu.xml -->
<item
    android:id="@+id/nav_contacts"
    android:title="@string/nav_contacts"
    android:icon="@drawable/ic_contacts" />

<item
    android:id="@+id/nav_sonny"
    android:title="@string/nav_sonny"
    android:icon="@drawable/ic_wifi" />
```

#### Activity Navigation
```kotlin
// MainActivity.kt
private fun setupNavigation() {
    navController.addOnDestinationChangedListener { _, destination, _ ->
        when (destination.id) {
            R.id.nav_contacts -> openContacts()
            R.id.nav_sonny -> openSonnyNetwork()
        }
    }
}

private fun openContacts() {
    // Navigate to contacts screen
    findNavController(R.id.nav_host_fragment)
        .navigate(R.id.action_global_contactsFragment)
}

private fun openSonnyNetwork() {
    // Navigate to Sonny network
    findNavController(R.id.nav_host_fragment)
        .navigate(R.id.action_global_sonnyFragment)
}
```

### Phase 3: QR Safety Exchange (Priority: MEDIUM)
**Estimated Time:** 6 hours

#### Dependencies to Add
```gradle
dependencies {
    implementation 'com.github.yuriy-budiyev:code-scanner:2.3.2'
    implementation 'com.google.zxing:core:3.5.1'
    implementation 'androidx.camera:camera-camera2:1.3.0'
    implementation 'androidx.camera:camera-lifecycle:1.3.0'
    implementation 'androidx.camera:camera-view:1.3.0'
}
```

#### QR Exchange Flow
```kotlin
class QRSafetyExchangeActivity : AppCompatActivity() {
    // Features needed:
    // - QR code generation for current user safety data
    // - QR code scanning for other users
    // - Safety data exchange (triggers, contacts, trust scores)
    // - Trust verification dialog
    // - Exchange confirmation
    // - Real-time sync with Firebase
}
```

### Phase 4: Trust & Ratings System (Priority: MEDIUM)
**Estimated Time:** 4 hours

#### Rating Components
```kotlin
class TrustRatingDialog : DialogFragment() {
    // Features needed:
    // - Star rating input (1-5 stars)
    // - Comment field
    // - Rating categories (Reliability, Safety, Communication)
    // - Submit to Firebase
    // - Update trust scores
}

class TrustBadgeView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : AppCompatTextView(context, attrs, defStyleAttr) {
    // Features needed:
    // - Display trust tier (Bronze/Silver/Gold/Platinum)
    // - Color-coded badges
    // - Trust score display
}
```

### Phase 5: Enhanced Mesh Messaging (Priority: LOW)
**Estimated Time:** 6 hours

#### Message Types
```kotlin
enum class MessageType {
    TEXT, LOCATION, CHECK_IN, EMERGENCY, POSTBOX
}

data class MeshMessage(
    val id: String,
    val senderId: String,
    val receiverId: String,
    val type: MessageType,
    val content: String,
    val timestamp: Date,
    val deliveryStatus: DeliveryStatus,
    val hopCount: Int = 0,
    val isEmergency: Boolean = false
)
```

### Phase 6: Community Postbox (Priority: LOW)
**Estimated Time:** 6 hours

#### Postbox Features
```kotlin
class CommunityPostboxFragment : Fragment() {
    // Features needed:
    // - Broadcast message creation
    // - Hop count tracking
    // - Spread visualization
    // - Gossip routing indicators
    // - Community announcement filtering
}
```

---

## 🛠 Technical Specifications

### Android Version Requirements
- **Minimum SDK:** API 21 (Android 5.0)
- **Target SDK:** API 34 (Android 14)
- **Kotlin Version:** 1.9.0+

### Dependencies
```gradle
dependencies {
    // Firebase
    implementation 'com.google.firebase:firebase-firestore-ktx:24.9.1'
    implementation 'com.google.firebase:firebase-auth-ktx:22.3.0'

    // UI Components
    implementation 'com.google.android.material:material:1.10.0'
    implementation 'androidx.recyclerview:recyclerview:1.3.1'
    implementation 'androidx.cardview:cardview:1.0.0'

    // Date/Time Pickers
    implementation 'com.google.android.material:material:1.10.0'

    // QR Code
    implementation 'com.github.yuriy-budiyev:code-scanner:2.3.2'
    implementation 'com.google.zxing:core:3.5.1'

    // Camera
    implementation 'androidx.camera:camera-camera2:1.3.0'
    implementation 'androidx.camera:camera-lifecycle:1.3.0'
    implementation 'androidx.camera:camera-view:1.3.0'

    // Location
    implementation 'com.google.android.gms:play-services-location:21.0.1'

    // Architecture Components
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.7.0'
    implementation 'androidx.activity:activity-ktx:1.8.0'
    implementation 'androidx.fragment:fragment-ktx:1.6.1'
}
```

### Architecture Pattern
- **MVVM** with ViewModels and LiveData
- **Repository Pattern** for data access
- **Dependency Injection** with Hilt
- **Single Activity Architecture** with Navigation Component

---

## 🧪 Testing Live Web App

**Before implementing Android features, test the live web app:**

### Access URLs:
- **Live App**: https://salatiso-lifecv.web.app
- **Test App**: https://lifecv-d2724.web.app

### Test Safety Triggers:
1. Navigate to `/sonny` from sidebar
2. Click "Safety Triggers" tab
3. Create a Trip trigger with:
   - Name, dates, check-in interval
   - Emergency contacts selection
   - Reciprocal party (for trips)
4. Test filtering by status and type
5. Perform check-in on active triggers
6. Edit and delete triggers

### Test Navigation:
1. Use back-to-dashboard button
2. Access Contacts from sidebar
3. Verify responsive design on mobile

### Document Findings:
- Note any UI/UX patterns to replicate
- Identify data structures used
- Record user workflows for Android implementation

---

### Safety Triggers Testing
- [ ] Create Trip trigger with all fields
- [ ] Create Periodic trigger with schedule
- [ ] Create One-Time trigger
- [ ] Edit existing trigger
- [ ] Delete trigger with confirmation
- [ ] Toggle active/inactive status
- [ ] Perform manual check-in
- [ ] Test filtering by status and type
- [ ] Verify data persistence in Firebase
- [ ] Test offline functionality

### Navigation Testing
- [ ] Sidebar navigation to Contacts
- [ ] Sidebar navigation to Sonny Network
- [ ] Back navigation patterns
- [ ] Deep linking support

### Integration Testing
- [ ] Data sync between web and mobile
- [ ] Real-time updates
- [ ] Offline data handling
- [ ] Error handling and recovery

---

## 📊 Progress Tracking

### Weekly Milestones
- **Week 1:** Safety Triggers CRUD (6 hours)
- **Week 2:** QR Exchange + Navigation (8 hours)
- **Week 3:** Trust & Ratings (4 hours)
- **Week 4:** Enhanced Messaging (6 hours)
- **Week 5:** Community Postbox (6 hours)
- **Week 6:** Testing & Polish (4 hours)

### Success Metrics
- **Functional Parity:** 90% feature match with web app
- **Performance:** <2 second load times
- **Reliability:** 99% uptime
- **User Satisfaction:** 4.5+ star rating

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All features implemented and tested
- [ ] Firebase configuration updated
- [ ] ProGuard rules configured
- [ ] App signing configured
- [ ] Play Store listing prepared

### Post-deployment
- [ ] Beta testing with select users
- [ ] Crash reporting monitoring
- [ ] Performance monitoring
- [ ] User feedback collection

---

*Android Alignment Guide - October 14, 2025*