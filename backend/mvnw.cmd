@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@echo off
set MAVEN_PROJECTBASEDIR=%~dp0

set WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar
set WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties

for /F "usebackq tokens=1,2 delims==" %%a in ("%WRAPPER_PROPERTIES%") do (
    if "%%a"=="distributionUrl" set DISTRIBUTION_URL=%%b
)

set MAVEN_USER_HOME=%USERPROFILE%\.m2\wrapper
set DISTRIBUTION_ID=apache-maven-3.9.6
set MAVEN_HOME=%MAVEN_USER_HOME%\dists\%DISTRIBUTION_ID%

if exist "%MAVEN_HOME%\bin\mvn.cmd" goto run

echo Downloading Maven 3.9.6...
powershell -Command "Invoke-WebRequest -Uri '%DISTRIBUTION_URL%' -OutFile '%MAVEN_USER_HOME%\apache-maven-3.9.6-bin.zip'"
powershell -Command "Expand-Archive -Path '%MAVEN_USER_HOME%\apache-maven-3.9.6-bin.zip' -DestinationPath '%MAVEN_USER_HOME%\dists'"
ren "%MAVEN_USER_HOME%\dists\apache-maven-3.9.6" "%DISTRIBUTION_ID%"

:run
set JAVA_HOME=%JAVA_HOME:~0,-1%
if "%JAVA_HOME:~-1%"=="\" set JAVA_HOME=%JAVA_HOME:~0,-1%
"%MAVEN_HOME%\bin\mvn.cmd" %*
