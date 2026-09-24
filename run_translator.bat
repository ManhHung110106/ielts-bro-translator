@echo off
chcp 65001 >nul
title IELTS Bro UI Translator (Tieng Viet / English)

:: Check administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [THÔNG BÁO] Yêu cầu quyền Administrator để chỉnh sửa file trong Program Files.
    echo Đang tự động xin quyền Run as Administrator...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"

:MENU
cls
echo ========================================================
echo       IELTS BRO (雅思哥) UI TRANSLATOR / BẢN DỊCH GIAO DIỆN
echo ========================================================
echo  Ứng dụng hỗ trợ chuyển đổi giao diện IELTS Bro sang Tiếng Việt / Anh.
echo  Đặc biệt: Giữ nguyên 100%% nội dung đề thi tiếng Anh (Reading, Listening,...)
echo ========================================================
echo.
echo  [1] Cài đặt bản dịch TIẾNG VIỆT (Vietnamese)
echo  [2] Cài đặt bản dịch TIẾNG ANH (English)
echo  [3] Khôi phục giao diện gốc ban đầu (Restore Original)
echo  [4] Thoát
echo.
set /p choice="Nhập lựa chọn của bạn [1-4]: "

if "%choice%"=="1" goto INSTALL_VI
if "%choice%"=="2" goto INSTALL_EN
if "%choice%"=="3" goto RESTORE
if "%choice%"=="4" goto EXIT

echo Lựa chọn không hợp lệ!
pause
goto MENU

:INSTALL_VI
cls
echo Đang áp dụng bản dịch TIẾNG VIỆT...
taskkill /F /IM "雅思哥机考软件.exe" >nul 2>&1
node patcher.js patch vi
echo.
echo Hoàn tất! Vui lòng khởi động lại ứng dụng IELTS Bro.
pause
goto MENU

:INSTALL_EN
cls
echo Đang áp dụng bản dịch TIẾNG ANH...
taskkill /F /IM "雅思哥机考软件.exe" >nul 2>&1
node patcher.js patch en
echo.
echo Hoàn tất! Vui lòng khởi động lại ứng dụng IELTS Bro.
pause
goto MENU

:RESTORE
cls
echo Đang khôi phục lại ứng dụng gốc...
taskkill /F /IM "雅思哥机考软件.exe" >nul 2>&1
node patcher.js restore
echo.
echo Đã khôi phục trạng thái gốc ban đầu!
pause
goto MENU

:EXIT
exit /b
