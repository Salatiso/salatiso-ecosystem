# 🔐 GitHub Backup Guide - Command Line Setup

## Your Current Situation
- ✅ You have `.git` folders (Git is already initialized)
- ✅ You have a GitHub account
- 🎯 Goal: Private backup and recovery

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Private Repository on GitHub

1. **Go to**: https://github.com/new
2. **Repository name**: `salatiso-react-app` (or your preferred name)
3. **Description**: "MNI Family Management - Phase 6 Complete"
4. **Visibility**: ⚠️ **PRIVATE** (very important!)
5. **DO NOT** initialize with README (you already have code)
6. **Click**: "Create repository"

### Step 2: Connect Your Local Code to GitHub

Open PowerShell in your project folder and run:

```powershell
# Navigate to your project
cd "D:\WebSites\salatiso-ecosystem\Salatiso-React-App"

# Check current Git status
git status

# Add GitHub as remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/salatiso-react-app.git

# Verify remote was added
git remote -v

# Create main branch if needed
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Important**: When prompted for credentials, use:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (NOT your password)

### Step 3: Create GitHub Personal Access Token

If you don't have a token yet:

1. **Go to**: https://github.com/settings/tokens
2. **Click**: "Generate new token" → "Generate new token (classic)"
3. **Note**: "Salatiso Backup Access"
4. **Expiration**: 90 days (or No expiration)
5. **Scopes**: Check ✅ `repo` (full control of private repositories)
6. **Click**: "Generate token"
7. **COPY THE TOKEN** - you won't see it again!
8. **Save it** in a secure place (password manager recommended)

---

## 📦 Daily Backup Routine

### Quick Backup (Every Time You Finish Work)

```powershell
# Navigate to project
cd "D:\WebSites\salatiso-ecosystem\Salatiso-React-App"

# Check what changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Phase 6 complete - Analytics, Collaboration, AI features deployed"

# Push to GitHub
git push
```

### Or Use This One-Liner:
```powershell
git add . && git commit -m "Backup: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" && git push
```

---

## 🔄 Recovery (If You Need to Restore)

### On Same Computer (Restore Previous Version)
```powershell
# See commit history
git log --oneline

# Restore to a specific commit (copy the commit hash from log)
git checkout <commit-hash>

# Or just undo last commit (keeps changes)
git reset --soft HEAD~1
```

### On Different Computer (Clone Repository)
```powershell
# Clone your private repo
git clone https://github.com/YOUR-USERNAME/salatiso-react-app.git

# Navigate into it
cd salatiso-react-app

# Install dependencies
npm install

# You're back in business!
```

---

## 🛡️ .gitignore Setup (Don't Backup These)

Create/verify `.gitignore` file in your project root:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Production
.vercel
.netlify

# Environment variables (CRITICAL - NEVER COMMIT)
.env
.env.local
.env.production
.env.*.local
.env.development
.env.test

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log

# Python (if using)
.venv/
__pycache__/
*.py[cod]

# Temporary files
*.log
*.cache
.cache/
```

**Critical**: Make sure `.env` files are in `.gitignore` - NEVER commit API keys!

---

## 🎯 Best Practices

### ✅ DO:
- Commit often (multiple times per day)
- Write clear commit messages
- Keep repository PRIVATE for your code
- Use `.gitignore` for sensitive files
- Push to GitHub at end of each work session

### ❌ DON'T:
- Commit `.env` files (API keys, secrets)
- Commit `node_modules/` (dependencies)
- Commit `.next/` or `out/` (build files)
- Make repository public if it has sensitive data
- Share your Personal Access Token

---

## 🔧 Troubleshooting

### "Repository already exists"
```powershell
# Check if remote already exists
git remote -v

# If it shows old remote, remove it
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR-USERNAME/salatiso-react-app.git
```

### "Authentication Failed"
- Use **Personal Access Token**, NOT your password
- Token needs `repo` scope
- Generate new token at: https://github.com/settings/tokens

### "Nothing to commit"
```powershell
# This is good! It means everything is already backed up
git status
# Should show: "nothing to commit, working tree clean"
```

### "Merge Conflict"
```powershell
# If you edited files on GitHub website and locally
git pull --rebase
# Resolve conflicts in your editor
git add .
git rebase --continue
```

---

## 📊 Check Your Backup Status

```powershell
# See commit history
git log --oneline -10

# See what's changed since last commit
git status

# See changes in files
git diff

# See remote repository info
git remote -v
```

---

## 🎁 Bonus: Automatic Backup Script

Create `backup.ps1` in your project root:

```powershell
# backup.ps1 - Automatic Git Backup Script
param(
    [string]$Message = "Auto backup: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

Write-Host "🔄 Starting backup..." -ForegroundColor Cyan

# Check for changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ No changes to backup" -ForegroundColor Green
    exit 0
}

# Backup process
Write-Host "📦 Adding files..." -ForegroundColor Yellow
git add .

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $Message

Write-Host "☁️ Pushing to GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backup complete!" -ForegroundColor Green
} else {
    Write-Host "❌ Backup failed!" -ForegroundColor Red
    exit 1
}
```

**Usage**:
```powershell
# Simple backup
.\backup.ps1

# Backup with custom message
.\backup.ps1 -Message "Phase 6 complete"
```

---

## 🎯 Your First Backup (Right Now!)

```powershell
# 1. Navigate to your project
cd "D:\WebSites\salatiso-ecosystem\Salatiso-React-App"

# 2. Check status
git status

# 3. Create .gitignore if missing (see template above)
# Use: notepad .gitignore

# 4. Add everything
git add .

# 5. First commit
git commit -m "Phase 6 Complete - Analytics, Collaboration, AI features deployed to staging"

# 6. Create GitHub repo (do this in browser first - see Step 1)

# 7. Connect to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/salatiso-react-app.git

# 8. Push to GitHub
git push -u origin main
```

---

## 📞 Need Help?

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Help**: https://docs.github.com/en/github
- **Personal Access Tokens**: https://github.com/settings/tokens

---

**Remember**: 
- ✅ Keep repo PRIVATE
- ✅ Never commit `.env` files
- ✅ Push to GitHub daily
- ✅ Your code is safe in the cloud!

---

**Created**: October 23, 2025  
**For**: MNI Salatiso Ecosystem Backup  
**Status**: Ready to use! 🚀
