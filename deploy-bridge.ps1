# Salatiso Bridge Site - Quick Deployment Script
# Run this script from the Salatiso-React-App directory

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Salatiso Bridge Site Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if bridge site exists
$bridgeFile = "public\bridge\index.html"
if (-Not (Test-Path $bridgeFile)) {
    Write-Host "ERROR: Bridge site not found at $bridgeFile" -ForegroundColor Red
    exit 1
}

Write-Host "[1/4] Bridge site found..." -ForegroundColor Green

# Option Selection
Write-Host ""
Write-Host "Select deployment option:" -ForegroundColor Yellow
Write-Host "1. Test locally (open in browser)"
Write-Host "2. Copy to Firebase 'out' directory"
Write-Host "3. Copy to legacy static site"
Write-Host "4. Deploy to Firebase hosting"
Write-Host ""

$choice = Read-Host "Enter option (1-4)"

switch ($choice) {
    "1" {
        # Test locally
        Write-Host ""
        Write-Host "[2/4] Opening bridge site in default browser..." -ForegroundColor Green
        Start-Process $bridgeFile
        Write-Host "[3/4] Bridge site opened successfully!" -ForegroundColor Green
        Write-Host "[4/4] Review the site and test all links" -ForegroundColor Green
    }
    
    "2" {
        # Copy to Firebase out directory
        Write-Host ""
        Write-Host "[2/4] Creating bridge directory in 'out'..." -ForegroundColor Green
        New-Item -ItemType Directory -Force -Path "out\bridge" | Out-Null
        
        Write-Host "[3/4] Copying bridge site to 'out\bridge'..." -ForegroundColor Green
        Copy-Item $bridgeFile "out\bridge\index.html" -Force
        
        Write-Host "[4/4] Bridge site copied successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Update firebase.json to add redirect:"
        Write-Host '   { "source": "/", "destination": "/bridge/index.html" }'
        Write-Host "2. Run: firebase deploy --only hosting"
    }
    
    "3" {
        # Copy to legacy static site
        $legacyPath = "..\#Legacy-Static-Sites\public_html\public_html"
        
        if (Test-Path $legacyPath) {
            Write-Host ""
            Write-Host "[2/4] Legacy site directory found..." -ForegroundColor Green
            
            # Backup existing index.html
            if (Test-Path "$legacyPath\index.html") {
                Write-Host "[3/4] Backing up existing index.html..." -ForegroundColor Green
                $backupName = "index.backup." + (Get-Date -Format "yyyyMMdd_HHmmss") + ".html"
                Copy-Item "$legacyPath\index.html" "$legacyPath\$backupName" -Force
                Write-Host "    Backup saved as: $backupName" -ForegroundColor Gray
            }
            
            Write-Host "[4/4] Copying bridge site to legacy directory..." -ForegroundColor Green
            Copy-Item $bridgeFile "$legacyPath\index.html" -Force
            
            Write-Host ""
            Write-Host "Bridge site deployed to legacy directory!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Yellow
            Write-Host "1. Test locally by opening: $legacyPath\index.html"
            Write-Host "2. Upload to hosting via FTP/cPanel"
            Write-Host "3. Verify /salatiso/ legacy tools are still accessible"
        } else {
            Write-Host ""
            Write-Host "ERROR: Legacy site directory not found at:" -ForegroundColor Red
            Write-Host "       $legacyPath" -ForegroundColor Red
            Write-Host ""
            Write-Host "Please update the script with correct path or use option 2." -ForegroundColor Yellow
        }
    }
    
    "4" {
        # Deploy to Firebase
        Write-Host ""
        Write-Host "[2/4] Preparing Firebase deployment..." -ForegroundColor Green
        
        # Ensure bridge is in out directory
        New-Item -ItemType Directory -Force -Path "out\bridge" | Out-Null
        Copy-Item $bridgeFile "out\bridge\index.html" -Force
        
        Write-Host "[3/4] Running Firebase deployment..." -ForegroundColor Green
        Write-Host ""
        
        firebase deploy --only hosting
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "[4/4] Deployment successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Bridge site is now live at:" -ForegroundColor Yellow
            Write-Host "  - https://salatiso-lifecv.web.app/bridge/"
            Write-Host "  - https://lifecv-d2724.web.app/bridge/"
            Write-Host ""
            Write-Host "To make it the root page, update firebase.json with:" -ForegroundColor Yellow
            Write-Host '  { "source": "/", "destination": "/bridge/index.html" }'
        } else {
            Write-Host ""
            Write-Host "ERROR: Firebase deployment failed!" -ForegroundColor Red
            Write-Host "Check your Firebase configuration and try again." -ForegroundColor Yellow
        }
    }
    
    default {
        Write-Host ""
        Write-Host "Invalid option. Please run the script again and select 1-4." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentation: public\bridge\README.md" -ForegroundColor Gray
Write-Host ""