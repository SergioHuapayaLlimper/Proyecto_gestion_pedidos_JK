# Guia Jenkins (Windows) - App Gestion de Pedidos

## 0. Instalacion

**Requisitos previos**
1. JDK 17 o 21 (por ejemplo Temurin: adoptium.net). Verifica: `java -version`.
2. Git for Windows (git-scm.com). Verifica: `git --version`.
3. Node.js 20 o superior LTS (nodejs.org). Verifica: `node --version`.

**Jenkins**
1. Descarga el instalador `.msi` de la version LTS en jenkins.io/download.
2. Siguiente, siguiente. Cuenta de servicio: "Run service as LocalSystem" (mas simple para practicar). Puerto: 8080 (si esta ocupado, usa 8081).
3. Cuando pida la ruta del Java, selecciona la carpeta del JDK.
4. Abre `http://localhost:8080`.
5. Desbloqueo: pega la clave de `C:\ProgramData\Jenkins\.jenkins\secrets\initialAdminPassword`
   (si instalaste como usuario normal: `C:\Users\TU_USUARIO\.jenkins\secrets\initialAdminPassword`).
6. Elige **Install suggested plugins** y espera.
7. Crea tu usuario administrador y confirma la URL (`http://localhost:8080/`).
8. IMPORTANTE: si instalaste Node o Git DESPUES de Jenkins, reinicia el servicio:
   `services.msc` -> Jenkins -> Reiniciar (para que lea el PATH).

## 1. Tutorial: primer job Freestyle
1. Dashboard -> **Nuevo Item** -> nombre `hola-jenkins` -> **Freestyle project** -> OK.
2. Seccion **Build Steps** -> Agregar paso -> **Execute Windows batch command**:
   ```
   echo Hola desde Jenkins
   node --version
   ```
3. Guardar -> **Construir ahora**.
4. Abre el build (#1) -> **Console Output**. Debe terminar en `SUCCESS`.

## 2. Tutorial: pipeline desde el Jenkinsfile
1. Sube el proyecto a GitHub (`scripts\subir-a-git.bat URL_DEL_REPO`).
2. **Nuevo Item** -> `pipeline-pedidos` -> **Pipeline** -> OK.
3. En **Pipeline** elige **Pipeline script from SCM** -> SCM: Git.
4. Repository URL: la de tu repo. Branch: `*/main`. Script Path: `Jenkinsfile`.
5. Guardar -> **Construir ahora**. En la vista de etapas veras: Checkout, Verificar entorno, Pruebas, Empaquetar, Desplegar.
6. Resultado: la app queda en `C:\jenkins-deploy\pedidos-dev\index.html` (abrela con doble clic).

Repo local en vez de GitHub: usa como URL la ruta `C:/ruta/gestion-pedidos`.
Si sale "dubious ownership", ejecuta en PowerShell:
`git config --system --add safe.directory *`

## 3. Tutorial: triggers (ejecucion automatica)
Job -> **Configurar** -> **Build Triggers**:
- **Consultar repositorio (Poll SCM)**: `H/2 * * * *` (revisa cada 2 min y construye si hay commits nuevos).
- **Construir periodicamente**: `H 8 * * 1-5` (lunes a viernes, ~8 am).
Prueba: cambia un texto en `index.html`, haz commit y push, espera 2 minutos y verifica que aparece un build nuevo.

## 4. Tutorial: build con parametros
El `Jenkinsfile` ya define `AMBIENTE` y `DESPLEGAR`.
1. Ejecuta el job una vez (la primera ejecucion registra los parametros).
2. Ahora aparece **Construir con parametros**.
3. Elige `qa` y desmarca `DESPLEGAR` -> la etapa Desplegar queda omitida.

## 5. Tutorial: resultados de pruebas y artefactos
- **Pruebas**: en el build, abre **Test Result** (viene del archivo JUnit `test-results.xml`). Veras 6 pruebas.
- **Provocar un fallo**: en `test/pedidos.test.js` cambia `7.5` por `8` y haz push. El build queda **UNSTABLE/FAILED** y el reporte muestra que prueba fallo. Revierte el cambio.
- **Artefactos**: en la pagina del build, descarga `dist/gestion-pedidos.zip`.

## 6. Tutorial: plugins, usuarios y credenciales
- **Plugins**: Administrar Jenkins -> Plugins -> Available plugins. Utiles: *Pipeline Stage View*, *Blue Ocean*, *Git*, *JUnit*.
- **Usuarios**: Administrar Jenkins -> Users -> Create User.
- **Credenciales** (repo privado): Administrar Jenkins -> Credentials -> Global -> Add Credentials (Username + token de GitHub). Luego selecciona esa credencial en el job (campo Credentials del SCM).

## 7. Problemas frecuentes
| Error | Solucion |
|---|---|
| `'node' is not recognized` | Instala Node y reinicia el servicio Jenkins |
| `git` no encontrado | Instala Git y reinicia el servicio Jenkins |
| `junit` no encuentra `test-results.xml` | Verifica Node 20+ (`node --version`) |
| Puerto 8080 ocupado | Reinstala con otro puerto o cierra el programa que lo usa |
| Acceso denegado al desplegar | Cambia `DEPLOY_DIR` a una carpeta sin restricciones |
