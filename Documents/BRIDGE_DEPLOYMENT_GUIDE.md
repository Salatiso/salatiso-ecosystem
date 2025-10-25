# Bridge Site Deployment Guide
**Date:** October 14, 2025  
**Site:** salatiso.com Bridge Page  
**Status:** Ready for Production Deployment

---

## 📋 Overview

The bridge site connects the legacy HTML site (https://salatiso.com/salatiso/) with the new React ecosystem (https://salatiso-lifecv.web.app/). It tells the holistic story from rural Transkei roots to a living family empowerment ecosystem.

---

## ✅ Changes Implemented (October 14, 2025)

### 1. **Story Updates**
- ✅ Changed birth year from 1985 to **1982** (correct birth year)
- ✅ Updated hero section to emphasize family legacy over technical journey
- ✅ Rewrote "Why This Story Matters" → "From Rural Roots to a Living Ecosystem"
- ✅ Added three-paragraph narrative arc:
  - Rural Transkei beginnings → independence → law dropout
  - OHS career → corporate leadership → personal mission
  - Books as building blocks → ecosystem as continuation of Ubuntu

### 2. **Icon/Visual Updates**
- ✅ Replaced 👨‍👦 emoji with brown Font Awesome icon (`fa-hand-holding-heart`) in "Father's Mission" card
- ✅ Color: `#4a2c2a` (legacy brown) to represent cultural identity

### 3. **Links Corrected**
- ✅ Changed `/salatiso/` → `https://salatiso.com/salatiso/` (legacy site)
- ✅ Added Flamea link to footer navigation
- ✅ Updated all book purchase links to Google Play, Apple Books, Amazon

### 4. **Book Covers**
- ✅ Replaced emoji placeholders with real book cover images from `/images/` folder
- ✅ 9 books featured in carousel:
  1. Goliath's Reckoning
  2. The Homeschooling Father
  3. Beyond Redress
  4. Safety First: OHS Career
  5. Getting to Know Yourself
  6. Beyond the Grave
  7. Safety First: OHS Plans
  8. Modern, Broke, and Confused
  9. The Perfect Cage: Book 1

### 5. **Books Section**
- ✅ Updated intro: "The journey from lived experience to ecosystem was crystallised in books..."
- ✅ Added YouTube audiobooks button
- ✅ Enhanced purchase links with direct book URLs

### 6. **Footer**
- ✅ Updated tagline: "From family legacy to digital ecosystem. Rooted in Ubuntu, built with purpose, shared with all."

---

## 📂 Files to Deploy

### Primary File:
```
public/bridge/index.html (1,015 lines)
```

### Required Assets:
```
images/
├── goliath.jpg
├── homeschooling_father.jpg
├── redress.jpg
├── SF_Career.jpg
├── Unravelling_Xhosa_History.jpg
├── Beyond_the_Grave.jpg
├── SF_Plans.jpg
├── Modern_Broke.jpg
├── The_Perfect_Cage1.jpg
└── (additional book covers as needed)
```

---

## 🚀 Deployment Options

### **Option 1: Manual Upload via Namecheap cPanel (Current Method)**

#### Steps:
1. **Login to Namecheap cPanel**
   - Go to https://www.namecheap.com/myaccount/login/
   - Navigate to your hosting dashboard
   - Click "cPanel"

2. **Access File Manager**
   - Open File Manager
   - Navigate to `public_html/` (or your domain's root directory)

3. **Upload Files**
   - Upload `public/bridge/index.html` → rename to `index.html` (replaces existing)
   - Create `/images/` folder if it doesn't exist
   - Upload all book cover images to `/images/`

4. **Verify**
   - Visit https://salatiso.com/ to confirm bridge page loads
   - Test legacy link: https://salatiso.com/salatiso/
   - Test all book purchase links
   - Check responsive behavior on mobile

---

### **Option 2: FTP Deployment (Recommended for Future)**

#### Tools Needed:
- **FileZilla** (free FTP client): https://filezilla-project.org/
- FTP credentials from Namecheap

#### Setup:
1. **Get FTP Credentials**
   - Login to Namecheap cPanel
   - Go to "FTP Accounts"
   - Create/view FTP account credentials:
     - **Host:** ftp.salatiso.com (or similar)
     - **Username:** your-ftp-username
     - **Password:** your-ftp-password
     - **Port:** 21 (standard FTP)

2. **Connect with FileZilla**
   - Open FileZilla
   - File → Site Manager → New Site
   - Enter credentials above
   - Protocol: FTP
   - Encryption: Use explicit FTP over TLS if available
   - Connect

3. **Upload Files**
   - Local site (left): Navigate to `d:\WebSites\salatiso-ecosystem\Salatiso-React-App\public\bridge\`
   - Remote site (right): Navigate to `public_html/`
   - Drag `index.html` to server (overwrite existing)
   - Drag `/images/` folder to server

4. **Automated Script (Optional)**
   - PowerShell FTP script can be created for one-click deployment
   - Let me know if you want this

---

### **Option 3: Git Deployment (Advanced)**

If Namecheap supports Git hooks:
1. Initialize Git repo in `public_html/`
2. Push from local repo
3. Server pulls changes automatically

*(Check Namecheap hosting plan for Git support)*

---

## 🧪 Pre-Deployment Testing

### Local Testing (Already Done):
- ✅ Served via Python HTTP server on port 8080
- ✅ Viewed in Simple Browser (http://localhost:8080)

### Post-Deployment Testing:
- [ ] Test on Chrome, Firefox, Edge
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Verify all links work:
  - [ ] Legacy site: https://salatiso.com/salatiso/
  - [ ] Web app: https://salatiso-lifecv.web.app/
  - [ ] Book purchase links (Google Play, Apple Books, Amazon)
  - [ ] YouTube audiobooks
  - [ ] SafetyFirst, Sazi, Flamea venture links
- [ ] Check responsive design at breakpoints: 320px, 768px, 1024px, 1440px
- [ ] Validate HTML: https://validator.w3.org/
- [ ] Test page load speed: https://pagespeed.web.dev/

---

## 📊 File Structure on Server

After deployment, your server should have:

```
public_html/
├── index.html               ← Bridge page (updated today)
├── images/                  ← Book covers
│   ├── goliath.jpg
│   ├── homeschooling_father.jpg
│   ├── redress.jpg
│   ├── SF_Career.jpg
│   ├── SF_Plans.jpg
│   ├── Unravelling_Xhosa_History.jpg
│   ├── Beyond_the_Grave.jpg
│   ├── Modern_Broke.jpg
│   └── The_Perfect_Cage1.jpg
└── salatiso/                ← Legacy site (existing, do not modify)
    └── index.html
    └── (legacy assets)
```

---

## 🔧 Troubleshooting

### Issue: Images not loading
- **Cause:** Incorrect path in HTML
- **Fix:** Ensure images are in `/images/` folder on server
- **Path in HTML:** `../images/bookname.jpg` (relative path from `/public/bridge/`)
- **Path on server:** `/public_html/images/bookname.jpg`

### Issue: Legacy link broken
- **Cause:** Link pointing to `/salatiso/` instead of full URL
- **Fix:** Already corrected to `https://salatiso.com/salatiso/`

### Issue: Books carousel not scrolling
- **Cause:** CSS animation not loading
- **Fix:** Check `@keyframes scroll-left` in `<style>` section (already present)

---

## 📝 Next Steps

1. **Today:** Manual upload via Namecheap cPanel
2. **This Week:** Test across browsers and devices
3. **Future:** Set up FTP script for one-click deployment
4. **Future:** Update React app journey page to match bridge narrative

---

## 📧 Support

- **Namecheap Support:** https://www.namecheap.com/support/
- **cPanel Guide:** Usually accessed via Namecheap dashboard
- **FTP Issues:** Check Namecheap FTP documentation

---

## ✅ Deployment Checklist

Before uploading:
- [x] All changes implemented
- [x] Local testing completed
- [ ] Book cover images ready in `/images/` folder
- [ ] Backup existing `index.html` on server (just in case)

After uploading:
- [ ] Visit https://salatiso.com/ - bridge page loads
- [ ] Click "Legacy Site" - goes to https://salatiso.com/salatiso/
- [ ] Click "Launch New Web App" - goes to https://salatiso-lifecv.web.app/
- [ ] Test all book purchase links
- [ ] Test on mobile device
- [ ] Share with family for feedback

---

**Ready to deploy!** The bridge site now tells the complete story: from rural roots in 1982 to a living ecosystem in 2025. 

Impact over income. Ubuntu over ego. Family over everything.
