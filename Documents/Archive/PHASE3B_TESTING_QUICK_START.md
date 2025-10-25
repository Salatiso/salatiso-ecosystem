# Phase 3B Dashboard - Quick Testing Guide

## 🚀 How to Access the New Dashboard

1. **Start the app:** `npm run dev`
2. **Login** (if not already): Use your Firebase credentials
3. **Navigate to:** `http://localhost:3000/dashboard`

---

## 🧪 Quick Test Scenarios

### Test 1: Context Switching
1. Load dashboard
2. Click on each context button:
   - 👤 Personal (shows: Welcome, Ecosystem, Gamification, Career)
   - 💼 Professional (shows: Welcome, Projects, Career, Ecosystem)
   - 👨‍👩‍👧‍👦 Family (shows: Welcome, Family Overview, Achievements)
   - ⚙️ Admin (shows: Welcome, System Health, Projects, Metrics)
3. ✅ Verify different widgets appear for each context
4. ✅ Verify page is responsive during switching

### Test 2: Responsive Design
1. Open dashboard in different viewport sizes:
   - 📱 Mobile (320px): Should be single column, horizontal context scroll
   - 📱 Mobile (480px): Single column layout
   - 📱 Tablet (768px): 8-column grid
   - 🖥️ Desktop (1024px): Full 12-column grid
   - 🖥️ Large Desktop (1280px): Centered layout
2. ✅ Verify layout adapts smoothly at each breakpoint
3. ✅ Verify no horizontal overflow on mobile

### Test 3: Dark Mode
1. Open browser DevTools
2. Add `dark-mode` class to html element (or use toggle if available)
3. ✅ Verify background changes to dark gray
4. ✅ Verify text changes to light color
5. ✅ Verify all widgets have dark mode styling
6. ✅ Verify transitions are smooth

### Test 4: Widget Rendering
1. Load each context and verify:
   - **Welcome Widget**: Shows personalized greeting and XP info
   - **Ecosystem Health**: Shows health %, apps count, team members
   - **Project Timeline**: Shows upcoming projects with deadlines
   - **Career Progress**: Shows career path and skills
   - **Gamification**: Shows trust score and achievements
2. ✅ All widgets should have content
3. ✅ No console errors

### Test 5: Mobile Experience
1. Resize to mobile (< 768px)
2. ✅ Header hamburger menu should appear
3. ✅ Context buttons should scroll horizontally
4. ✅ All widgets should stack vertically
5. ✅ Text should be readable (no overflow)

### Test 6: Special Modes
1. **Kids Mode Test**:
   - Toggle kids mode in preferences
   - ✅ Should see "👶 Kids Mode" badge in header
   - ✅ Dashboard should revert to personal context
   
2. **Admin Context Test**:
   - Switch to admin context
   - ✅ Should see "⚙️ Admin" badge in header

### Test 7: Loading States
1. Open dashboard while Firestore is slow/offline
2. ✅ Should show loading spinner
3. ✅ Should show "Loading dashboard..." text
4. ✅ Spinner should animate smoothly

### Test 8: Keyboard Navigation
1. Open dashboard
2. Press Tab repeatedly
3. ✅ Should see focus outline on context buttons
4. ✅ Should be able to navigate all interactive elements
5. ✅ Tab order should be logical (left to right)

---

## 🎨 Visual Checklist

### Header Section
- [ ] Logo/branding visible
- [ ] Context switcher buttons visible
- [ ] Header has subtle shadow
- [ ] Mobile hamburger menu appears below 768px
- [ ] Mobile context buttons scroll horizontally

### Widget Grid
- [ ] Widgets have proper spacing
- [ ] No horizontal overflow
- [ ] All 5 widgets render correctly
- [ ] Widget cards have subtle shadow
- [ ] Widgets responsive to window resize

### Content Quality
- [ ] Text is readable (good contrast)
- [ ] Icons display correctly
- [ ] Colors match design system
- [ ] No broken layouts
- [ ] No text cutoff

### Footer
- [ ] Copyright text visible
- [ ] Proper spacing from content
- [ ] Matches header styling

---

## 🔧 Console Checks

Open DevTools (F12) → Console tab and verify:

1. **No Red Errors**: Should see only info/warnings, no errors
2. **Firebase Messages**: May see "Firestore: (internal) pre-loaded document" - that's fine
3. **No 404s**: Check Network tab for missing assets
4. **No XSS Warnings**: Should be none

---

## 📱 Responsive Breakpoints to Test

| Device | Width | Grid Cols | Context Scroll | Expected |
|--------|-------|-----------|-----------------|----------|
| iPhone 12 | 390px | 1 | Yes | Single column, horizontal scroll |
| iPad | 810px | 8 | No | 8-column grid |
| Desktop | 1024px | 12 | No | 12-column grid |
| Large | 1440px | 12 | No | 12-col, centered |

---

## 🎯 Expected Widget Placement per Context

### Personal Context
```
[ Welcome (6 cols) ] [ Ecosystem (6 cols) ]
[ Gamification (6 cols) ] [ Career (6 cols) ]
```

### Professional Context
```
[ Welcome (6 cols) ] [ Projects (6 cols) ]
[ Career (6 cols) ] [ Ecosystem (6 cols) ]
```

### Family Context
```
[ Welcome (8 cols) ] [ Family Overview (4 cols) ]
[ Achievements (12 cols) ]
```

### Admin Context
```
[ Welcome (6 cols) ] [ System Health (6 cols) ]
[ Projects (6 cols) ] [ Metrics (6 cols) ]
```

---

## 🚨 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Widgets not loading | Firestore not connected | Check Firebase config, ensure logged in |
| Layout broken on mobile | CSS not imported | Check dashboard.css is imported in UnifiedDashboard |
| Context buttons not working | State not updating | Check browser console for errors |
| Dark mode doesn't work | CSS class not applied | Check if document.documentElement has 'dark' class |
| Grid looks wrong | Browser zoom | Reset zoom to 100% (Ctrl+0) |
| Text too small | Mobile viewport | Check viewport meta tag in page head |

---

## ✅ Sign-Off Checklist

Before saying "Phase 3B is ready":

- [ ] Dashboard loads without errors
- [ ] All 4 contexts work
- [ ] All 5 widgets render
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Dark mode works (if implemented)
- [ ] No console errors
- [ ] Keyboard navigation works
- [ ] Mobile experience is good
- [ ] Loading state displays correctly
- [ ] Page takes < 2 seconds to fully load

---

## 📊 Performance Targets

| Metric | Target | How to Check |
|--------|--------|-------------|
| First Paint | < 1s | DevTools → Performance tab |
| Full Load | < 2s | DevTools → Network tab |
| Interactions | Immediate | Click context buttons (should be instant) |
| No Janky Animations | 60fps | DevTools → Rendering |

---

## 🐛 Bug Reporting Format

If you find an issue:

```
Title: [Context/Feature] - Description

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
...

Actual Result:
...

Browser/Device:
...

Console Errors:
...

Screenshots:
[if applicable]
```

---

## 📞 Questions?

Common questions and answers:

**Q: Why is the dashboard blank?**
A: You probably need to login first. Go to home page and login with Firebase.

**Q: Why are widgets in different positions?**
A: Different contexts show different widgets in different positions. This is intentional.

**Q: Why is it slow to load?**
A: First load may be slow as Firestore loads preferences. Subsequent loads are cached.

**Q: Can I customize widget positions?**
A: Not yet - this is planned for Phase 3C (advanced customization).

**Q: Why is dark mode not working?**
A: Dark mode is stored in Firestore preferences. Toggle via the context system.

---

## 🎉 Ready to Test!

The Phase 3B dashboard foundation is complete and ready for testing. All components are in place, TypeScript validated, and responsive design implemented.

**Next Steps:**
1. Test the dashboard thoroughly
2. Get feedback from family members
3. Plan Phase 3A integration (escalation widgets)
4. Schedule polish and deployment

Good luck! 🚀
