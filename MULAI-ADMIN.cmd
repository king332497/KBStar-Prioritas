@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js 22 atau lebih baru diperlukan. Pasang dahulu, lalu buka file ini lagi.
 pause
 exit /b 1
)
node server.mjs
pause
