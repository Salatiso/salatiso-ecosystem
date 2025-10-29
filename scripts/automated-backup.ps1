# Automated GitHub Backup Script
# This script commits any changes and pushes to GitHub
# Run this regularly to keep your repo backed up

param(
    [string]$CommitMessage = "Automated backup: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

# Change to the repo directory
Set-Location "D:\WebSites\salatiso-ecosystem\Salatiso-React-App"

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "Changes detected. Committing and pushing..."

    # Add all changes
    git add .

    # Commit with timestamp
    git commit -m $CommitMessage

    # Push to GitHub
    git push origin main

    Write-Host "Backup completed successfully."
} else {
    Write-Host "No changes to backup."
}

# Optional: Clean up old branches or logs if needed
# git branch -d $(git branch --merged | grep -v main)