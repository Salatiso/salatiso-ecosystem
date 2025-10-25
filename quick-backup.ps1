# 🔄 Quick Backup Script for Salatiso-React-App
# Usage: .\quick-backup.ps1
# Or with custom message: .\quick-backup.ps1 -Message "My changes"

param(
    [string]$Message = "Backup: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "`n🔄 Starting Git Backup Process..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ ERROR: Not a git repository!" -ForegroundColor Red
    Write-Host "Run this script from your project root (D:\WebSites\salatiso-ecosystem\Salatiso-React-App)" -ForegroundColor Yellow
    exit 1
}

# Check for changes
Write-Host "`n📊 Checking for changes..." -ForegroundColor Yellow
$status = git status --porcelain

if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ No changes detected - Everything already backed up!" -ForegroundColor Green
    Write-Host "`n💡 Tip: Make some changes first, then run this script" -ForegroundColor Cyan
    exit 0
}

# Show what will be backed up
Write-Host "`n📝 Files to backup:" -ForegroundColor Yellow
git status --short

# Confirm backup
$confirm = Read-Host "`nBackup these changes? (Y/n)"
if ($confirm -eq "n" -or $confirm -eq "N") {
    Write-Host "❌ Backup cancelled" -ForegroundColor Yellow
    exit 0
}

# Stage all changes
Write-Host "`n📦 Adding files..." -ForegroundColor Yellow
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to add files" -ForegroundColor Red
    exit 1
}

# Commit changes
Write-Host "`n💾 Committing changes with message: '$Message'" -ForegroundColor Yellow
git commit -m $Message

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to commit changes" -ForegroundColor Red
    exit 1
}

# Push to GitHub
Write-Host "`n☁️ Pushing to GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ================================================" -ForegroundColor Green
    Write-Host "✅ Backup Complete! Your code is safe on GitHub 🎉" -ForegroundColor Green
    Write-Host "✅ ================================================`n" -ForegroundColor Green
    
    # Show last 5 commits
    Write-Host "📜 Recent backups:" -ForegroundColor Cyan
    git log --oneline -5
    
} else {
    Write-Host "`n❌ ================================================" -ForegroundColor Red
    Write-Host "❌ Backup Failed!" -ForegroundColor Red
    Write-Host "❌ ================================================" -ForegroundColor Red
    Write-Host "`n💡 Common fixes:" -ForegroundColor Yellow
    Write-Host "  1. Check your internet connection" -ForegroundColor White
    Write-Host "  2. Verify GitHub Personal Access Token is valid" -ForegroundColor White
    Write-Host "  3. Check if remote is configured: git remote -v" -ForegroundColor White
    Write-Host "  4. See GITHUB_BACKUP_GUIDE.md for help`n" -ForegroundColor White
    exit 1
}
