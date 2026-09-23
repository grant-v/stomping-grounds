# Writes the Openverse candidates I checked by eye into the matching skaters-*.json entries.
# Rejected ones (wrong subject, crowd shots, two-person shots) are simply not in $accept.
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)

$accept = @(
  'Mark Gonzales', 'Justin "Figgy" Figueroa', 'Anthony Pappalardo', 'Brian Anderson',
  'Kokona Hiraki', 'Beagle', 'Chris Joslin', 'Milton Martinez', 'Zane Timpson',
  'Alex Midler', 'Flo Marfaing'
)
$cand = @{}
foreach ($c in (Get-Content -Raw -Encoding UTF8 openverse-found.json | ConvertFrom-Json)) {
  if ($accept -contains $c.name) { $cand[$c.name] = $c }
}
Write-Host "applying $($cand.Count) of $($accept.Count) accepted"

$done = 0
foreach ($f in Get-ChildItem "skaters-*.json") {
  $list = Get-Content -Raw -Encoding UTF8 $f.FullName | ConvertFrom-Json
  $touched = $false
  foreach ($s in $list) {
    if (-not $cand.ContainsKey($s.name)) { continue }
    $c = $cand[$s.name]
    $lic = ($c.license).ToUpper()
    $src = if ($c.source) { (Get-Culture).TextInfo.ToTitleCase($c.source) } else { 'Openverse' }
    $s.photo = $c.url
    $s.photoCredit = "Photo: $($c.creator), CC $lic $($c.license_version), via $src"
    $s.photoPage = $c.page
    $touched = $true
    $done++
    Write-Host "  $($s.name) <- $($c.title)"
  }
  if ($touched) {
    # Set-Content -Encoding UTF8 writes a BOM in PS 5.1, and the BOM would land inside the
    # concatenated skaters.js. Write UTF-8 without one, with LF endings and single-spaced colons.
    $json = ($list | ConvertTo-Json -Depth 6) -replace '":  ', '": ' -replace "`r`n", "`n"
    [IO.File]::WriteAllText($f.FullName, $json, (New-Object Text.UTF8Encoding $false))
    Write-Host "wrote $($f.Name)"
  }
}
Write-Host "patched $done entries"
