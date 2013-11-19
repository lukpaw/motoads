@echo off

set BASE_DIR=%~dp0
protractor "%BASE_DIR%\..\config\protractor.conf.js" %*