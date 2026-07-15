$runtime = 'C:\Users\manur\.cache\codex-runtimes\codex-primary-runtime\dependencies'
$nodeDirectory = Join-Path $runtime 'node\bin'
$pnpm = Join-Path $runtime 'bin\fallback\pnpm.cmd'

if (-not (Test-Path (Join-Path $nodeDirectory 'node.exe'))) {
    throw "Bundled Node.js was not found in $nodeDirectory. Install Node.js LTS from https://nodejs.org/ or update the runtime path in this script."
}

if (-not (Test-Path $pnpm)) {
    throw "Bundled pnpm was not found at $pnpm."
}

$env:Path = "$nodeDirectory;$env:Path"
& $pnpm run dev
exit $LASTEXITCODE
