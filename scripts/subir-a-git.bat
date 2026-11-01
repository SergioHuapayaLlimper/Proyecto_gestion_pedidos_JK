@echo off
REM Uso (primera vez): scripts\subir-a-git.bat https://github.com/TU_USUARIO/gestion-pedidos.git
git init
git add .
git commit -m "App gestion de pedidos + Jenkinsfile"
git branch -M main
git remote add origin %1
git push -u origin main
