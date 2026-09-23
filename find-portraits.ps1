# Searches Openverse (Creative Commons images: Flickr, Wikimedia, museums...) for a usable portrait
# of every skater in skaters-*.json that has no photo yet. Writes candidates to openverse-found.json
# for review -- nothing is applied automatically. Run:  powershell -ExecutionPolicy Bypass -File find-portraits.ps1
$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $dir

$need = @()
foreach ($f in Get-ChildItem "skaters-*.json") {
  foreach ($s in (Get-Content -Raw -Encoding UTF8 $f.FullName | ConvertFrom-Json)) {
    if (-not $s.photo) { $need += $s.name }
  }
}
Write-Host "looking for $($need.Count) portraits"

# strip a "Nickname" and fold accents so 'Aurelien' matches 'Aurélien'
function Plain([string]$s) {
  $s = $s -replace '"[^"]*"', ' '
  $n = $s.Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}', ''
  return ($n -replace '\s+', ' ').Trim().ToLower()
}
$skateWords = @('skate', 'skateboard', 'skatepark', 'sk8', 'vert', 'x games', 'street league', 'thrasher', 'tampa')
$found = @()
$i = 0
foreach ($name in $need) {
  $i++
  $plain = Plain $name
  $tokens = $plain -split ' ' | Where-Object { $_.Length -gt 1 }
  $url = "https://api.openverse.org/v1/images/?q=$([uri]::EscapeDataString("$name skateboarder"))&page_size=20"
  try {
    $r = Invoke-RestMethod -Uri $url -Headers @{ 'User-Agent' = 'StompingGrounds/1.0 (personal project)' } -TimeoutSec 30
  } catch {
    Write-Host "[$i/$($need.Count)] $name -- request failed: $($_.Exception.Message)"
    Start-Sleep -Seconds 5
    continue
  }
  $hit = $null
  foreach ($res in $r.results) {
    # the name must be in the TITLE itself; matching tags or creator pulled in the wrong person
    $titleOnly = Plain $res.title
    $hay = Plain ("$($res.title) $($res.creator) $($res.tags.name -join ' ')")
    $allTokens = $true
    foreach ($t in $tokens) { if ($titleOnly -notmatch [regex]::Escape($t)) { $allTokens = $false } }
    if (-not $allTokens) { continue }
    $isSkate = $false
    foreach ($w in $skateWords) { if ($hay -match [regex]::Escape($w)) { $isSkate = $true } }
    if (-not $isSkate) { continue }
    if ($res.width -and $res.width -lt 300) { continue }
    $hit = $res; break
  }
  if ($hit) {
    Write-Host "[$i/$($need.Count)] $name -- FOUND: $($hit.title) ($($hit.license) $($hit.license_version), $($hit.width)x$($hit.height))"
    $found += [pscustomobject]@{
      name = $name; title = $hit.title; url = $hit.url; creator = $hit.creator
      license = $hit.license; license_version = $hit.license_version
      page = $hit.foreign_landing_url; source = $hit.source
      width = $hit.width; height = $hit.height
    }
  } else {
    Write-Host "[$i/$($need.Count)] $name -- nothing usable"
  }
  Start-Sleep -Milliseconds 1200
}
$found | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 openverse-found.json
Write-Host "`nfound $($found.Count) of $($need.Count); written to openverse-found.json"
