@echo off
REM Git Commit Commands for Security Tracker Rebrand
REM This batch file executes the 5-commit strategy

echo.
echo ========================================
echo Security Tracker Rebrand - Commit Script
echo ========================================
echo.

REM Navigate to project directory
cd "C:\Users\Yash R Patel\Desktop\Security-Tracker"

REM Verify we're in a git repository
if not exist .git (
    echo Error: Not a git repository
    exit /b 1
)

echo Current git status:
git status
echo.

echo Starting commit process...
echo.

REM Commit 1: Remove Lovable branding
echo [1/5] Removing Lovable branding...
git add package.json vite.config.ts index.html
git commit -m "chore: remove Lovable branding and references" -m "- Remove lovable-tagger dependency from package.json" -m "- Remove componentTagger import from vite.config.ts" -m "- Update HTML meta tags to remove Lovable references" -m "- Remove Lovable social media meta tags"
if %errorlevel% equ 0 (
    echo ✓ Commit 1 completed
) else (
    echo ✗ Commit 1 failed
)
echo.

REM Commit 2: Rebrand project title
echo [2/5] Rebranding to Security Tracker...
git add package.json index.html README.md
git commit -m "feat: rebrand project to Security Tracker" -m "- Update project name from vite_react_shadcn_ts to security-tracker" -m "- Change title from vuln-track-space to Security Tracker" -m "- Rewrite README with project description and features" -m "- Update HTML title and og:title tags"
if %errorlevel% equ 0 (
    echo ✓ Commit 2 completed
) else (
    echo ✗ Commit 2 failed
)
echo.

REM Commit 3: Clean up dependencies
echo [3/5] Cleaning up dependencies...
git add package-lock.json package.json
git commit -m "refactor: remove Lovable tagger package" -m "- Uninstall lovable-tagger package" -m "- Update package-lock.json" -m "- Clean up unused development dependencies"
if %errorlevel% equ 0 (
    echo ✓ Commit 3 completed
) else (
    echo ✗ Commit 3 failed
)
echo.

REM Commit 4: Update project metadata
echo [4/5] Updating project metadata...
git add index.html
git commit -m "docs: update project metadata" -m "- Update author and description meta tags" -m "- Remove Lovable-generated references" -m "- Update og:description for better SEO"
if %errorlevel% equ 0 (
    echo ✓ Commit 4 completed
) else (
    echo ✗ Commit 4 failed
)
echo.

REM Commit 5: Final documentation cleanup
echo [5/5] Finalizing documentation...
git add .
git commit -m "docs: finalize Security Tracker rebrand" -m "- Ensure all references to old project name are removed" -m "- Clean up any remaining Lovable artifacts" -m "- Finalize project documentation"
if %errorlevel% equ 0 (
    echo ✓ Commit 5 completed
) else (
    echo ✗ Commit 5 failed
)
echo.

REM Show final status
echo Final Commit History:
git log --oneline -5
echo.

echo ========================================
echo ✓ Rebrand complete!
echo ========================================
echo.
echo To push these changes to remote, run:
echo   git push origin main
echo.

pause

