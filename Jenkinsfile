// Jenkinsfile para o Projeto Yorkut

pipeline {
    // Define que o pipeline pode ser executado em qualquer agente Jenkins disponível
    agent any

    // Define as ferramentas que serão usadas. Ajuste a versão do Maven se necessário.
    tools {
        maven 'Maven-3.9.10'
    }

    stages {
        // Estágio 1: Baixar o código-fonte do GitHub
        stage('Checkout') {
            steps {
                // Clona o repositório Git especificado na configuração do Job
                git url: 'https://github.com/fbarreto05/Yorkut.git', branch: 'master'
                echo 'Código-fonte baixado com sucesso.'
            }
        }

        // Estágio 2: Compilar o projeto e instalar dependências com Maven
        stage('Build') {
            steps {
                // Executa os comandos Maven para limpar, compilar e empacotar o projeto
                // Isso garante que o código não tem erros de compilação.
                sh 'mvn clean install -DskipTests=true' // Pula os testes aqui, pois teremos um estágio dedicado
                echo 'Projeto compilado com sucesso.'
            }
        }

        // Estágio 3: Executar Testes Unitários
        // Automatiza os testes de lógica interna, como os de Cadastro (T2) e Login (T3, T4, T5, T6).
        stage('Unit Tests') {
            steps {
                // Executa os testes unitários do projeto
                sh 'mvn test'
                echo 'Testes unitários executados.'
            }
            post {
                // Coleta os resultados dos testes para exibição no Jenkins
                always {
                    junit 'target/surefire-reports/*.xml' // Caminho padrão dos relatórios de teste do Maven/JUnit
                    echo 'Relatórios de testes unitários publicados.'
                }
            }
        }

        // Estágio 4: Executar Testes Funcionais (Histórias de Usuário)
        // Automatiza cenários de ponta-a-ponta como Criar Conta (C1A1), Login (Cenário Login), etc.
        stage('Functional Tests') {
            steps {
                echo 'Iniciando testes funcionais com Selenium/Cypress...'
                // AQUI você deve colocar o comando para rodar seus testes funcionais.
                // Exemplo se você usar Maven com Selenium:
                // sh 'mvn failsafe:integration-tests'
                
                // Se usar Cypress (requer Node.js no ambiente Jenkins):
                // sh 'npm install && npx cypress run'
                
                // ATENÇÃO: O comando exato depende de como você estruturou seus testes funcionais.
                // Por enquanto, usaremos um placeholder.
                echo 'Placeholder para execução de testes funcionais.'
            }
            post {
                always {
                    echo 'Publicando relatórios de testes funcionais...'
                    // Publica os relatórios HTML gerados pelo seu framework de teste
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'target/site/serenity', // Exemplo de caminho para relatórios do Serenity BDD com Selenium
                        reportFiles: 'index.html',
                        reportName: 'Relatório de Testes Funcionais'
                    ])
                }
            }
        }
    }

    // Bloco executado ao final do pipeline, independentemente do resultado
    post {
        always {
            echo 'Pipeline finalizado.'
            // Limpa o workspace para a próxima execução
            cleanWs()
        }
        success {
            // Ação em caso de sucesso (ex: enviar um email)
            echo 'Build concluído com sucesso!'
        }
        failure {
            // Ação em caso de falha
            echo 'Build falhou. Verifique os logs.'
            // Exemplo de notificação por email
            mail to: 'seu-email@exemplo.com',
                 subject: "FALHA no Build do Projeto Yorkut: #${env.BUILD_NUMBER}",
                 body: "O build #${env.BUILD_NUMBER} falhou. Verifique os logs no Jenkins: ${env.BUILD_URL}"
        }
    }
}