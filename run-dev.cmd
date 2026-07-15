@echo off
setlocal

set "CODEX_RUNTIME=C:\Users\manur\.cache\codex-runtimes\codex-primary-runtime\dependencies"
set "PATH=%CODEX_RUNTIME%\node\bin;%PATH%"

if not exist "%CODEX_RUNTIME%\node\bin\node.exe" (
  echo Bundled Node.js was not found at:
  echo %CODEX_RUNTIME%\node\bin\node.exe
  echo Install Node.js LTS from https://nodejs.org/ or update CODEX_RUNTIME in run-dev.cmd.
  exit /b 1
)

if not exist "%CODEX_RUNTIME%\bin\fallback\pnpm.cmd" (
  echo Bundled pnpm was not found at:
  echo %CODEX_RUNTIME%\bin\fallback\pnpm.cmd
  exit /b 1
)

call "%CODEX_RUNTIME%\bin\fallback\pnpm.cmd" run dev
