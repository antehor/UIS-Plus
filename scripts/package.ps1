param(
  [string]$OutputDirectory = "dist"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
& (Join-Path $PSScriptRoot "check.ps1")

$manifest = Get-Content -Raw -Encoding UTF8 (Join-Path $root "manifest.json") | ConvertFrom-Json
$archiveName = "UIS-plus-v$($manifest.version).zip"
$output = [System.IO.Path]::GetFullPath((Join-Path $root $OutputDirectory))
$tempRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
$stage = [System.IO.Path]::GetFullPath((Join-Path $tempRoot "UIS-plus-package-$([Guid]::NewGuid().ToString('N'))"))
if (-not $stage.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Temporary package path is outside the system temporary directory"
}
$extension = Join-Path $stage "UIS-plus"

New-Item -ItemType Directory -Path $extension -Force | Out-Null
try {
  $files = @("manifest.json", "content.js", "styles.css", "boss-fight.js", "boss-fight.css", "popup.html", "popup.css", "popup.js", "INSTALL.html", "README.md", "CHANGELOG.md", "LICENSE", "PRIVACY.md")
  foreach ($file in $files) { Copy-Item -LiteralPath (Join-Path $root $file) -Destination $extension }
  Copy-Item -LiteralPath (Join-Path $root "icons") -Destination $extension -Recurse
  Copy-Item -LiteralPath (Join-Path $root "assets") -Destination $extension -Recurse
  Copy-Item -LiteralPath (Join-Path $root "docs") -Destination $extension -Recurse
  New-Item -ItemType Directory -Path $output -Force | Out-Null
  $archive = Join-Path $output $archiveName
  if (Test-Path -LiteralPath $archive) { Remove-Item -LiteralPath $archive -Force }
  Compress-Archive -Path $extension -DestinationPath $archive -CompressionLevel Optimal
  Write-Output $archive
}
finally {
  if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Recurse -Force }
}
