<#
 Build and deploy Vite dist output to ../docs for GitHub Pages.
 Fixes previous Join-Path misuse and adds error handling.
 Steps:
 1. Run build inside this script directory.
 2. Wipe and recreate ../docs.
 3. Copy dist contents.
 4. Duplicate index.html to 404.html for SPA fallback.
 5. Print summary.
#>

$ErrorActionPreference = 'Stop'

Write-Host "[deploy] Start" -ForegroundColor Cyan
Push-Location $PSScriptRoot
try {
		Write-Host "[deploy] Running build (npm run build)" -ForegroundColor Cyan
		# 注意：移除嚴格模式以避免 npm.ps1 對 $MyInvocation.Statement 的存取在 StrictMode 下出錯
		# 為避免受 PowerShell 版 npm.ps1 影響，呼叫 cmd 版本確保不觸發該屬性檢查
		& cmd /c "npm run build"

	$rootPath = Split-Path -Path $PSScriptRoot -Parent
	$docsPath = Join-Path -Path $rootPath -ChildPath 'docs'
	$distPath = Join-Path -Path $PSScriptRoot -ChildPath 'dist'

	if (-not (Test-Path $distPath)) { throw "Build output not found: $distPath" }

	if (Test-Path $docsPath) {
		Write-Host "[deploy] Removing existing docs folder" -ForegroundColor DarkGray
		Remove-Item $docsPath -Recurse -Force
	}
	New-Item -ItemType Directory -Path $docsPath | Out-Null

	Write-Host "[deploy] Copying dist -> docs" -ForegroundColor Cyan
	Copy-Item -Path (Join-Path $distPath '*') -Destination $docsPath -Recurse -Force

	$indexFile = Join-Path $docsPath 'index.html'
	if (Test-Path $indexFile) {
		Copy-Item -Path $indexFile -Destination (Join-Path $docsPath '404.html') -Force
	} else {
		Write-Warning "index.html not found in docs; skipping 404.html duplication"
	}

	Write-Host "[deploy] DONE -> $docsPath" -ForegroundColor Green
	Write-Host "[deploy] Commit and push main branch (docs folder) to publish." -ForegroundColor Green
}
catch {
	try {
		$errMsg = if ($_.Exception -and $_.Exception.Message) { $_.Exception.Message } else { ($_.ToString()) }
	} catch { $errMsg = 'Unknown error' }
	Write-Host "[deploy] Failed: $errMsg" -ForegroundColor Red
	if ($_.ScriptStackTrace) { Write-Host $($_.ScriptStackTrace) -ForegroundColor DarkGray }
	if ($_.InvocationInfo) {
		Write-Host ("[deploy] At line {0}, position {1}" -f $_.InvocationInfo.ScriptLineNumber, $_.InvocationInfo.OffsetInLine) -ForegroundColor DarkGray
		Write-Host ("[deploy] Code: {0}" -f $_.InvocationInfo.Line.Trim()) -ForegroundColor DarkGray
	}
	exit 1
}
finally {
	Pop-Location
}
