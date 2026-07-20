@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot
set PATH=%JAVA_HOME%\bin;C:\apache-maven-3.9.9\bin;%PATH%
cd /d "%~dp0backend\api-gateway"
mvn spring-boot:run
