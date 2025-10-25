# Phase 5 Quick Reference - Video + AI Features
**Last Updated:** October 13, 2025

---

## 🎥 Video Conferencing

### Quick Start
```typescript
import FamilyVideoRoom from '@/components/video/FamilyVideoRoom';

<FamilyVideoRoom
  familyGroupId="jalamba-holdings"
  templateId="f3-company-registration" // Optional
  roomName="Business Strategy Session"
  recordingEnabled={true}
  maxParticipants={12}
  onCallEnd={(metrics) => console.log('Call ended:', metrics)}
/>
```

### Using the Hook Directly
```typescript
import { useVideoConference } from '@/hooks/useVideoConference';

const {
  session,
  participants,
  isConnected,
  isRecording,
  createRoom,
  joinRoom,
  leaveRoom,
  toggleMute,
  toggleVideo
} = useVideoConference();

// Create and join
const roomUrl = await createRoom({
  familyGroupId: 'my-family',
  roomName: 'Council Meeting'
});

await joinRoom(roomUrl, {
  userId: user.uid,
  displayName: user.name,
  role: 'member',
  hasConsented: true
});
```

### Environment Setup
```bash
# .env.local
NEXT_PUBLIC_DAILY_API_KEY=your_key_here
NEXT_PUBLIC_DAILY_DOMAIN=salatiso.daily.co
```

---

## 🤖 AI Recommendations

### Quick Start
```typescript
import { useTemplateRecommendations } from '@/hooks/useTemplateRecommendations';
import RecommendationCard from '@/components/ai/RecommendationCard';

const {
  recommendations,
  loading,
  acceptRecommendation,
  rejectRecommendation,
  explainRecommendation
} = useTemplateRecommendations('family-id');

{recommendations.map(rec => (
  <RecommendationCard
    key={rec.templateId}
    recommendation={rec}
    onAccept={() => acceptRecommendation(rec.templateId)}
    onReject={() => rejectRecommendation(rec.templateId)}
    explanation={explainRecommendation(rec)}
  />
))}
```

### Using the Service Directly
```typescript
import { getAIRecommendationService } from '@/services/AIRecommendationService';

const service = getAIRecommendationService();

// Get recommendations
const context = await service.analyzeContext('family-id');
const recommendations = await service.generateRecommendations(context);

// Submit feedback
await service.refineWithFeedback({
  recommendationId: 'rec-123',
  familyId: 'family-id',
  templateId: 'template-id',
  accepted: true,
  completed: false,
  timestamp: new Date()
});
```

### Environment Setup
```bash
# .env.local
NEXT_PUBLIC_OPENAI_API_KEY=your_key_here
```

---

## 📦 Components Reference

### Video Components
- `<FamilyVideoRoom />` - Main video call interface
- `<ConsentDialog />` - Ubuntu consent flow
- `<ParticipantGrid />` - Smart video grid layout
- `<TemplateVideoSidebar />` - Template reference during calls

### AI Components
- `<RecommendationCard />` - AI recommendation display

---

## 🎨 Styling

All components use Tailwind CSS with Ubuntu color scheme:
- Orange: Primary actions, Ubuntu elements
- Blue: Collaboration features
- Yellow: Warnings, prerequisites
- Green: Success, trust indicators

---

## 🧪 Testing

### Video Tests
```bash
# Create test
npm test -- VideoConferenceService.test.ts

# Hook test
npm test -- useVideoConference.test.ts

# Component test
npm test -- FamilyVideoRoom.test.tsx
```

### AI Tests
```bash
# Service test
npm test -- AIRecommendationService.test.ts

# Hook test
npm test -- useTemplateRecommendations.test.ts

# Component test
npm test -- RecommendationCard.test.tsx
```

---

## 📝 Common Tasks

### Add New Video Feature
1. Update `VideoConferenceService.ts` with new method
2. Expose in `useVideoConference.ts` hook
3. Add UI in `FamilyVideoRoom.tsx`
4. Test with Daily.co test room

### Customize AI Recommendations
1. Update system prompt in `AIRecommendationService.ts`
2. Modify `buildRecommendationPrompt()` for context
3. Adjust validation in `validateRecommendations()`
4. Test with various family contexts

### Add New Ubuntu Feature
1. Design consent flow (if needed)
2. Implement in relevant component
3. Add to audit trail
4. Document Ubuntu principle alignment

---

## 🐛 Troubleshooting

### Video not working
- Check Daily.co API key in `.env.local`
- Verify browser permissions (camera/mic)
- Check Daily.co dashboard for usage limits
- Look for CORS errors in console

### AI not working
- Check OpenAI API key in `.env.local`
- Verify API quota/billing
- Check for rate limit errors
- Fallback logic should activate automatically

### Consent issues
- Ensure all participants have `hasConsented: true`
- Check consent token generation
- Verify audit trail storage
- Review POPIA compliance logs

---

## 📚 Documentation Links

- **Phase 5 Planning:** `PHASE5_PLANNING_DOCUMENT.md`
- **Video Setup Guide:** `VIDEO_CONFERENCE_SETUP_GUIDE.md`
- **Session Summary:** `PHASE5_SESSION1_SUMMARY.md`
- **Daily.co Docs:** https://docs.daily.co
- **OpenAI Docs:** https://platform.openai.com/docs

---

## 🚀 Next Features (Coming Soon)

- [ ] Real-time collaborative editing (Yjs + TipTap)
- [ ] Collaboration analytics dashboard
- [ ] Ubuntu achievement badge system
- [ ] Advanced consent management
- [ ] Comprehensive testing suite

---

**Quick Help:**
- Video issues? Check `VIDEO_CONFERENCE_SETUP_GUIDE.md`
- AI issues? Verify OpenAI API key and quota
- Ubuntu questions? See cultural sensitivity docs
- Everything else? Check `PHASE5_SESSION1_SUMMARY.md`

*Last updated: October 13, 2025*
