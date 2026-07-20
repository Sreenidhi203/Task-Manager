@echo off
set "MVN=C:\Users\DELL\.m2\wrapper\dists\apache-maven-3.9.6"
set "DIR=c:\Users\DELL\Desktop\TASKMA~1\backend"

for /f "usebackq tokens=1,2 delims==" %%a in ("%~dp0.env") do (
    if not "%%a"=="" if not "%%b"=="" set "%%a=%%b"
)

powershell -Command "$lines = @('-cp','%MVN%\boot\plexus-classworlds-2.7.0.jar','-Dclassworlds.conf=%MVN%\bin\m2.conf','-Dmaven.home=%MVN%','-Dmaven.multiModuleProjectDirectory=%DIR%','org.codehaus.plexus.classworlds.launcher.Launcher','spring-boot:run'); [System.IO.File]::WriteAllLines($env:TEMP+'\mvn-args.txt', $lines)"
java "@%TEMP%\mvn-args.txt"
