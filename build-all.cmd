@echo off
echo ========================================
echo  TaskFlow - Build All Services
echo ========================================

echo.
echo [1/5] Building auth-service...
cd backend\auth-service
call mvn clean package -DskipTests -q
cd ..\..

echo [2/5] Building user-service...
cd backend\user-service
call mvn clean package -DskipTests -q
cd ..\..

echo [3/5] Building task-service...
cd backend\task-service
call mvn clean package -DskipTests -q
cd ..\..

echo [4/5] Building notification-service...
cd backend\notification-service
call mvn clean package -DskipTests -q
cd ..\..

echo [5/5] Building api-gateway...
cd backend\api-gateway
call mvn clean package -DskipTests -q
cd ..\..

echo.
echo ========================================
echo  All services built successfully!
echo  Run: docker-compose up --build
echo ========================================
