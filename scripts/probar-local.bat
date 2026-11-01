@echo off
REM Ejecuta localmente lo mismo que hace Jenkins en la etapa de pruebas.
node --version || exit /b 1
npm test
