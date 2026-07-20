@echo off
echo ========================================
echo  TaskFlow - Run All Tests
echo ========================================

set FAILED=0

echo.
echo [1/4] Testing auth-service...
cd backend\auth-service
call mvn test -q
if %ERRORLEVEL% neq 0 set FAILED=1
cd ..\..

echo [2/4] Testing user-service...
cd backend\user-service
call mvn test -q
if %ERRORLEVEL% neq 0 set FAILED=1
cd ..\..

echo [3/4] Testing task-service...
cd backend\task-service
call mvn test -q
if %ERRORLEVEL% neq 0 set FAILED=1
cd ..\..

echo [4/4] Testing notification-service...
cd backend\notification-service
call mvn test -q
if %ERRORLEVEL% neq 0 set FAILED=1
cd ..\..

echo.
if %FAILED%==0 (
    echo  All tests passed!
) else (
    echo  Some tests FAILED. Check output above.
    exit /b 1
)
