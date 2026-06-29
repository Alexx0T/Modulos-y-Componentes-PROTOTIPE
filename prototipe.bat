@echo off
title Ecosistema PROTOTIPE - Consola de Control
chcp 65001 >nul
color 0F
cd /d "%~dp0"

:menu
cls
echo =======================================================
echo         ECOSISTEMA PROTOTIPE - PANEL DE CONTROL
echo =======================================================
echo.
echo [1] Iniciar Servidor Local (Segundo Plano)
echo [2] Detener Servidor Local (Puerto 5173)
echo [3] Verificar Estado del Servidor
echo [4] Verificar Telemetría y Salud del Sistema
echo [5] Guardar y Sincronizar Cambios (Git Push)
echo [6] Salir
echo.
echo =======================================================
set /p opcion="Selecciona una opción [1-6]: "

if "%opcion%"=="1" goto iniciar
if "%opcion%"=="2" goto detener
if "%opcion%"=="3" goto estado
if "%opcion%"=="4" goto telemetria
if "%opcion%"=="5" goto git_sync
if "%opcion%"=="6" goto salir
goto menu

:iniciar
cls
echo =======================================================
echo            DESPLEGANDO SERVIDOR LOCAL
echo =======================================================
echo.
netstat -ano | findstr LISTENING | findstr 5173 >nul
if %errorlevel% equ 0 (
    echo [ADVERTENCIA] Ya parece haber un servidor corriendo en el puerto 5173.
    echo.
    pause
    goto menu
)

echo [INFO] Iniciando servidor de desarrollo Vite en ventana independiente...
start "Servidor Vite - PROTOTIPE" cmd /c "npm.cmd run dev"
echo.
echo [OK] Servidor iniciado en segundo plano.
echo.
pause
goto menu

:detener
cls
echo =======================================================
echo            DETENIENDO SERVIDOR LOCAL
echo =======================================================
echo.
netstat -ano | findstr LISTENING | findstr 5173 >nul
if %errorlevel% neq 0 (
    echo [INFO] No se detectó ningún proceso activo en el puerto 5173.
    echo.
    pause
    goto menu
)

echo [INFO] Deteniendo proceso en el puerto 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr LISTENING ^| findstr 5173') do (
    taskkill /f /pid %%a >nul 2>&1
)
echo [OK] El servidor ha sido detenido con éxito.
echo.
pause
goto menu

:estado
cls
echo =======================================================
echo            ESTADO DEL SERVIDOR VITE
echo =======================================================
echo.
netstat -ano | findstr LISTENING | findstr 5173 >nul
if %errorlevel% equ 0 (
    echo [ACTIVO] El servidor de desarrollo está CORRIENDO en el puerto 5173.
    echo.
    echo Detalles de la conexión activa:
    echo Proto  Dirección local          Dirección remota        Estado        PID
    netstat -ano | findstr LISTENING | findstr 5173
) else (
    echo [INACTIVO] El servidor de desarrollo NO está corriendo en el puerto 5173.
)
echo.
pause
goto menu

:telemetria
cls
echo =======================================================
echo             INFORME DE TELEMETRÍA Y SALUD
echo =======================================================
echo.
:: Verificar Node
echo - Verificando instalación de Node.js:
call node -v >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do set node_ver=%%i
    echo   [OK] Node.js está activo. Versión: %node_ver%
) else (
    echo   [ERROR] Node.js no está instalado o no se encuentra en el PATH del sistema.
)
echo.

:: Verificar Git
echo - Verificando instalación de Git:
call git --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('git --version') do set git_ver=%%i
    echo   [OK] Git está activo. %git_ver%
) else (
    echo   [ERROR] Git no está instalado o no se encuentra en el PATH del sistema.
)
echo.

:: Verificar archivos clave del proyecto
echo - Verificando integridad del proyecto local:
if exist package.json (
    echo   [OK] Archivo 'package.json' detectado.
) else (
    echo   [ADVERTENCIA] No se detectó 'package.json'. ¿Estás en la raíz del proyecto?
)
if exist node_modules (
    echo   [OK] Carpeta 'node_modules' de dependencias detectada.
) else (
    echo   [ADVERTENCIA] No se encontró 'node_modules'. Ejecuta la opción de instalar dependencias primero.
)
echo.
echo =======================================================
pause
goto menu

:git_sync
cls
echo =======================================================
echo         GUARDAR Y SINCRONIZAR CAMBIOS (GIT)
echo =======================================================
echo.
echo Estado actual de archivos modificados:
call git status -s
echo.
set /p commit_confirm="¿Deseas guardar y subir estos cambios a tu GitHub? (S/N): "
if /i "%commit_confirm%" neq "S" goto menu

echo.
set /p commit_msg="Introduce la descripción de los cambios (mensaje de commit): "
if "%commit_msg%"=="" (
    set commit_msg="Actualización rápida desde Consola de Control PROTOTIPE"
)

echo.
echo [1/3] Preparando cambios (git add .)...
call git add .

echo [2/3] Guardando versión local (git commit)...
call git commit -m "%commit_msg%"

echo [3/3] Sincronizando con nube en GitHub (git push)...
call git push

echo.
echo [OK] ¡Sincronización finalizada con éxito!
echo.
pause
goto menu

:salir
cls
echo ¡Hasta luego! Gracias por usar la Consola de Control PROTOTIPE.
timeout /t 2 >nul
exit
