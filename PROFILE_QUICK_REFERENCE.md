# Profile System - Quick Reference Guide

## 🎯 Quick Start

### Accessing Your Profile
1. Log in to MNI Intranet
2. Click "Profile" in the sidebar navigation
3. Your profile loads with current information

### First Steps
- [ ] Add profile pictures (up to 5)
- [ ] Complete personal information
- [ ] Complete professional information
- [ ] Export profile for backup
- [ ] Sync with LifeSync

---

## 📸 Picture Management

### Upload Pictures
| Action | Steps |
|--------|-------|
| Upload Single | Click "Select Pictures" → Choose file → Auto-added |
| Upload Multiple | Drag-drop multiple files → All added at once |
| Set Primary | Hover picture → Click ✓ checkmark |
| Delete Picture | Hover picture → Click 🗑️ trash icon |
| View Details | Hover picture → See upload date & filename |

### Picture Requirements
- **Format**: JPG, PNG, GIF
- **Size**: Max 10MB per picture
- **Count**: Up to 5 total pictures
- **Primary**: Always have 1 primary picture
- **Position**: Gallery displays all pictures with primary badge

---

## 📊 Profile Completion Tracker

### Understanding Percentages

```
Personal Info:      80%  (4 of 5 fields completed)
Professional:       75%  (3 of 4 fields completed)
Media:               0%  (0 of 5 pictures uploaded)
Documents:           0%  (0 of 3 documents added)
─────────────────────────
Overall Progress:   41%  (7 of 17 total items)
```

### How to Improve Completion
1. **Personal Info → 100%**
   - Add all personal details
   - Fill bio/biography
   - Add contact information

2. **Professional → 100%**
   - Enter current position
   - Add organization name
   - Set join date

3. **Media → Increase**
   - Upload profile pictures
   - Add portfolio images
   - Each picture = 20% progress

---

## 💾 File Management

### Export Profile (Backup)
```
Button: [Export Profile]
↓
Downloads: profile-[YourName]-[timestamp].json
Contains: Personal info, Professional info, Media list, Completion status
Use for: Backup, Sync with LifeSync, Restore later
```

### Import Profile (Restore)
```
Button: [Import Profile]
↓
Select: Previously exported .json file
↓
Updates: Personal info, Professional info, Picture list
```

### Export Format
```json
{
  "personal": { /* all personal info */ },
  "professional": { /* all professional info */ },
  "media": { /* picture metadata */ },
  "completion": { /* completion percentages */ },
  "exportedAt": "2025-10-26T10:30:00Z",
  "version": "1.0",
  "platform": "MNI-Intranet"
}
```

---

## 🔄 LifeSync Integration

### What is LifeSync?
LifeSync is the comprehensive home for your LifeCV (Life Curriculum Vitae). It provides:
- Complete career history
- Educational background
- Skills and certifications
- Publications and projects
- Full professional identity

### How to Sync

#### Step 1: Export from MNI Intranet
```
Profile Page → [Export Profile] → profile-[name]-[date].json downloaded
```

#### Step 2: Go to LifeSync
```
Visit: https://lifesync.example.com
Log in with same credentials
Click: Import Profile
```

#### Step 3: Upload Profile
```
Select: profile-[name]-[date].json
Click: Upload/Import
```

#### Step 4: View Stats
```
Back to MNI Intranet Profile
See: Last Sync status, Platform info, Sync timestamp
```

### Benefits of Syncing
✅ Unified professional identity  
✅ Single source of truth (LifeSync)  
✅ Multiple platform access  
✅ Automatic backup  
✅ Real-time statistics  

---

## 🔒 Security & Privacy

### Picture Storage
- **Where**: Browser localStorage (client-side)
- **Encryption**: Base64 encoded
- **Access**: Only you (via your account)
- **Backup**: Download JSON exports

### Personal Information
- **Stored**: Encrypted in browser storage
- **Transmitted**: HTTPS only
- **Shared**: Only when you export/sync
- **Deleted**: Clear cache to remove

### File Uploads
- All files processed client-side
- No server-side storage of original files
- Metadata only stored in export
- Clear browser data to completely remove

---

## ⚡ Tips & Tricks

### Pro Tips
1. **Primary Picture Matters**
   - Used as avatar across platform
   - Choose professional photo
   - Update occasionally

2. **Regular Backups**
   - Export profile monthly
   - Store exports safely
   - Version control important updates

3. **Complete Information**
   - Higher completion % = Better profile
   - LifeSync recognizes completion
   - Improves profile visibility

4. **Picture Management**
   - Use high-quality images
   - Consistent professional style
   - Appropriate for business context
   - Optimize before upload

5. **Sync Strategy**
   - Start in MNI Intranet
   - Export minimum required
   - Complete in LifeSync (more features)
   - Sync back if major changes

---

## ❌ Troubleshooting

| Issue | Solution |
|-------|----------|
| **Picture won't upload** | Check: Format (JPG/PNG/GIF), Size (<10MB), Count (<5), Browser support |
| **Can't set primary** | Ensure picture fully uploaded, Try refresh, Clear cache |
| **Export file empty** | Fill profile info first, Save manually, Try export again |
| **Import fails** | Verify JSON format, Check file isn't corrupted, Try smaller export |
| **Sync not updating** | Check LifeSync is accessible, Verify export successful, Try manual sync |
| **Profile data lost** | Import from backup export, Restore from browser history, Contact support |

---

## 📋 Checklist: Complete Your Profile

### Essential (Required)
- [ ] Add your full name
- [ ] Add email address
- [ ] Add phone number
- [ ] Add location
- [ ] Upload at least 1 profile picture
- [ ] Set professional position/title

### Important (Recommended)
- [ ] Add professional organization
- [ ] Write professional bio/summary
- [ ] Upload 3-5 profile pictures
- [ ] Set join date
- [ ] Complete all bio fields

### Optional (Enhanced)
- [ ] Add experience history
- [ ] Add education background
- [ ] Add skills/certifications
- [ ] Add publications
- [ ] Link social profiles

### Sync Preparation
- [ ] Review all information
- [ ] Verify pictures are professional
- [ ] Test export functionality
- [ ] Check JSON file opens correctly
- [ ] Ready for LifeSync sync

---

## 🔗 Related Resources

- **Complete Documentation**: [PROFILE_SYSTEM_DOCUMENTATION.md](./PROFILE_SYSTEM_DOCUMENTATION.md)
- **LifeSync Home**: https://lifesync.example.com
- **MNI Intranet**: https://intranet.example.com
- **Support Email**: support@salatiso.com

---

## 📞 Getting Help

### Frequently Asked Questions

**Q: Can I change my primary picture?**
A: Yes, hover any picture and click the checkmark icon to make it primary.

**Q: What happens to my pictures when I export?**
A: Only metadata (name, upload date) is included in JSON. Pictures must be re-uploaded after import.

**Q: Can I have the same profile on multiple platforms?**
A: Yes! Export from MNI Intranet and import on LifeSync and other platforms.

**Q: Is my profile automatically synced?**
A: Not automatic - use Export/Import buttons to manually sync.

**Q: Can I revert to a previous profile version?**
A: Yes, keep your exports as backups and import any previous version.

**Q: What if I lose my browser data?**
A: Your profile is stored in exports. Import them to restore everything except original picture files.

---

## 📅 Version History

| Version | Date | Features |
|---------|------|----------|
| 1.0 | Oct 26, 2025 | Initial release with picture management, export/import, completion tracking |

---

**Last Updated**: October 26, 2025  
**Status**: Active & Fully Functional  
**Support**: contact@salatiso.com
