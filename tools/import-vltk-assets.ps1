param(
    [string]$SourceRoot = "$(Split-Path -Parent $PSScriptRoot)\thamkhao",
    [string]$OutputRoot = "$(Split-Path -Parent $PSScriptRoot)\public\assets\vltk"
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $SourceRoot)) {
    throw "Không tìm thấy thư mục thamkhao: $SourceRoot"
}

$itemsSource = Join-Path $SourceRoot 'spr\item'
$skillsSource = Join-Path $SourceRoot 'spr\skill'
$skillsNewSource = Join-Path $SourceRoot 'spr\skillnew'

$itemsOutput = Join-Path $OutputRoot 'items'
$skillsOutput = Join-Path $OutputRoot 'skills'

New-Item -ItemType Directory -Force -Path $itemsOutput, $skillsOutput | Out-Null

Write-Host 'Đã xác định nguồn asset:' -ForegroundColor Green
Write-Host "  Item : $itemsSource"
Write-Host "  Skill: $skillsSource"
Write-Host "  Skill+: $skillsNewSource"
Write-Host ''

Write-Host 'Lưu ý: file SPR không thể hiển thị trực tiếp trên trình duyệt.' -ForegroundColor Yellow
Write-Host 'Hãy dùng JxSprViewer/JxSprEditor để export SPR thành PNG trước.' -ForegroundColor Yellow
Write-Host ''

$pngCount = 0

foreach ($source in @($itemsSource, $skillsSource, $skillsNewSource)) {
    if (-not (Test-Path $source)) { continue }
    $relativeGroup = if ($source -like '*skill*') { 'skills' } else { 'items' }
    $destination = if ($relativeGroup -eq 'skills') { $skillsOutput } else { $itemsOutput }

    Get-ChildItem $source -Recurse -File -Include *.png,*.webp | ForEach-Object {
        Copy-Item $_.FullName -Destination (Join-Path $destination $_.Name) -Force
        $pngCount++
    }
}

Write-Host "Đã import $pngCount file ảnh đã export." -ForegroundColor Cyan
Write-Host "Kiểm tra: $OutputRoot"
