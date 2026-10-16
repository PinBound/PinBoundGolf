param([Parameter(Mandatory = $true)][string]$SourcePath)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$brandingDir = Join-Path $projectRoot 'public/branding'
$iconsDir = Join-Path $projectRoot 'public/icons'
New-Item -ItemType Directory -Force $brandingDir, $iconsDir | Out-Null
$masterPath = Join-Path $brandingDir 'pinbound-logo-v2.png'
if ([IO.Path]::GetFullPath($SourcePath) -ne [IO.Path]::GetFullPath($masterPath)) {
    Copy-Item -LiteralPath $SourcePath -Destination $masterPath
}
$sourceImage = [System.Drawing.Image]::FromFile($masterPath)
try {
    if ($sourceImage.Width -ne $sourceImage.Height) { throw 'The source logo must be square.' }
    $exports = @(
        @{ Size = 1024; File = 'public/branding/pinbound-avatar-1024.png' },
        @{ Size = 512; File = 'public/branding/pinbound-avatar-512.png' },
        @{ Size = 256; File = 'public/branding/pinbound-avatar-256.png' },
        @{ Size = 128; File = 'public/branding/pinbound-avatar-128.png' },
        @{ Size = 180; File = 'public/apple-touch-icon.png' },
        @{ Size = 167; File = 'public/icons/apple-touch-icon-167.png' },
        @{ Size = 152; File = 'public/icons/apple-touch-icon-152.png' },
        @{ Size = 192; File = 'public/icons/icon-192.png' },
        @{ Size = 512; File = 'public/icons/icon-512.png' },
        @{ Size = 32; File = 'public/icons/favicon-32.png' },
        @{ Size = 16; File = 'public/icons/favicon-16.png' }
    )
    foreach ($export in $exports) {
        $size = $export.Size
        $bitmap = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
            $destination = Join-Path $projectRoot $export.File
            $bitmap.Save($destination, [System.Drawing.Imaging.ImageFormat]::Png)
        } finally {
            $graphics.Dispose()
            $bitmap.Dispose()
        }
        $check = [System.Drawing.Image]::FromFile($destination)
        try {
            if ($check.Width -ne $size -or $check.Height -ne $size) { throw "Incorrect dimensions: $destination" }
            Write-Output "$($export.File): $size x $size"
        } finally { $check.Dispose() }
    }
} finally { $sourceImage.Dispose() }
