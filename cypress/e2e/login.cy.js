describe('Testes Funcionais de Login', () => {
  // Antes de cada teste, garantimos que a aplicação esteja "limpa"
  // e visitamos a página inicial.
  beforeEach(() => {
    cy.visit('http://localhost:8081'); // Certifique-se de que sua aplicação está rodando nesta porta
  });

  /**
   * Teste para o cenário de sucesso:
   * Cenário (Login) - Teste Funcional 
   * História: H2A1 
   */
  it('Deve permitir o login de um usuário com credenciais corretas', () => {
    // Para este teste funcionar, o usuário 'João' com a senha '1234'
    // precisa existir no banco de dados. O arquivo population.js garante isso.

    cy.log('Preenchendo o nome de usuário');
    // Encontra o input de nome de usuário pelo atributo 'name' e digita 'João'
    cy.get('input[name="username"]').type('João');

    cy.log('Preenchendo a senha');
    // Encontra o input de senha pelo atributo 'name' e digita '1234'
    cy.get('input[name="senha"]').type('1234');

    cy.log('Clicando no botão de login');
    // Encontra o botão de login pelo seu valor e clica nele
    cy.get('button[value="login"]').click();

    cy.log('Verificando se o usuário foi redirecionado para a home');
    // Após o login, a URL deve mudar para incluir '/home'
    cy.url().should('include', '/home');
  });

  /**
   * Teste para o cenário de falha:
   * Cenário (Login com Credenciais Incorretas) - Teste Funcional 
   */
  it('Deve exibir uma mensagem de erro com credenciais incorretas', () => {
    cy.log('Preenchendo com um usuário válido e senha errada');
    cy.get('input[name="username"]').type('João');
    cy.get('input[name="senha"]').type('senha-errada');

    cy.log('Clicando no botão de login');
    cy.get('button[value="login"]').click();

    cy.log('Verificando a mensagem de erro');
    // A URL não deve mudar
    cy.url().should('not.include', '/home');
    // Uma mensagem de erro deve ser exibida na página
    // ATENÇÃO: O texto 'Senha incorreta!' deve ser exatamente igual ao que seu app mostra.
    cy.contains('Senha incorreta!').should('be.visible');
  });
});