// Jenkinsfile Multiplataforma
pipeline {
    agent any
    tools {
        nodejs 'node24'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    // Verifica se o sistema é tipo Unix (macOS/Linux)
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
                echo 'Dependências instaladas.'
            }
        }

        stage('Unit Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm test'
                    } else {
                        bat 'npm test'
                    }
                }
                echo 'Testes unitários executados.'
            }
            post {
                always {
                    junit 'junit.xml'
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Relatório de Cobertura'
                    ])
                }
            }
        }

        stage('Functional (E2E) Tests') {
            steps {
                echo 'Iniciando testes funcionais com Cypress...'
                script {
                    if (isUnix()) {
                        sh 'npx cypress run'
                    } else {
                        bat 'npx cypress run'
                    }
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/videos/**/*.mp4, cypress/screenshots/**/*.png', allowEmptyArchive: true
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline finalizado.'
        }
        success {
            echo 'Pipeline executado com sucesso!'
        }
        failure {
            echo 'O pipeline falhou.'
        }
    }
}