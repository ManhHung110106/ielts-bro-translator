@echo off
title IELTS Bro UI Translator

:: Check administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [THONG BAO] Yeu cau quyen Administrator de chinh sua file trong Program Files.
    echo Dang tu dong xin quyen Run as Administrator...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"

:MENU
cls
echo ========================================================
echo       IELTS BRO UI TRANSLATOR / BAN DICH GIAO DIEN
echo ========================================================
echo  Ung dung ho tro chuyen doi giao dien IELTS Bro sang Tieng Viet / Anh.
echo  Dac biet: Giu nguyen 100%% noi dung de thi tieng Anh (Reading, Listening,...)
echo ========================================================
echo.
echo  [1] Cai dat ban dich TIENG VIET (Vietnamese)
echo  [2] Cai dat ban dich TIENG ANH (English)
echo  [3] Khoi phuc giao dien goc ban dau (Restore Original)
echo  [4] Thoat
echo.
set /p choice="Nhap lua chon cua ban [1-4]: "

if "%choice%"=="1" goto INSTALL_VI
if "%choice%"=="2" goto INSTALL_EN
if "%choice%"=="3" goto RESTORE
if "%choice%"=="4" goto EXIT

echo Lua chon khong hop le!
pause
goto MENU

:INSTALL_VI
cls
echo Dang ap dung ban dich TIENG VIET...
taskkill /F /FI "IMAGENAME eq *yasi*" >nul 2>&1
powershell -Command "Get-Process | Where-Object { .Path -like '*yasige*' } | Stop-Process -Force -ErrorAction SilentlyContinue"
node patcher.js patch vi
echo.
echo Hoan tat! Vui long khoi dong lai ung dung IELTS Bro.
pause
goto MENU

:INSTALL_EN
cls
echo Dang ap dung ban dich TIENG ANH...
taskkill /F /FI "IMAGENAME eq *yasi*" >nul 2>&1
powershell -Command "Get-Process | Where-Object { .Path -like '*yasige*' } | Stop-Process -Force -ErrorAction SilentlyContinue"
node patcher.js patch en
echo.
echo Hoan tat! Vui long khoi dong lai ung dung IELTS Bro.
pause
goto MENU

:RESTORE
cls
echo Dang khoi phuc lai ung dung goc...
taskkill /F /FI "IMAGENAME eq *yasi*" >nul 2>&1
powershell -Command "Get-Process | Where-Object { .Path -like '*yasige*' } | Stop-Process -Force -ErrorAction SilentlyContinue"
node patcher.js restore
echo.
echo Da khoi phuc trang thai goc ban dau!
pause
goto MENU

:EXIT
exit /b
