# Deploy to Both Firebase Hosting Sites
# Run this script to deploy to both lifecv-d2724.web.app AND salatiso-lifecv.web.app

Write-Host "`n🚀 DEPLOYING TO BOTH FIREBASE HOSTING SITES`n" -ForegroundColor Cyan

# Build the app first
Write-Host "📦 Building Next.js app..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Build failed! Please fix errors and try again.`n" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Build successful!`n" -ForegroundColor Green

# Deploy to lifecv-d2724 site
Write-Host "🌐 Deploying to lifecv-d2724.web.app..." -ForegroundColor Yellow
firebase deploy --only hosting:lifecv-d2724 --project lifecv-d2724

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Deployment to lifecv-d2724 failed!`n" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Deployed to lifecv-d2724.web.app`n" -ForegroundColor Green

# Deploy to salatiso-lifecv site  
Write-Host "🌐 Deploying to salatiso-lifecv.web.app..." -ForegroundColor Yellow
firebase deploy --only hosting:salatiso-lifecv --project lifecv-d2724

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Deployment to salatiso-lifecv failed!`n" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Deployed to salatiso-lifecv.web.app`n" -ForegroundColor Green

# Success summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "`n🎉 DEPLOYMENT COMPLETE!`n" -ForegroundColor Green
Write-Host "Your app is now live on both URLs:" -ForegroundColor White
Write-Host "  • https://lifecv-d2724.web.app" -ForegroundColor Cyan
Write-Host "  • https://salatiso-lifecv.web.app" -ForegroundColor Cyan
Write-Host "`nBoth sites have identical content and features.`n" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
