// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// No arquivo: cypress/support/e2e.js

Cypress.Commands.add('login', (username, password) => {
  cy.log(`Realizando login programático para o usuário: ${username}`);

  cy.session([username, password], () => {
    cy.request({
      method: 'POST',
      url: '/cadastroelogin',
      form: true,
      body: {
        action: 'login',
        username: username,
        senha: password,
      },
      // Impede que o Cypress falhe se o servidor retornar um código de erro
      failOnStatusCode: false 
    }).then((response) => {
      // Adiciona um log para podermos ver o que o servidor respondeu
      cy.log('Resposta do Servidor:', JSON.stringify(response));

      // VERIFICAÇÃO DE ROBUSTEZ: Garante que recebemos um redirecionamento
      // A propriedade 'redirects' guarda as URLs para as quais fomos redirecionados
      const redirectUrl = response.redirects && response.redirects[0];

      if (!redirectUrl) {
        throw new Error(`O login programático falhou. O servidor não enviou um redirecionamento. Status: ${response.status}`);
      }
      
      cy.log('URL de Redirecionamento:', redirectUrl);
      
      // Extrai o ID da URL de redirecionamento (Ex: 'http://localhost:8080/home/2')
      const userId = redirectUrl.split('/').pop();
      
      if (!userId || isNaN(parseInt(userId))) {
          throw new Error(`Não foi possível extrair um ID de usuário válido da URL de redirecionamento: ${redirectUrl}`);
      }

      // Armazena o ID do usuário para ser usado nos testes
      cy.wrap(userId).as('userId');
    });
  });
});