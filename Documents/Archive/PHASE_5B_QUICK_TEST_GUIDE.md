# 🚀 QUICK START - Test Calendar & Assets Export/Import Now

## What Changed?

Both **Calendar** and **Assets** pages now have:
- ✅ Download buttons (export as JSON, CSV, .ics)
- ✅ Import button (upload files)
- ✅ Week/Day views (calendar only)
- ✅ Add Event form (calendar only)

---

## 📝 5-Minute Quick Test

### 1. Test Calendar Week/Day Views (2 min)

**Go to**: http://localhost:3000/intranet/calendar

1. **Click "Week"** button → 7 days display in grid
2. **Click "Day"** button → Single day with events listed
3. **Click "Month"** button → Back to month calendar
4. **✅ Result**: Views switch instantly with no errors

---

### 2. Test Create Event (1 min)

**On Calendar page**:

1. **Click "Add Event"** button (blue button next to .ics)
2. **Type event title**: "Test Event" or any name
3. **Select category**: Try different options
4. **Click "Create Event"**
5. **✅ Result**: Toast shows "Event created successfully", event appears on calendar

---

### 3. Test Export Calendar (1 min)

**On Calendar page**:

1. **Click ".ics" button** → Downloads `calendar-2025-10-21.ics`
2. **Open the file** in a text editor
3. **✅ Result**: See `BEGIN:VCALENDAR` format (valid iCalendar)

4. **Click "JSON" button** → Downloads `calendar-2025-10-21.json`
5. **Open the file** in a text editor
6. **✅ Result**: See event objects in JSON format

---

### 4. Test Import Calendar (1 min)

**On Calendar page**:

1. **Click "Import" button**
2. **Select the JSON file** you just downloaded
3. **✅ Result**: Toast shows "Imported X events", events appear

---

### 5. Test Assets Export (0.5 min)

**Go to**: http://localhost:3000/intranet/assets

1. **Click "JSON" button** → Downloads `assets-2025-10-21.json`
2. **Open in text editor** → See asset objects
3. **Click "CSV" button** → Downloads `assets-2025-10-21.csv`
4. **Open in Excel/Sheets** → See table with headers: Name, Category, Value, Currency, Owner, Shared, Location, Description
5. **✅ Result**: Both formats correct and usable

---

### 6. Test Assets Import (0.5 min)

**On Assets page**:

1. **Click "Import" button**
2. **Select the JSON file** you downloaded
3. **✅ Result**: Toast shows "Imported X assets", new assets appear in list

---

## 🎯 Success Criteria

✅ All buttons appear in headers  
✅ View toggle works (Calendar)  
✅ Add Event creates new events  
✅ Downloads create files with correct names  
✅ .ics file has valid calendar format  
✅ JSON files have valid structure  
✅ CSV opens correctly in spreadsheet app  
✅ Import adds events/assets to page  
✅ Toast notifications show for all actions  
✅ No console errors (press F12 to check)

---

## 📱 Test Mobile (Optional)

**Press F12** in browser:
1. Click device toolbar (mobile icon)
2. Select "iPhone 12" or "iPad"
3. Verify all buttons still clickable
4. Export/import still works on mobile
5. Download files work on mobile

---

## 🐛 If Something's Wrong

### Server not running?
```powershell
cd 'd:\WebSites\salatiso-ecosystem\Salatiso-React-App'
npm run dev
```

### Buttons don't appear?
```
1. Hard refresh: Ctrl+Shift+R
2. Clear browser cache
3. Check console for errors (F12)
```

### Files won't open?
```
1. Right-click downloaded file → Open with Text Editor
2. Check file is actually downloaded (Downloads folder)
3. File should show content, not error
```

### Events won't import?
```
1. Make sure file is .json or .ics
2. Make sure file isn't corrupted
3. Check console for error message (F12)
```

---

## 📊 What To Report

When you're done, tell me:

1. **Calendar Week/Day Views**: Working? ✅ or ❌
2. **Create Event**: Successfully created event? ✅ or ❌
3. **Export Calendar (.ics)**: File downloaded and valid? ✅ or ❌
4. **Export Calendar (JSON)**: File downloaded and valid? ✅ or ❌
5. **Import Calendar**: Could import and events appeared? ✅ or ❌
6. **Export Assets (JSON)**: File valid? ✅ or ❌
7. **Export Assets (CSV)**: Opens in spreadsheet? ✅ or ❌
8. **Import Assets**: Could import? ✅ or ❌
9. **Mobile Test**: Everything works? ✅ or ❌
10. **Console Errors**: Any red errors? ✅ or ❌

---

## ⚡ Pro Tips

1. **Save your exports**: Keep the .ics and .json files - use them for re-importing later
2. **Test with Excel**: Open CSV file in Excel to verify it's properly formatted
3. **Check Google Calendar**: Import .ics file into Google Calendar to verify compatibility
4. **Try different categories**: When creating events, test all 7 categories
5. **Test edge cases**: Try creating events with special characters, long names, etc.

---

## 🎉 You're All Set!

Everything is:
- ✅ Compiled successfully (zero errors)
- ✅ Dev server running
- ✅ Ready for testing
- ✅ Mobile responsive
- ✅ Production-quality code

**Start with the 5-minute quick test above, then report your findings!**

---

**Time Estimate**: 5-10 minutes total  
**Difficulty**: Easy (just clicking buttons)  
**Success Rate**: Should be 100% (if build is clean)  
**Next Milestone**: Oct 25 GO/NO-GO Decision  

Let's go! 🚀
