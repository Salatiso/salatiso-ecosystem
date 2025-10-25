# LifeSync Web Application - Sonny Integration Upgrade Specification
**Version:** 2.0.0  
**Last Updated:** October 13, 2025  
**Project:** LifeSync Web + Sonny Bridge

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Web as Internet Bridge](#web-as-internet-bridge)
3. [Smart TV & Large Screen Support](#smart-tv-support)
4. [Technical Architecture](#technical-architecture)
5. [Core Features](#core-features)
6. [Implementation Plan](#implementation-plan)

---

## Executive Summary

### Vision

The **LifeSync Web Application** transforms from a simple companion app into a critical **Internet Bridge** for the Sonny ecosystem. Users with laptops, desktops, or **Smart TVs with browsers** can:

1. **Bridge offline mesh to online world**
   - Acts as gateway for mesh messages to reach internet
   - Syncs household data when devices connect
   - Enables extended family monitoring from anywhere

2. **Monitor family safety from home**
   - View real-time check-ins on large screen
   - Track children's commutes
   - Receive emergency alerts prominently

3. **Community coordination hub**
   - Display community postbox messages
   - Share announcements to mesh network
   - Household dashboard for multiple members

4. **Extended functionality**
   - What3Words location lookup
   - Weather overlay on maps
   - LifeCV profile management
   - Bulk message composition

### Key Use Cases

#### 1. Smart TV as Family Safety Hub
```
Scenario: Thandi's household
- Smart TV in living room displays LifeSync web app
- Shows real-time location of all household members
- Alerts appear when children don't check in
- Can send messages from TV (via remote/keyboard)
- Acts as internet bridge for neighborhood mesh
```

#### 2. Desktop/Laptop as Work Station
```
Scenario: Community leader at home
- Uses laptop to manage community announcements
- Composes messages with full keyboard
- Reviews trust scores and ratings
- Exports reports for community meetings
- Bridges messages from laptop to mobile mesh
```

#### 3. Internet Cafe Bridge
```
Scenario: Shared computer in township
- Multiple users log in to check messages
- Download profile data for offline use
- Upload mesh messages collected during week
- Acts as neighborhood internet gateway
```

---

## Web as Internet Bridge

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│              INTERNET (CLOUD)                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Firebase (Realtime DB + Storage)           │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌───────────────┐
│  WEB APP      │         │ ANDROID APP   │
│  (Bridge Mode)│◄────────┤ (Mesh Leader) │
│               │  WiFi   │               │
│  • Desktop    │  Sync   │ • Has Mesh    │
│  • Laptop     │         │ • No Internet │
│  • Smart TV   │         │ • Full DB     │
└───────────────┘         └───────────────┘
        │                         │
        │                         │
        ▼                         ▼
    [Internet]            [Bluetooth Mesh]
        │                         │
        │                         ▼
        │                 ┌───────────────┐
        │                 │  Mesh Peers   │
        │                 │  (Offline)    │
        │                 └───────────────┘
        │                         │
        │  (Bridge syncs mesh     │
        └─  data to internet)  ───┘
```

### Bridge Modes

#### 1. Direct Bridge (User's Web App)
```
User has both:
- Android phone with mesh connectivity (offline)
- Laptop/TV with internet

Flow:
1. Phone collects messages via mesh
2. Phone connects to home WiFi
3. Web app detects phone on same network
4. Syncs mesh data from phone
5. Uploads to Firebase cloud
6. Extended family can now see data online
```

#### 2. Indirect Bridge (Shared Device)
```
Community member has:
- Android phone with mesh (no internet)
- Access to shared computer at internet cafe

Flow:
1. User logs into web app at cafe
2. Phone connects via USB/Bluetooth to computer
3. Web app pulls data from phone
4. Uploads to cloud
5. Downloads messages from cloud for phone
6. Phone syncs back to mesh when in range
```

#### 3. Smart TV Hub
```
Household setup:
- Smart TV with browser (has WiFi)
- Multiple family member phones (mesh only)

Flow:
1. TV displays family dashboard 24/7
2. Family members' phones sync when home
3. TV shows real-time check-ins
4. TV can send messages to phones
5. TV acts as household internet gateway
```

---

## Smart TV & Large Screen Support

### UI Adaptation

#### Responsive Breakpoints
```css
/* Mobile-first, then scale up */
@media (min-width: 768px) {
  /* Tablet layout */
}

@media (min-width: 1024px) {
  /* Desktop layout */
}

@media (min-width: 1920px) {
  /* Full HD TV */
  font-size: 1.5rem; /* Larger text for TV viewing */
}

@media (min-width: 3840px) {
  /* 4K TV */
  font-size: 2rem;
}
```

#### TV-Optimized Components

```typescript
// Dashboard for large screens
export function FamilyDashboard() {
  const householdMembers = useHouseholdMembers();
  const checkIns = useRecentCheckIns();
  
  return (
    <div className="grid grid-cols-3 gap-8 p-12 h-screen">
      {/* Left: Family member status */}
      <div className="col-span-1 space-y-4">
        <h2 className="text-4xl font-bold">Family Status</h2>
        {householdMembers.map(member => (
          <MemberStatusCard 
            key={member.id}
            member={member}
            large={true}
          />
        ))}
      </div>
      
      {/* Center: Map with locations */}
      <div className="col-span-1">
        <h2 className="text-4xl font-bold mb-4">Live Locations</h2>
        <MapView 
          members={householdMembers}
          height="80vh"
        />
      </div>
      
      {/* Right: Recent check-ins & alerts */}
      <div className="col-span-1 space-y-4">
        <h2 className="text-4xl font-bold">Recent Activity</h2>
        <CheckInTimeline checkIns={checkIns} />
        
        <h2 className="text-4xl font-bold mt-8">Alerts</h2>
        <AlertsList />
      </div>
    </div>
  );
}

// Large member status card
export function MemberStatusCard({ member, large = false }) {
  const textSize = large ? 'text-3xl' : 'text-base';
  const iconSize = large ? 'w-16 h-16' : 'w-8 h-8';
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <img 
          src={member.photoUrl} 
          alt={member.name}
          className={`${iconSize} rounded-full`}
        />
        <div>
          <h3 className={`${textSize} font-bold`}>
            {member.name}
          </h3>
          <p className="text-xl text-gray-600">
            {member.currentStatus}
          </p>
        </div>
      </div>
      
      {/* Status indicators */}
      <div className="mt-4 space-y-2">
        <StatusBadge 
          label="Last Check-in"
          value={formatRelativeTime(member.lastCheckIn)}
          color={getCheckInColor(member.lastCheckIn)}
          large={large}
        />
        <StatusBadge 
          label="Location"
          value={member.lastKnownLocation?.what3words || 'Unknown'}
          color="blue"
          large={large}
        />
      </div>
    </div>
  );
}
```

### TV Remote Navigation

```typescript
// Support TV remote d-pad navigation
export function useTVNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          // Navigate focus between elements
          navigateFocus(e.key);
          e.preventDefault();
          break;
        case 'Enter':
          // Activate focused element
          activateFocused();
          e.preventDefault();
          break;
        case 'Escape':
          // Back/Exit
          goBack();
          e.preventDefault();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Focus management
function navigateFocus(direction: string) {
  const focusableElements = document.querySelectorAll(
    '[data-focusable="true"]'
  );
  const currentIndex = Array.from(focusableElements)
    .findIndex(el => el === document.activeElement);
  
  let nextIndex = currentIndex;
  
  if (direction === 'ArrowUp') nextIndex--;
  else if (direction === 'ArrowDown') nextIndex++;
  else if (direction === 'ArrowLeft') nextIndex--;
  else if (direction === 'ArrowRight') nextIndex++;
  
  // Wrap around
  if (nextIndex < 0) nextIndex = focusableElements.length - 1;
  if (nextIndex >= focusableElements.length) nextIndex = 0;
  
  (focusableElements[nextIndex] as HTMLElement).focus();
}
```

---

## Technical Architecture

### Technology Stack

#### Frontend
```json
{
  "framework": "Next.js 14",
  "language": "TypeScript 5.2",
  "ui": "Tailwind CSS + shadcn/ui",
  "state": "Zustand",
  "forms": "React Hook Form + Zod",
  "maps": "Google Maps JavaScript API",
  "charts": "Recharts",
  "icons": "Lucide React"
}
```

#### Backend/Services
```json
{
  "auth": "Firebase Auth",
  "database": "Firebase Realtime Database",
  "storage": "Firebase Storage",
  "hosting": "Vercel",
  "apis": [
    "What3Words API (EE350714)",
    "OpenWeather API (6a36a434a17e560f2eb5014b9dd056b8)",
    "Google Maps API"
  ]
}
```

#### Bridge Protocol
```json
{
  "sync": "WebSocket (Firebase Realtime DB)",
  "device-to-web": "WebRTC Data Channel (optional) or REST",
  "web-to-device": "Firebase Cloud Messaging",
  "compression": "gzip",
  "encryption": "TLS 1.3"
}
```

### Project Structure

```
lifesync-web/
├── src/
│   ├── app/                 # Next.js 14 app router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx     # Main dashboard
│   │   │   ├── family/      # Family monitoring
│   │   │   ├── chat/        # Sonny messages
│   │   │   ├── triggers/    # Safety triggers
│   │   │   ├── community/   # Community features
│   │   │   └── settings/
│   │   ├── tv/              # TV-optimized views
│   │   │   └── dashboard/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── family/          # Family-specific
│   │   ├── chat/            # Chat components
│   │   ├── maps/            # Map components
│   │   └── bridge/          # Bridge status
│   ├── lib/
│   │   ├── firebase/        # Firebase config
│   │   ├── bridge/          # Device bridge logic
│   │   ├── api/             # API clients
│   │   │   ├── what3words.ts
│   │   │   ├── weather.ts
│   │   │   └── maps.ts
│   │   └── utils/
│   ├── hooks/
│   │   ├── useBridge.ts
│   │   ├── useHousehold.ts
│   │   ├── useSonnySync.ts
│   │   └── useTVNavigation.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── householdStore.ts
│   │   └── messagesStore.ts
│   └── types/
│       ├── sonny.ts
│       ├── household.ts
│       └── bridge.ts
├── public/
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Core Features

### 1. Bridge Status Monitor

```typescript
// Bridge connection state
export function BridgeStatus() {
  const { 
    isConnected, 
    connectedDevices, 
    syncStatus,
    lastSync 
  } = useBridge();
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Bridge Status</h3>
          <p className="text-sm text-gray-600">
            {isConnected 
              ? `${connectedDevices} device(s) connected`
              : 'No devices connected'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
        </div>
      </div>
      
      {syncStatus && (
        <div className="mt-4 space-y-2">
          <Progress value={syncStatus.progress} />
          <p className="text-xs text-gray-500">
            {syncStatus.current} / {syncStatus.total} items synced
          </p>
          <p className="text-xs text-gray-500">
            Last sync: {formatRelativeTime(lastSync)}
          </p>
        </div>
      )}
      
      {!isConnected && (
        <div className="mt-4">
          <Alert>
            <Info className="w-4 h-4" />
            <AlertTitle>Bridge Offline</AlertTitle>
            <AlertDescription>
              Connect your phone to this network or use USB to enable bridging.
            </AlertDescription>
          </Alert>
          
          <Button 
            className="mt-2 w-full"
            onClick={() => showBridgeInstructions()}
          >
            How to Connect
          </Button>
        </div>
      )}
    </Card>
  );
}

// Bridge hook
export function useBridge() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  
  useEffect(() => {
    // Listen for device connections
    const unsubscribe = onDeviceConnection((devices) => {
      setConnectedDevices(devices.length);
      setIsConnected(devices.length > 0);
    });
    
    return unsubscribe;
  }, []);
  
  const syncWithDevice = async (deviceId: string) => {
    setSyncStatus({ current: 0, total: 100, progress: 0 });
    
    // Pull data from device
    await pullMessagesFromDevice(deviceId, (progress) => {
      setSyncStatus(prev => ({ ...prev!, ...progress }));
    });
    
    // Push data to device
    await pushMessagesToDevice(deviceId, (progress) => {
      setSyncStatus(prev => ({ ...prev!, ...progress }));
    });
    
    setSyncStatus(null);
  };
  
  return {
    isConnected,
    connectedDevices,
    syncStatus,
    lastSync: useLastSyncTime(),
    syncWithDevice
  };
}
```

### 2. What3Words Integration

```typescript
// What3Words service
class What3WordsService {
  private apiKey = 'EE350714';
  private baseUrl = 'https://api.what3words.com/v3';
  
  async convertToWords(lat: number, lng: number): Promise<What3WordsAddress> {
    const response = await fetch(
      `${this.baseUrl}/convert-to-3wa?coordinates=${lat},${lng}&key=${this.apiKey}`
    );
    const data = await response.json();
    return {
      words: data.words,
      nearestPlace: data.nearestPlace,
      country: data.country,
      coordinates: { lat, lng }
    };
  }
  
  async convertToCoordinates(words: string): Promise<Coordinates> {
    const response = await fetch(
      `${this.baseUrl}/convert-to-coordinates?words=${words}&key=${this.apiKey}`
    );
    const data = await response.json();
    return {
      lat: data.coordinates.lat,
      lng: data.coordinates.lng
    };
  }
  
  async autosuggest(partial: string): Promise<What3WordsSuggestion[]> {
    const response = await fetch(
      `${this.baseUrl}/autosuggest?input=${partial}&key=${this.apiKey}`
    );
    const data = await response.json();
    return data.suggestions;
  }
}

// Component
export function What3WordsLocationCard({ lat, lng }: { lat: number; lng: number }) {
  const { data: w3w, isLoading } = useQuery({
    queryKey: ['what3words', lat, lng],
    queryFn: () => what3wordsService.convertToWords(lat, lng),
    staleTime: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  if (isLoading) return <Skeleton className="h-24" />;
  if (!w3w) return null;
  
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">What3Words Address</p>
          <p className="text-2xl font-mono font-bold text-red-600">
            {w3w.words}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Near: {w3w.nearestPlace}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(w3w.words)}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => openInWhat3Words(w3w.words)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open in what3words
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => shareLocation(w3w.words)}
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </Card>
  );
}
```

### 3. Weather Integration

```typescript
// Weather service
class WeatherService {
  private apiKey = '6a36a434a17e560f2eb5014b9dd056b8';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';
  
  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    const response = await fetch(
      `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${this.apiKey}`
    );
    const data = await response.json();
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon
    };
  }
  
  async getForecast(lat: number, lng: number): Promise<WeatherForecast[]> {
    const response = await fetch(
      `${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${this.apiKey}`
    );
    const data = await response.json();
    return data.list.map((item: any) => ({
      timestamp: item.dt * 1000,
      temperature: item.main.temp,
      condition: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));
  }
}

// Component
export function WeatherOverlay({ lat, lng }: { lat: number; lng: number }) {
  const { data: weather } = useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: () => weatherService.getCurrentWeather(lat, lng),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30 * 60 * 1000 // Refresh every 30 min
  });
  
  if (!weather) return null;
  
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
      <div className="flex items-center space-x-3">
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-16 h-16"
        />
        <div>
          <p className="text-3xl font-bold">
            {Math.round(weather.temperature)}°C
          </p>
          <p className="text-sm text-gray-600">
            {weather.description}
          </p>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-600">Feels like</p>
          <p className="font-semibold">{Math.round(weather.feelsLike)}°C</p>
        </div>
        <div>
          <p className="text-gray-600">Humidity</p>
          <p className="font-semibold">{weather.humidity}%</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-600">Wind</p>
          <p className="font-semibold">{weather.windSpeed} m/s</p>
        </div>
      </div>
    </div>
  );
}
```

### 4. Enhanced Map View

```typescript
export function FamilyMapView({ householdId }: { householdId: string }) {
  const members = useHouseholdMembers(householdId);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showWeather, setShowWeather] = useState(true);
  const [showWhat3Words, setShowWhat3Words] = useState(true);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  });
  
  if (!isLoaded) return <Skeleton className="w-full h-full" />;
  
  // Calculate map bounds to show all members
  const bounds = useMemo(() => {
    const b = new google.maps.LatLngBounds();
    members.forEach(member => {
      if (member.lastKnownLocation) {
        b.extend(member.lastKnownLocation);
      }
    });
    return b;
  }, [members]);
  
  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false
        }}
        onLoad={(map) => map.fitBounds(bounds)}
      >
        {/* Member markers */}
        {members.map(member => (
          member.lastKnownLocation && (
            <Marker
              key={member.id}
              position={member.lastKnownLocation}
              icon={{
                url: member.photoUrl || '/default-avatar.png',
                scaledSize: new google.maps.Size(48, 48)
              }}
              onClick={() => setSelectedMember(member.id)}
            />
          )
        ))}
        
        {/* Info window for selected member */}
        {selectedMember && (() => {
          const member = members.find(m => m.id === selectedMember);
          if (!member?.lastKnownLocation) return null;
          
          return (
            <InfoWindow
              position={member.lastKnownLocation}
              onCloseClick={() => setSelectedMember(null)}
            >
              <div className="p-2 min-w-[250px]">
                <div className="flex items-center space-x-3 mb-3">
                  <img 
                    src={member.photoUrl}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-sm text-gray-600">
                      {member.currentStatus}
                    </p>
                  </div>
                </div>
                
                {showWhat3Words && member.lastKnownLocation && (
                  <What3WordsLocationCard 
                    lat={member.lastKnownLocation.lat}
                    lng={member.lastKnownLocation.lng}
                  />
                )}
                
                {showWeather && member.lastKnownLocation && (
                  <WeatherOverlay
                    lat={member.lastKnownLocation.lat}
                    lng={member.lastKnownLocation.lng}
                  />
                )}
                
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-600">
                    Last check-in: {formatRelativeTime(member.lastCheckIn)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Accuracy: ±{member.locationAccuracy}m
                  </p>
                </div>
              </div>
            </InfoWindow>
          );
        })()}
      </GoogleMap>
      
      {/* Map controls */}
      <Card className="absolute top-4 left-4 p-2">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={showWeather}
              onCheckedChange={setShowWeather}
            />
            <label className="text-sm">Show weather</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={showWhat3Words}
              onCheckedChange={setShowWhat3Words}
            />
            <label className="text-sm">Show what3words</label>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

---

## Implementation Plan

### Phase 1: Core Web App (Weeks 1-4)
**Goal:** Basic web app with Firebase sync

- [ ] Next.js 14 project setup
- [ ] Firebase integration (Auth, Realtime DB, Storage)
- [ ] User authentication (Google, Email)
- [ ] Basic dashboard layout
- [ ] Profile viewing
- [ ] Message viewing (read-only)
- [ ] Responsive design (mobile, tablet, desktop)

**Deliverables:**
- Working web app with login
- Can view synced data from Android
- Responsive on all screen sizes

---

### Phase 2: Smart TV Support (Weeks 5-6)
**Goal:** Large screen optimization

- [ ] TV-optimized layouts
- [ ] TV remote navigation (d-pad)
- [ ] Family dashboard view
- [ ] Large text and icons
- [ ] Auto-refresh features
- [ ] Kiosk mode (lock to dashboard)

**Deliverables:**
- TV-friendly interface
- Full remote control support
- 24/7 dashboard mode

---

### Phase 3: Device Bridge (Weeks 7-10)
**Goal:** Enable web-to-Android sync

- [ ] WebSocket connection to Android
- [ ] Device discovery (same network)
- [ ] USB connection support (via WebUSB)
- [ ] Bidirectional sync protocol
- [ ] Bridge status monitoring
- [ ] Conflict resolution
- [ ] Offline queue

**Deliverables:**
- Web app can sync with Android phone
- Mesh messages bridge to internet
- Online messages sync to phone

---

### Phase 4: Enhanced Location (Weeks 11-12)
**Goal:** Integrate What3Words and Weather

- [ ] What3Words API integration (EE350714)
- [ ] Weather API integration (6a36a434a17e560f2eb5014b9dd056b8)
- [ ] Enhanced map component
- [ ] Location search
- [ ] Weather overlays
- [ ] Location sharing

**Deliverables:**
- What3Words addresses on all locations
- Weather data displayed
- Enhanced map view

---

### Phase 5: Sonny Features (Weeks 13-16)
**Goal:** Full Sonny Chat support

- [ ] Chat interface
- [ ] Send/receive messages
- [ ] Community postbox viewer
- [ ] Trigger management
- [ ] Check-in history
- [ ] Emergency alert panel
- [ ] Trust score display

**Deliverables:**
- Full-featured Sonny web client
- Can manage triggers from web
- Emergency dashboard

---

### Phase 6: Polish & Deploy (Weeks 17-20)
**Goal:** Production-ready deployment

- [ ] Performance optimization
- [ ] SEO optimization
- [ ] PWA support (installable)
- [ ] Error handling
- [ ] Analytics integration
- [ ] Help documentation
- [ ] User testing
- [ ] Vercel deployment

**Deliverables:**
- Production deployment
- PWA installable on desktop
- Complete documentation

---

## Success Metrics

### Technical
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Bridge sync < 30s (1000 messages)
- [ ] 99.9% uptime

### User Experience
- [ ] Login < 30 seconds
- [ ] Can view family status in < 5 seconds
- [ ] Message send/receive < 2 seconds
- [ ] TV remote navigation intuitive
- [ ] Works on all modern browsers

### Adoption
- [ ] 50% of Android users also use web
- [ ] 30% of households use TV mode
- [ ] 20% use web as primary bridge
- [ ] 80% satisfaction rate

---

## Appendices

### A. Browser Compatibility

| Browser | Version | TV Support |
|---------|---------|------------|
| Chrome | 90+ | ✓ (Android TV, Google TV) |
| Firefox | 88+ | ✓ (Amazon Fire TV) |
| Safari | 14+ | ✗ (Apple TV uses apps) |
| Edge | 90+ | ✓ (Xbox) |
| Samsung Internet | 14+ | ✓ (Tizen Smart TVs) |
| LG webOS Browser | 4.0+ | ✓ (LG Smart TVs) |

### B. Smart TV Testing Checklist

- [ ] Tested on actual Smart TV (Samsung, LG)
- [ ] Remote d-pad navigation works
- [ ] Text readable from 3m distance
- [ ] Auto-refresh without user action
- [ ] Handles sleep/wake cycles
- [ ] No memory leaks (24h run)
- [ ] Graceful network reconnection

### C. Bridge Protocol Spec

```
Message Format (JSON):

{
  "version": "1.0",
  "timestamp": 1697234567890,
  "deviceId": "android_device_uuid",
  "type": "sync_request | sync_response | message",
  "payload": {
    // Message-specific data
  }
}

Sync Flow:

1. Device connects to same WiFi as web app
2. Device broadcasts presence (mDNS)
3. Web app detects device
4. Web app initiates handshake
5. Device responds with sync manifest
6. Web app requests missing data
7. Device sends data chunks
8. Web app acknowledges receipt
9. Web app sends data to device
10. Device acknowledges
11. Sync complete
```

---

**Document Status:** DRAFT v2.0  
**Next Review:** After Web Prototype  
**Stakeholders:** Web Team, Android Team, UX, Product

