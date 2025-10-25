# Video Conference Quick Setup Guide
**Salatiso Ecosystem - Family Video Councils**

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Daily.co API Key
1. Go to https://dashboard.daily.co/signup
2. Sign up (free tier: 10,000 minutes/month)
3. Navigate to **Developers** → **API Keys**
4. Copy your API key

### Step 2: Configure Environment
Create or update `.env.local`:
```bash
# Daily.co Video Conference
NEXT_PUBLIC_DAILY_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_DAILY_DOMAIN=your-subdomain.daily.co
```

### Step 3: Test Installation
```bash
# Dependencies already installed
npm install  # Should show @daily-co packages

# Run dev server
npm run dev
```

---

## 📖 Usage Example

### Basic Video Call Setup

```typescript
'use client';

import { useVideoConference } from '@/hooks/useVideoConference';
import { useAuth } from '@/contexts/AuthContext';

export default function VideoCallPage() {
  const { user } = useAuth();
  const {
    session,
    participants,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo
  } = useVideoConference();

  const startFamilyCouncil = async () => {
    // 1. Create room
    const roomUrl = await createRoom({
      familyGroupId: 'jalamba-holdings',
      roomName: 'Business Strategy Session',
      maxParticipants: 12,
      requireConsent: true,
      recordingEnabled: true
    });

    // 2. Join room
    await joinRoom(roomUrl, {
      userId: user!.uid,
      displayName: user!.displayName || 'Family Member',
      role: 'member', // or 'elder' for senior family
      hasConsented: true, // After showing consent UI
      avatarUrl: user!.photoURL || undefined
    });
  };

  return (
    <div className="video-container">
      {!isConnected ? (
        <button onClick={startFamilyCouncil}>
          Start Family Council
        </button>
      ) : (
        <>
          <div className="video-grid">
            {/* Video elements will render here */}
            {participants.map(p => (
              <div key={p.session_id}>
                {p.user_name}
              </div>
            ))}
          </div>
          
          <div className="controls">
            <button onClick={toggleMute}>Mute/Unmute</button>
            <button onClick={toggleVideo}>Video On/Off</button>
            <button onClick={leaveRoom}>Leave</button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

## 🎨 Full Component Example with UI

```typescript
'use client';

import { useState } from 'react';
import { useVideoConference } from '@/hooks/useVideoConference';
import { useAuth } from '@/contexts/AuthContext';
import DailyIframe from '@daily-co/daily-react';

export default function FamilyVideoRoom() {
  const { user } = useAuth();
  const [showConsent, setShowConsent] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  
  const {
    session,
    participants,
    isConnected,
    isMuted,
    isVideoOff,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo
  } = useVideoConference();

  const handleStartCall = async () => {
    // Create room
    const url = await createRoom({
      familyGroupId: 'jalamba-holdings',
      roomName: 'Family Business Discussion',
      maxParticipants: 12,
      requireConsent: true
    });
    
    setRoomUrl(url);
    setShowConsent(true);
  };

  const handleConsentGiven = async () => {
    if (!roomUrl) return;
    
    await joinRoom(roomUrl, {
      userId: user!.uid,
      displayName: user!.displayName || 'Family Member',
      role: 'member',
      hasConsented: true,
      avatarUrl: user!.photoURL || undefined
    });
    
    setShowConsent(false);
  };

  if (showConsent) {
    return (
      <div className="consent-dialog">
        <h2>Ubuntu Consent - Family Video Council</h2>
        <p>
          You are about to join a family video call. By joining, you agree to:
        </p>
        <ul>
          <li>Participate respectfully in collective decision-making</li>
          <li>Honor the speaking order and elder guidance</li>
          <li>Keep family discussions confidential</li>
        </ul>
        <button onClick={handleConsentGiven}>I Consent - Join Call</button>
        <button onClick={() => setShowConsent(false)}>Cancel</button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="pre-call">
        <h1>Family Video Council</h1>
        <button onClick={handleStartCall} className="btn-primary">
          Start Video Call
        </button>
      </div>
    );
  }

  return (
    <div className="video-call-active">
      {/* Daily.co iframe renders video */}
      {roomUrl && (
        <DailyIframe
          url={roomUrl}
          showLeaveButton={false}
          showFullscreenButton={true}
          style={{ width: '100%', height: '600px' }}
        />
      )}
      
      <div className="controls-bar">
        <button 
          onClick={toggleMute}
          className={isMuted ? 'muted' : 'unmuted'}
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
        
        <button 
          onClick={toggleVideo}
          className={isVideoOff ? 'video-off' : 'video-on'}
        >
          {isVideoOff ? '📹 Turn On Video' : '📹 Turn Off Video'}
        </button>
        
        <button onClick={leaveRoom} className="btn-danger">
          Leave Call
        </button>
      </div>
      
      <div className="participants-list">
        <h3>Participants ({participants.length})</h3>
        {participants.map(p => (
          <div key={p.session_id} className="participant">
            <span>{p.user_name}</span>
            {!p.audio && <span>🔇</span>}
            {!p.video && <span>📹❌</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎯 Key Features to Implement Next

### 1. FamilyVideoRoom Component
Full-featured video call UI with:
- Participant grid layout
- Control bar (mute, video, screen share)
- Template sidebar reference
- Recording consent flow
- Elder priority indicators

**Estimated Time:** 4-6 hours  
**File:** `src/components/video/FamilyVideoRoom.tsx`

### 2. ConsentDialog Component
Ubuntu-themed consent ritual:
- Clear explanation of recording purpose
- Visual consent checklist
- Audit trail display
- Cultural language (isiZulu/English)

**Estimated Time:** 2-3 hours  
**File:** `src/components/video/ConsentDialog.tsx`

### 3. ParticipantGrid Component
Smart grid layout:
- Responsive (2x2, 3x3, 4x3)
- Active speaker highlighting
- Role badges (elder, member, guest)
- Audio/video status indicators

**Estimated Time:** 3-4 hours  
**File:** `src/components/video/ParticipantGrid.tsx`

---

## 🧪 Testing Checklist

### Manual Testing
- [ ] Create room successfully
- [ ] Join room with valid consent
- [ ] See other participants join
- [ ] Mute/unmute audio works
- [ ] Toggle video works
- [ ] Screen share works (requires UI)
- [ ] Leave room cleans up properly
- [ ] Recording starts with consent
- [ ] Session metrics saved to Firestore

### Automated Testing
```typescript
// __tests__/hooks/useVideoConference.test.ts
import { renderHook, act } from '@testing-library/react';
import { useVideoConference } from '@/hooks/useVideoConference';

test('creates room and returns URL', async () => {
  const { result } = renderHook(() => useVideoConference());
  
  let roomUrl;
  await act(async () => {
    roomUrl = await result.current.createRoom({
      familyGroupId: 'test-family',
      maxParticipants: 12
    });
  });
  
  expect(roomUrl).toContain('daily.co');
});
```

---

## 🐛 Common Issues & Solutions

### Issue: "Video service not initialized"
**Solution:** Ensure `NEXT_PUBLIC_DAILY_API_KEY` is set in `.env.local` and restart dev server.

### Issue: "Failed to create room: 401 Unauthorized"
**Solution:** Check API key is correct. Verify on Daily.co dashboard.

### Issue: Video doesn't appear
**Solution:** 
1. Use `<DailyIframe>` component from `@daily-co/daily-react`
2. Or manually attach video tracks to `<video>` elements
3. Check browser permissions for camera/microphone

### Issue: "No active session" when screen sharing
**Solution:** Must join room before calling `startScreenShare()`.

### Issue: Recording fails silently
**Solution:** Verify all participants have consented. Check console for error messages.

---

## 📚 API Reference

### VideoConferenceService Methods

```typescript
// Create a new room
createRoom(options: RoomOptions): Promise<DailyRoomInfo>

// Join an existing room
joinRoom(roomUrl: string, participant: Participant): Promise<VideoSession>

// Share screen
shareScreen(session: VideoSession): Promise<MediaStream | null>

// Start recording (requires consent from all)
recordSession(session: VideoSession, consentTokens: ConsentToken[]): Promise<string>

// End session and get metrics
endSession(session: VideoSession): Promise<SessionMetrics>

// Controls
setLocalAudio(enabled: boolean): Promise<void>
setLocalVideo(enabled: boolean): Promise<void>

// Get current participants
getParticipants(): DailyParticipant[]
```

### useVideoConference Hook

```typescript
const {
  // State
  session: VideoSession | null,
  participants: DailyParticipant[],
  isConnected: boolean,
  isRecording: boolean,
  isMuted: boolean,
  isVideoOff: boolean,
  isScreenSharing: boolean,
  error: string | null,
  
  // Actions
  createRoom: (options: RoomOptions) => Promise<string>,
  joinRoom: (roomUrl: string, participant: Participant) => Promise<void>,
  leaveRoom: () => Promise<SessionMetrics | null>,
  toggleMute: () => Promise<void>,
  toggleVideo: () => Promise<void>,
  startScreenShare: () => Promise<void>,
  stopScreenShare: () => Promise<void>,
  startRecording: (consentTokens: ConsentToken[]) => Promise<void>,
  stopRecording: () => Promise<void>
} = useVideoConference();
```

---

## 💰 Cost Estimation

### Daily.co Pricing
- **Free Tier:** 10,000 minutes/month
- **Typical Family Usage:** 
  - 5 video calls/week × 30 min = 150 min/week
  - ~600 min/month per family
  - 15-20 families supported on free tier

### When to Upgrade
- If exceeding 10k min/month: $0.002/min (~$20 for next 10k)
- Recording storage: Free with Daily (30-day retention)
- Custom domain: Free

**Recommendation:** Start with free tier, monitor usage in analytics dashboard.

---

## 🔒 Security Best Practices

1. **Never expose API key in client code** - Use server-side endpoints
2. **Use private rooms** - Always require tokens to join
3. **Validate consent tokens** - Check signatures before recording
4. **Auto-expire rooms** - Set `exp` property (2-hour max recommended)
5. **Audit recording access** - Log who downloads recordings
6. **POPIA Compliance** - Delete recordings after 30 days (South African law)

---

## 📞 Support & Resources

### Daily.co Support
- Docs: https://docs.daily.co
- Community: https://community.daily.co
- Status: https://status.daily.co

### Salatiso Internal
- Issue Tracker: GitHub Issues
- Team Chat: [Add your team channel]
- Technical Lead: [Add contact]

### Ubuntu Philosophy Resources
- Traditional indaba protocols
- Family council facilitation guides
- Cultural sensitivity training

---

**Last Updated:** October 13, 2025  
**Version:** 1.0  
**Status:** Video Conference Foundation Complete ✓

*"Technology that honors tradition while enabling progress."*
