$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$required = @(
  "manifest.json", "content.js", "pages.js", "styles.css", "components.css", "pages.css", "boss-fight.js", "boss-fight.css", "popup.html", "popup.css", "popup.js",
  "icons/icon-16.png", "icons/icon-32.png", "icons/icon-48.png", "icons/icon-128.png"
)

foreach ($path in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $root $path))) {
    throw "Missing required file: $path"
  }
}

$manifest = Get-Content -Raw -Encoding UTF8 (Join-Path $root "manifest.json") | ConvertFrom-Json
if ($manifest.manifest_version -ne 3) { throw "manifest_version must be 3" }
if ($manifest.name -ne "UIS+") { throw "Extension name must be UIS+" }
if ($manifest.permissions -contains "tabs") { throw "Unexpected tabs permission" }

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
  & $node.Source --check (Join-Path $root "content.js")
  & $node.Source --check (Join-Path $root "boss-fight.js")
  & $node.Source --check (Join-Path $root "popup.js")
  if ($LASTEXITCODE -ne 0) { throw "JavaScript syntax check failed" }
}

$runtimeText = Get-Content -Raw -Encoding UTF8 (Join-Path $root "content.js")
if ($runtimeText -match "(?:studium|rozvrh_student|obdobi)=\d+") {
  throw "A personal student identifier is hard-coded in content.js"
}

Write-Host "UIS+ checks passed (version $($manifest.version))." -ForegroundColor Green
