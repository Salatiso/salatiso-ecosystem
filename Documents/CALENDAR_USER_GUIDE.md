# 📅 CALENDAR USER GUIDE - Phase 1 Enhancement

**October 23, 2025 | For Family Briefing**

Welcome! This guide explains the new calendar features that make event management smoother, safer, and more collaborative.

---

## 🎯 QUICK START (2 minutes)

### What's New?
Three powerful features are now built into your calendar:

1. **👥 Role Assignment** - Assign people specific responsibilities
2. **🚨 Incident Logging** - Report problems and get automatic escalation
3. **🤝 Assistance Requests** - Ask for help when you need it

### Getting Started
1. Open your calendar event
2. Look for three new buttons: "Assign Role," "Report Issue," "Request Help"
3. Start using them!

---

## 📋 TABLE OF CONTENTS

- [Feature 1: Role Assignment](#feature-1-role-assignment)
- [Feature 2: Incident Logging](#feature-2-incident-logging)
- [Feature 3: Assistance Requests](#feature-3-assistance-requests)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Accessibility Guide](#accessibility-guide-wcag-21-aa)
- [FAQs](#faqs)
- [Troubleshooting](#troubleshooting)

---

## 🟢 FEATURE 1: ROLE ASSIGNMENT

### What It Does
Assign people different roles at your events so everyone knows their responsibilities.

### The 4 Roles

| Role | Responsibilities | Can Edit? | Can Escalate? |
|------|-----------------|-----------|---------------|
| **Organizer** 📋 | Plans & leads the event | Yes | Yes |
| **Participant** 👤 | Attends & participates | Limited | No |
| **Supporter** 🤝 | Provides resources/help | Limited | No |
| **Steward** 🛡️ | Oversees coordination | Yes | Yes |

### How to Assign a Role

#### Step 1: Open the Event
- Click on any event in your calendar
- Look for the **"Assign Role"** button

#### Step 2: Search for Person
- Type their name in the search box
- Click their name from the list
- *Note: You can only assign roles to people you have permission to invite*

#### Step 3: Select Role & Permissions
```
Who:        [John Doe          ]
Role:       [Participant    ▼] (Organizer, Participant, Supporter, Steward)
Permissions: ☐ Can Edit Event
             ☐ Can Escalate Incidents
             ☐ Can Assign Other Roles
```

#### Step 4: Send & Track
- Click **"Assign Role"**
- Person gets notified
- Status shows: **Assigned** → **Accepted** → **Completed**

### Role Status Workflow

```
┌─────────────┐
│  ASSIGNED   │ (You assigned, waiting for response)
└──────┬──────┘
       │ Person accepts
       ▼
   ┌─────────────┐
   │  ACCEPTED   │ (Person confirmed they'll participate)
   └──────┬──────┘
          │ Event happens
          ▼
      ┌─────────────┐
      │ COMPLETED   │ (Event done, role finished)
      └─────────────┘
          
      OR
      
┌─────────────┐
│  DECLINED   │ (Person can't participate)
└─────────────┘
```

### Example Scenario

**You:** "I'm organizing a family lunch and need help"

**Step 1 - Assign roles:**
- Dad = Organizer (leads lunch planning)
- Mom = Supporter (brings dessert)
- Sister = Participant (just attending)
- Brother = Steward (coordinates timing)

**Step 2 - Track responses:**
- Dad: ✅ Accepted (ready to plan)
- Mom: ✅ Accepted (will bring dessert)
- Sister: ⏳ Waiting for response
- Brother: ✅ Accepted (coordinating)

**Step 3 - When lunch happens:**
- Everyone knows their role
- No confusion about who's doing what
- Easy to track who showed up

---

## 🚨 FEATURE 2: INCIDENT LOGGING

### What It Does
Report problems or issues at an event, and the system automatically escalates serious issues to the right people.

### The 5 Issue Categories

| Category | Examples | Icon |
|----------|----------|------|
| **Health** 🏥 | Someone feeling sick, injury | 🏥 |
| **Safety** 🚨 | Unsafe conditions, hazard | 🚨 |
| **Behavioral** 👥 | Conflict, disruption | 👥 |
| **Logistics** 🚚 | Missing supplies, transport issue | 🚚 |
| **Other** ❓ | Anything else | ❓ |

### The 4 Severity Levels

| Level | Description | Auto-Escalates? | Response Time |
|-------|-------------|-----------------|----------------|
| **Critical** 🔴 | Immediate danger | YES → NOW | Immediate |
| **High** 🟠 | Urgent attention needed | YES → Supervisor | Within 15 min |
| **Medium** 🟡 | Needs attention | NO | Within 1 hour |
| **Low** 🟢 | Minor issue | NO | When possible |

### How to Log an Incident

#### Step 1: Open the Event
- Click on the event in your calendar
- Look for the **"Report Issue"** button

#### Step 2: Fill Out the Form
```
┌─ REPORT INCIDENT ─────────────────┐
│                                   │
│ Title: *                          │
│ [___________________________]     │
│ "What happened?" (required)       │
│                                   │
│ Category: [Health        ▼]       │
│ Severity: [Critical      ▼]       │
│ Description: [___________]        │
│ "More details (optional)"         │
│                                   │
│ ⚠️  CRITICAL INCIDENT              │
│ Will auto-escalate to Solo        │
│ Professional assistance will      │
│ be contacted immediately          │
│                                   │
│ [Submit] [Cancel]                 │
└───────────────────────────────────┘
```

#### Step 3: System Takes Action
- **If Critical:** 🚨 Escalates IMMEDIATELY to designated people
- **If High:** 🟠 Escalates to supervisor within 15 minutes
- **If Medium/Low:** 🟡 Logs for review (no auto-escalation)

### Auto-Escalation Examples

**Example 1: Health Emergency**
```
You report: "Person has severe chest pain"
Category: Health | Severity: CRITICAL

System automatically:
  ✓ Alerts organizer
  ✓ Alerts steward
  ✓ Contacts on-call professional
  ✓ Logs incident permanently
  ✓ Tracks all responses
```

**Example 2: Logistics Issue**
```
You report: "Bus for transportation didn't arrive"
Category: Logistics | Severity: HIGH

System automatically:
  ✓ Alerts event organizer
  ✓ Notifies logistics team
  ✓ Escalates within 15 minutes
```

**Example 3: Minor Issue**
```
You report: "Coffee machine not working"
Category: Logistics | Severity: LOW

System:
  ✓ Logs the issue
  ✓ Notifies on next check-in
  ✓ No automatic escalation
```

### The Escalation Hierarchy

```
CRITICAL INCIDENT REPORTED
        ↓
    [IMMEDIATE]
        ↓
    Organizer
    Steward
    Professional (on-call)
        ↓
    RESPONSE REQUIRED IMMEDIATELY

HIGH SEVERITY REPORTED
        ↓
    [15-MIN WINDOW]
        ↓
    Supervisor
    Organizer
        ↓
    RESPONSE REQUIRED WITHIN 15 MIN

MEDIUM SEVERITY REPORTED
        ↓
    [LOGGED]
        ↓
    Next available person
        ↓
    REVIEW ON NEXT CHECK

LOW SEVERITY REPORTED
        ↓
    [LOGGED]
        ↓
    Addressed when possible
```

---

## 🤝 FEATURE 3: ASSISTANCE REQUESTS

### What It Does
Ask for help when you need something, and see who's available to assist.

### The 6 Assistance Types

| Type | What You're Asking For | Icon |
|------|----------------------|------|
| **Transportation** 🚗 | Ride, delivery, travel | 🚗 |
| **Setup Help** 🔧 | Setting up equipment, decorations | 🔧 |
| **Logistics** 📦 | Supplies, materials, resources | 📦 |
| **Supervision** 👀 | Watching something, monitoring | 👀 |
| **Communication** 📢 | Spreading word, notifying people | 📢 |
| **Other** ❓ | Something else | ❓ |

### The 6 Status States

```
REQUESTED
   ↓
   ├─ OFFERED (someone said "I can help")
   │    ↓
   │    ACCEPTED (you confirmed they can help)
   │    ↓
   │    IN_PROGRESS (they're helping now)
   │    ↓
   │    COMPLETED (help was provided)
   │
   └─ DECLINED (you rejected offer OR
              they cancelled)
```

### How to Request Assistance

#### Step 1: Open the Event
- Click on the event
- Look for the **"Request Help"** button

#### Step 2: Describe What You Need
```
┌─ REQUEST ASSISTANCE ──────────────┐
│                                   │
│ Type: [Transportation ▼]          │
│                                   │
│ Description: *                    │
│ [Need ride to venue from]          │
│ [downtown location]               │
│                                   │
│ When Needed: [Oct 25, 2:00 PM]    │
│ Time Remaining: 3 hours 45 min    │
│ Urgent: ☐ Yes (high priority)    │
│                                   │
│ [Submit] [Cancel]                 │
└───────────────────────────────────┘
```

#### Step 3: Wait for Offers
- People see your request
- They can offer help by clicking "Offer Help"
- Notification shows who offered

#### Step 4: Accept or Decline Offers
```
ASSISTANCE REQUEST:
"Need ride to venue"

OFFERS RECEIVED:
  ☐ John offered transportation
  ☐ Mom offered transportation
  
[Accept John's offer] [Decline] [Contact directly]
```

#### Step 5: Track Progress
- Status updates: Requested → Offered → Accepted → In Progress → Completed
- See who's helping
- Time remaining to deadline
- Option to cancel if no longer needed

### Example Scenarios

**Scenario 1: Transportation**
```
Thursday 2:00 PM - You need a ride to the event
  
11:00 - You post: "Need ride to downtown venue"
11:05 - Dad offers: "I can take you"
11:06 - You accept Dad's offer
14:00 - Dad picks you up ✓ COMPLETED
```

**Scenario 2: Setup Help**
```
Friday 8:00 AM - You need help setting up
  
07:00 - You post: "Need help setting up tables"
07:15 - Brother offers: "I'm available 8:30 AM"
07:16 - You accept Brother's offer
08:30 - Brother arrives, helps set up ✓ COMPLETED
```

**Scenario 3: Multiple Offers**
```
Saturday 1:00 PM - You need supplies
  
12:00 - You post: "Need supplies list brought"
12:05 - Mom offers: "I can bring supplies"
12:06 - Aunt offers: "I can bring supplies too"
12:07 - You accept Mom's offer
12:30 - You politely decline Aunt's offer
13:00 - Mom arrives with supplies ✓ COMPLETED
```

---

## ⌨️ KEYBOARD SHORTCUTS

### Universal Shortcuts (All Pages)

| Shortcut | Action | Use Case |
|----------|--------|----------|
| `Alt + N` | New Event | Quickly create event |
| `Alt + E` | Edit Event | Quickly edit event |
| `Escape` | Close Modal | Close any popup |
| `Tab` | Focus Next | Navigate with keyboard |
| `Shift+Tab` | Focus Previous | Navigate backwards |
| `Enter` | Confirm | Submit form |

### Calendar View Shortcuts

| Shortcut | Action | Use Case |
|----------|--------|----------|
| `Arrow Left` | Previous Week | Move to earlier week |
| `Arrow Right` | Next Week | Move to later week |
| `Arrow Up` | Previous Month | Move back one month |
| `Arrow Down` | Next Month | Move forward one month |
| `Today` | Go to Today | Jump to current date |
| `?` | Show Help | See all shortcuts |

### Event Details Shortcuts

| Shortcut | Action | Use Case |
|----------|--------|----------|
| `R` | Assign Role | Open role dialog |
| `I` | Report Issue | Open incident dialog |
| `H` | Request Help | Open assistance dialog |
| `Delete` | Delete Event | Remove event |
| `Ctrl+S` | Save Changes | Save edits |

### Form Shortcuts

| Shortcut | Action | Use Case |
|----------|--------|----------|
| `Enter` | Submit | Submit form |
| `Escape` | Cancel | Close without saving |
| `Tab` | Next Field | Move to next input |
| `Shift+Tab` | Previous Field | Move to previous input |

### Quick Reference Card

**Print this!**
```
┌─────────────────────────────────────┐
│ CALENDAR KEYBOARD SHORTCUTS         │
├─────────────────────────────────────┤
│ New Event:      Alt + N             │
│ Edit Event:     Alt + E             │
│ Assign Role:    R (in event view)   │
│ Report Issue:   I (in event view)   │
│ Request Help:   H (in event view)   │
│ Previous:       ← or Page Up        │
│ Next:           → or Page Down      │
│ Today:          Home Key            │
│ Help:           ?                   │
│ Close:          Escape              │
└─────────────────────────────────────┘
```

---

## ♿ ACCESSIBILITY GUIDE (WCAG 2.1 AA)

### For Screen Reader Users

All buttons and form fields are labeled for screen readers.

**Common Screen Reader Commands:**

| Screen Reader | Command | What It Does |
|--------------|---------|-------------|
| **NVDA** (Windows) | `Insert + Up Arrow` | Read page title |
| **JAWS** (Windows) | `Insert + F` | Find text |
| **VoiceOver** (Mac) | `Cmd + U` | Open rotor (web spot list) |
| **TalkBack** (Android) | `Swipe down then right` | Open context menu |

### For Keyboard Navigation

**Can't use a mouse?** Everything works with keyboard!

#### Basic Navigation
1. **Tab Key** - Move to next interactive element (button, link, field)
2. **Shift + Tab** - Move to previous element
3. **Enter** - Activate button or submit form
4. **Space** - Check/uncheck checkbox
5. **Arrow Keys** - Navigate within lists/dropdowns

#### Example: Creating a Role Assignment with Only Keyboard

```
1. Press Tab until "Assign Role" button is focused (button highlights)
2. Press Enter to open the Role Assignment dialog
3. Type person's name in search box
4. Press Arrow Down to select from dropdown
5. Press Tab to move to Role dropdown
6. Press Arrow Down to select role (Organizer, Participant, etc.)
7. Press Tab to move to Permission checkboxes
8. Press Space to check/uncheck permissions
9. Press Tab to move to Submit button
10. Press Enter to submit
```

### Color Contrast & Visual Design

✅ **All colors meet WCAG AA standards:**
- Text to background: 4.5:1 contrast ratio (minimum)
- Large text: 3:1 contrast ratio (minimum)
- Icons have text labels (not just color-coded)
- No information conveyed by color alone

### For Users with Cognitive Disabilities

- ✅ **Simple language** - Avoid jargon
- ✅ **Clear labels** - Every button explains what it does
- ✅ **Confirmation dialogs** - Confirm before deleting
- ✅ **Consistent layout** - Same buttons in same place
- ✅ **Helpful errors** - Tell you what went wrong and how to fix it

### Mobile Accessibility

- ✅ **Touch-friendly buttons** - Minimum 44x44 pixels
- ✅ **Large text options** - Pinch to zoom supported
- ✅ **Screen reader support** - Works with iOS VoiceOver & Android TalkBack
- ✅ **Voice input** - Voice control compatible

### Accessibility Testing

**We tested with:**
- ✅ NVDA (Windows screen reader)
- ✅ VoiceOver (Mac screen reader)
- ✅ Keyboard-only navigation
- ✅ High contrast mode
- ✅ Mobile screen readers
- ✅ Color blind mode

**Result:** 100% WCAG 2.1 AA Compliant ✓

---

## ❓ FAQs

### General Questions

**Q: How do I see all my assigned roles?**
A: Go to your profile → "My Roles" tab. Shows all roles you're assigned to, their status, and upcoming events.

**Q: Can I have multiple roles at one event?**
A: Yes! You could be both a Participant and a Supporter at the same event.

**Q: Who can see the incident reports?**
A: Organizer, all Stewards, and anyone involved in the escalation. Others only see "issue reported" if severity is high.

**Q: How long do incidents stay on file?**
A: All incidents are permanently logged for safety & legal reasons. You can request privacy review if needed.

**Q: Can someone turn down a role?**
A: Yes! They'll see "Accept" and "Decline" options. You'll be notified if they decline.

---

### Role Assignment Questions

**Q: What if someone doesn't respond to a role assignment?**
A: After 7 days, the role reverts to "Unconfirmed." You can reassign or remind them.

**Q: Can I change someone's permissions after assigning a role?**
A: Yes, but they must accept the changes. You get a notification popup.

**Q: What does "Can Edit Event" permission mean?**
A: They can modify event details (date, time, location, description) but not delete the event.

**Q: Can a Participant upgrade themselves to Organizer?**
A: No, only Organizers and Stewards can assign/change roles.

---

### Incident Reporting Questions

**Q: What if I report an incident by mistake?**
A: You can cancel it within 5 minutes of reporting. After that, it's logged permanently (for safety).

**Q: Who gets notified of a Critical incident?**
A: Organizer, all Stewards, and the designated emergency contact (usually set by Organizer).

**Q: Do incident reports show up in search results?**
A: No, only in the event's audit trail. They're private by default.

**Q: Can I report an incident from a past event?**
A: Yes, up to 30 days afterward. Helps with follow-up and pattern tracking.

**Q: What if an incident needs professional help?**
A: Critical incidents automatically alert designated professionals. You can also manually request professional assistance.

---

### Assistance Request Questions

**Q: How long can an assistance request stay open?**
A: Maximum 7 days. After that, it auto-closes and you're asked if you still need help.

**Q: What if nobody offers help?**
A: You can extend the deadline or ask specific people directly through the app.

**Q: Can someone offer help multiple times?**
A: No, one offer per person per request. They can withdraw their offer if needed.

**Q: Do helpers see my personal information?**
A: Only what you put in the request. Phone numbers, addresses need to be shared separately.

**Q: Can I request help for someone else?**
A: Yes if you have event management permissions. They'll be notified.

---

## 🔧 TROUBLESHOOTING

### "Can't see the buttons to assign roles/report incidents"

**Solution:**
1. Refresh the page (`Ctrl+R` or `Cmd+R`)
2. Make sure you have permission (Organizer or Steward)
3. Clear browser cache and try again
4. Update browser to latest version

**Still not working?** → Contact support with event ID

---

### "Role assignment won't submit"

**Check:**
- ✓ Did you select a person from the dropdown (not just typing)?
- ✓ Did you select a role?
- ✓ Is the submit button active (not grayed out)?
- ✓ Do you have permission to assign roles?

**Try:**
1. Refresh the page
2. Try assigning to a different person first
3. Try a different browser
4. Clear browser cache

**Still stuck?** → Copy the person's name and contact support

---

### "Incident report disappeared after I submitted"

**This is normal!** It takes 2-5 seconds to save. Look for the checkmark in the top-right corner.

**If it's still not there:**
1. Refresh the page - it should reappear
2. Check the "Recent Incidents" tab
3. Look in the event's audit trail

**Report shows deleted?** → It's archived, not deleted. Contact support if you need recovery.

---

### "Not getting notifications about roles/incidents"

**Check notification settings:**
1. Go to Settings → Notifications
2. Make sure "Calendar Alerts" is ON
3. Check "Role Assignment Notifications" is enabled
4. Check "Incident Notifications" is enabled

**For mobile:**
1. Go to phone Settings
2. Find the app → Permissions → Notifications
3. Make sure notifications are allowed

**Reset notifications:**
1. Settings → Clear Cache
2. Refresh browser/app
3. Try again

---

### "Assistance request shows wrong person"

**This usually means:**
- Person accepted the request, then switched their name in profile
- System cached the old name

**Fix:**
1. Refresh the page
2. Navigate away and back to the event
3. Clear cache and refresh

**Still wrong?** → Contact support with the request ID

---

### "Keyboard shortcuts aren't working"

**Check:**
- ✓ Are you in an input field? (Shortcuts don't work in text boxes)
- ✓ Did you press the right modifier key (Alt, Ctrl, Shift)?
- ✓ Is your keyboard layout standard US/UK?

**Try:**
1. Click somewhere outside the form (but still in the page)
2. Then try the shortcut
3. Try without modifiers first (like just `R` for assign role)

**Some shortcuts not working?**
- Your browser or OS might have conflicts
- Try different shortcuts from the list
- Use mouse as backup

---

### "App is slow/laggy"

**Try:**
1. Close other browser tabs
2. Refresh the page (`Ctrl+R`)
3. Clear browser cache (Settings → Clear Data)
4. Close and reopen the browser
5. Try different browser (Chrome vs Firefox vs Safari)

**If still slow:**
- Check your internet connection (should be > 5 Mbps)
- Move closer to WiFi router
- Restart your router
- Contact support if issue persists

---

## 📞 SUPPORT & CONTACT

### Getting Help

**Quick questions?**
- Check this guide (search for keywords)
- Visit FAQ section above

**Found a bug?**
- Note what you were doing
- Screenshot the error
- Email support@salatiso.com with details

**Can't access feature?**
- Check your permission level (you need Organizer or Steward for most features)
- Make sure you're in the right event
- Try logging out and back in

**Still stuck?**
- Contact: support@salatiso.com
- Include: event name, date, what you were trying to do
- Attach screenshot if possible

### Feedback

**Love the new features?** Tell us!
- Email: feedback@salatiso.com
- Tell us which feature you like most
- Suggest improvements

**Having trouble?** We want to know!
- Report issues through Settings → Report Problem
- Include "Calendar Phase 1" in subject line
- Describe what went wrong

---

## 📝 ROLE-SPECIFIC QUICK GUIDES

### For Organizers (Event Leaders)

**Your primary responsibilities:**
- Create events and set the calendar
- Assign roles to people
- Monitor incidents
- Make final decisions on issues

**Key actions:**
```
1. Create event → 2. Assign roles → 3. Monitor incidents → 4. Track completion
```

**Top features to use:**
- ✅ Assign Role (to delegate responsibilities)
- ✅ View Incident Log (to track issues)
- ✅ Monitor Responses (who accepted/declined)

**Keyboard shortcut:** `R` (in event view to assign roles)

---

### For Participants (Attendees)

**Your primary responsibilities:**
- Attend your assigned role
- Report issues if something goes wrong
- Accept/decline role invitations
- Help others if you can

**Key actions:**
```
1. Review role → 2. Accept/Decline → 3. Attend event → 4. Report issues if needed
```

**Top features to use:**
- ✅ View My Roles (to see your assignments)
- ✅ Respond to Role (to accept/decline)
- ✅ Report Issue (if something goes wrong)
- ✅ Offer Help (if you see a request)

**Keyboard shortcut:** `I` (to report incidents)

---

### For Supporters (Resource Providers)

**Your primary responsibilities:**
- Provide resources or materials
- Offer assistance when requests come in
- Be responsive to the coordinator

**Key actions:**
```
1. See requests → 2. Offer help → 3. Confirm acceptance → 4. Deliver help
```

**Top features to use:**
- ✅ Watch for Assistance Requests (see `?` icon)
- ✅ Offer Help (click offer button)
- ✅ Accept Help Offer (when selected)
- ✅ Mark as Complete (when done)

**Keyboard shortcut:** `H` (to see requests)

---

### For Stewards (Coordinators)

**Your primary responsibilities:**
- Coordinate overall event
- Manage escalations
- Handle critical incidents
- Make key decisions

**Key actions:**
```
1. Monitor incidents → 2. Escalate if needed → 3. Respond to issues → 4. Track resolution
```

**Top features to use:**
- ✅ View All Incidents (see everything)
- ✅ Escalate Issue (move to higher level)
- ✅ Monitor Roles (ensure accountability)
- ✅ Override Decisions (if needed)

**Keyboard shortcut:** `I` (to access incident management)

---

## ✅ TRAINING CHECKLIST

**Before the family briefing, make sure you can:**

### Role Assignment
- [ ] Understand the 4 roles (Organizer, Participant, Supporter, Steward)
- [ ] Know the difference between roles
- [ ] Assign a role to someone
- [ ] Track role status (Assigned → Accepted → Completed)
- [ ] Cancel or modify a role assignment

### Incident Logging
- [ ] Know the 5 issue categories (Health, Safety, Behavioral, Logistics, Other)
- [ ] Know the 4 severity levels (Critical, High, Medium, Low)
- [ ] Understand auto-escalation
- [ ] Report a test incident
- [ ] Understand who gets notified

### Assistance Requests
- [ ] Know the 6 assistance types
- [ ] Understand the workflow (Request → Offer → Accept → Complete)
- [ ] Post an assistance request
- [ ] Accept/decline offers
- [ ] Complete a request

### Keyboard Shortcuts
- [ ] Try Alt+N to create new event
- [ ] Try R to assign roles
- [ ] Try I to report incidents
- [ ] Try H to see assistance requests

### Accessibility
- [ ] Tab through the form with keyboard only
- [ ] Use Screen Reader if available
- [ ] Test in high contrast mode
- [ ] Verify on mobile device

---

## 📊 TRAINING MATERIALS INCLUDED

### For Different Learning Styles

**Visual Learners:** 
- Diagrams and flowcharts throughout
- Screenshots of UI (reference below)
- Color-coded status indicators

**Written Learners:**
- Detailed step-by-step procedures
- FAQs and explanations
- Role-specific guides

**Hands-On Learners:**
- Practice exercises
- Scenarios with real examples
- Troubleshooting guides

**Auditory Learners:**
- Videos available (2-3 min each)
- In-person briefing Oct 23
- Q&A during training

---

## 🎓 SELF-ASSESSMENT

**After reading this guide, you should know:**

- ✅ What the 3 new features do
- ✅ When to use each feature
- ✅ How to use each feature
- ✅ Who can see what information
- ✅ How to use keyboard shortcuts
- ✅ How accessibility features work
- ✅ Where to get help if stuck

**If you don't know these things, re-read the sections or ask for training.**

---

## 🎉 YOU'RE READY!

You now have all the knowledge needed to:

1. ✅ Assign roles to event participants
2. ✅ Report incidents safely with automatic escalation
3. ✅ Request and offer assistance
4. ✅ Navigate with keyboard for accessibility
5. ✅ Troubleshoot common issues

**Questions during the briefing?** Ask! We're here to help.

**Need more help?** Contact support@salatiso.com

---

## 📌 APPENDIX

### Appendix A: Permission Matrix

| Action | Organizer | Participant | Supporter | Steward |
|--------|-----------|-------------|-----------|---------|
| Assign roles | ✅ | ❌ | ❌ | ✅ |
| Edit event details | ✅ | ❌ | ❌ | ✅ |
| Delete event | ✅ | ❌ | ❌ | ❌ |
| Report incidents | ✅ | ✅ | ✅ | ✅ |
| Escalate incidents | ✅ | ❌ | ❌ | ✅ |
| Request assistance | ✅ | ✅ | ✅ | ✅ |
| Offer assistance | ✅ | ✅ | ✅ | ✅ |
| View all incidents | ✅ | ❌ | ❌ | ✅ |
| Override decisions | ❌ | ❌ | ❌ | ✅ |

### Appendix B: Escalation Matrix

| Severity | Auto-Escalates? | Goes To | Timeline |
|----------|-----------------|---------|----------|
| Critical | ✅ YES | Organizer, Steward, Professional | Immediate |
| High | ✅ YES | Organizer, Supervisor | 15 minutes |
| Medium | ❌ NO | Next available reviewer | 1 hour |
| Low | ❌ NO | On-call staff | When possible |

### Appendix C: Status Definitions

| Status | Meaning | Next Step |
|--------|---------|-----------|
| Assigned | Role sent, awaiting response | Person reviews and responds |
| Accepted | Person confirmed they'll participate | Prepare for their arrival |
| In Progress | Actively happening now | Complete after event |
| Completed | Successfully finished | Archive and close |
| Declined | Person can't or won't participate | Reassign to someone else |
| Unconfirmed | No response after 7 days | Send reminder or reassign |

---

**Document Version:** 1.0 | **Last Updated:** October 23, 2025 | **Status:** Ready for Family Briefing

---

*This guide is part of the Calendar Enhancement Phase 1. For the latest version and updates, visit your calendar app or contact support.*
