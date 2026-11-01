// Pipeline declarativo para Jenkins en Windows (usa "bat" en lugar de "sh").
pipeline {
    agent any

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    parameters {
        choice(name: 'AMBIENTE', choices: ['dev', 'qa'], description: 'Ambiente destino')
        booleanParam(name: 'DESPLEGAR', defaultValue: true, description: 'Copiar la app a la carpeta de despliegue')
    }

    environment {
        DEPLOY_DIR = "C:\\jenkins-deploy\\pedidos-${params.AMBIENTE}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verificar entorno') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Pruebas') {
            steps {
                bat 'npm run test:ci'
            }
            post {
                always {
                    junit 'test-results.xml'
                }
            }
        }

        stage('Empaquetar') {
            steps {
                bat 'if not exist dist mkdir dist'
                bat 'powershell -NoProfile -Command "Compress-Archive -Path index.html,src -DestinationPath dist\\gestion-pedidos.zip -Force"'
                archiveArtifacts artifacts: 'dist/*.zip', fingerprint: true
            }
        }

        stage('Desplegar') {
            when { expression { params.DESPLEGAR } }
            steps {
                bat '''
                robocopy src "%DEPLOY_DIR%\\src" /E /NFL /NDL
                if %ERRORLEVEL% GEQ 8 exit /b 1
                copy /Y index.html "%DEPLOY_DIR%\\index.html"
                exit /b 0
                '''
            }
        }
    }

    post {
        success { echo "OK: app desplegada en ${env.DEPLOY_DIR}" }
        failure { echo 'FALLO: revisa el Console Output' }
    }
}
