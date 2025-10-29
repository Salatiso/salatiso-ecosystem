# Automated Large File Archiver Script
# This script identifies large files (>50MB) and moves them to external storage
# Updates .gitignore to prevent future tracking

param(
    [string]$ArchivePath = "$env:USERPROFILE\OneDrive\Salatiso-Archive",  # Change this to your cloud storage path
    [long]$SizeThreshold = 50MB  # Files larger than this will be archived
)

# Ensure archive directory exists
if (!(Test-Path $ArchivePath)) {
    New-Item -ItemType Directory -Path $ArchivePath -Force
}

# Change to the repo directory
Set-Location "D:\WebSites\salatiso-ecosystem\Salatiso-React-App"

# Find large files in the repo (excluding .git)
$largeFiles = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $_.Length -gt $SizeThreshold -and $_.FullName -notlike "*\.git\*"
}

if ($largeFiles) {
    Write-Host "Found $($largeFiles.Count) large files to archive."

    foreach ($file in $largeFiles) {
        $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
        $archiveFile = Join-Path $ArchivePath $relativePath

        # Create subdirectories in archive if needed
        $archiveDir = Split-Path $archiveFile -Parent
        if (!(Test-Path $archiveDir)) {
            New-Item -ItemType Directory -Path $archiveDir -Force
        }

        # Move file to archive
        Move-Item $file.FullName $archiveFile -Force

        Write-Host "Archived: $relativePath"
    }

    # Update .gitignore to exclude these patterns
    $gitignorePath = ".gitignore"
    $patterns = $largeFiles | ForEach-Object {
        $_.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    } | Select-Object -Unique

    foreach ($pattern in $patterns) {
        if (!(Select-String -Path $gitignorePath -Pattern $pattern -Quiet)) {
            Add-Content $gitignorePath "`n$pattern"
        }
    }

    # Commit the changes
    git add .
    git commit -m "Automated archive: Moved large files to external storage - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

    Write-Host "Large files archived and committed."
} else {
    Write-Host "No large files found."
}