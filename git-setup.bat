@echo off
chcp 65001 >nul
echo ====================================
echo Git 初始化和推送脚本
echo ====================================
echo.

echo [1/5] 添加所有文件...
git add .
if errorlevel 1 (
    echo 错误: 添加文件失败
    pause
    exit /b 1
)
echo ✓ 文件已添加

echo.
echo [2/5] 创建初始提交...
git commit -m "Initial commit: AI自動引客系統銷售頁面 - 包含訂單表單模態框"
if errorlevel 1 (
    echo 错误: 提交失败
    pause
    exit /b 1
)
echo ✓ 提交成功

echo.
echo [3/5] 检查分支名称...
git branch -M main
echo ✓ 分支设置为 main

echo.
echo [4/5] 添加远程仓库...
git remote add origin https://github.com/ifittw01-ai/AI-auto-sales.git 2>nul
if errorlevel 1 (
    echo 远程仓库已存在，跳过...
) else (
    echo ✓ 远程仓库已添加
)

echo.
echo [5/5] 推送到 GitHub...
git push -u origin main
if errorlevel 1 (
    echo 错误: 推送失败
    echo.
    echo 可能的原因:
    echo - 需要身份验证
    echo - 远程仓库已存在内容
    echo.
    echo 如果需要强制推送，请运行:
    echo git push -u origin main --force
    pause
    exit /b 1
)

echo.
echo ====================================
echo ✓ 成功! 所有文件已推送到 GitHub
echo ====================================
pause

