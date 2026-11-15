@echo off
title TerraSpace AI - Planetary Analog Discovery Platform
color 0B
echo ==============================================================================
echo                TERRASPACE AI - MISSION CONTROL LAUNCHER
echo   Intelligent Earth Analog Discovery for Moon Base & Mars Settlements
echo ==============================================================================
echo.
echo [1/3] Checking Python environment...
python --version
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH! Please install Python 3.10+.
    pause
    exit /b 1
)

echo.
echo [2/3] Launching TerraSpace AI Server on dedicated port 5055...
echo Server starting at http://localhost:5055
echo.

start "" "http://localhost:5055"

python -u backend\app.py

pause
