pipeline {
    // Define o agente que executará o pipeline.
    // O 'agent' precisa ter o Node.js instalado.
    agent any

    // Define as ferramentas necessárias. O nome 'node18' deve corresponder
    // ao configurado em 'Gerenciar Jenkins' > 'Ferramentas'.
    tools {
        nodejs 'node24'
    }

    stages {
        // Estágio 1: Baixar o código-fonte do repositório
        stage('Checkout') {
            steps {
                // Clona o repositório do Git
                git url: 'https://github.com/fbarreto05/Yorkut.git', branch: 'main'
                echo 'Código-fonte baixado.'
            }
        }

        // Estágio 2: Instalar as dependências do projeto
        stage('Install Dependencies') {
            steps {
                // Roda 'npm install' para baixar todos os pacotes do package.json
                sh 'npm install'
                echo 'Dependências instaladas.'
            }
        }

        // Estágio 3: Executar Testes Unitários com Jest
        // Este estágio automatiza a validação da lógica do seu código.
        stage('Unit Tests') {
            steps {
                // Roda o script 'test' definido no package.json
                sh 'npm test'
                echo 'Testes unitários executados.'
            }
            post {
                // Sempre executa após o estágio, para coletar os resultados
                always {
                    // Publica os resultados dos testes no formato JUnit
                    junit 'junit.xml'

                    // Publica o relatório de cobertura de código em HTML
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

        // Estágio 4: Testes Funcionais (E2E) - Placeholder
        // Este estágio é onde você automatizará as "histórias de usuário" completas,
        // simulando a interação real do usuário no navegador.
        stage('Functional (E2E) Tests') {
            steps {
                echo 'Placeholder para testes funcionais com Cypress ou Selenium.'
                echo 'Exemplo de comando com Cypress: npx cypress run'
            }
        }
    }

    // Ações a serem executadas no final do pipeline
    post {
        always {
            echo 'Pipeline finalizado.'
        }
        success {
            echo 'Pipeline executado com sucesso!'
        }
        failure {
            echo 'O pipeline falhou.'
            /*
            mail to: 'seu-email@exemplo.com',
                 subject: "FALHA no Build do Projeto Yorkut: #${env.BUILD_NUMBER}",
                 body: "O build #${env.BUILD_NUMBER} falhou. Verifique os logs no Jenkins: ${env.BUILD_URL}"
            */
        }
    }
}