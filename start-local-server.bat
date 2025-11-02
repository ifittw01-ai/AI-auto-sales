@echo off
chcp 65001 > nul
echo ========================================
echo   AI自動銷售系統 - 本地測試服務器
echo ========================================
echo.
echo 正在啟動本地服務器...
echo.
echo 服務器啟動後，請訪問：
echo   http://localhost:8000
echo.
echo 按 Ctrl+C 可以停止服務器
echo ========================================
echo.

python -m http.server 8000

pause

