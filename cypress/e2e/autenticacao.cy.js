/**
 * Arquivo de teste para o subdomínio de Autenticação.
 * Cobre as histórias H1A1 e H2A1.
 */
describe('Subdomínio: Autenticação', () => {

  beforeEach(() => {
    // Visita a página inicial antes de cada teste
    cy.visit('/');
  });

  /**
   * Teste para o Cenário C1A1 e Teste T2
   * Como um visitante, quero criar uma conta.
   */
  it('Cenário C1A1 & T2 - Deve permitir o cadastro de um novo usuário com sucesso', () => {
    // Gera um nome de usuário único para que o teste possa ser executado várias vezes
    const uniqueUser = `cypress_user_${Date.now()}`;

    cy.log('Preenchendo o formulário de cadastro');
    cy.get('input[name="username"]').type(uniqueUser);
    cy.get('input[name="senha"]').type('SenhaForte123');
    
    cy.log('Clicando no botão de cadastro');
    cy.get('button[value="cadastro"]').click();

    cy.log('Verificando a mensagem de sucesso');
    // Verifica se a mensagem de sucesso do cadastro é exibida
    cy.contains('Usuário cadastrado com sucesso!').should('be.visible');
  });

  /**
   * Teste para o Cenário de Login (Sucesso)
   * História: H2A1
   */
  it('Cenário Login (Sucesso) - Deve fazer o login de um usuário existente', () => {
    // Este teste assume que o usuário 'João' com senha '1234' existe no banco de dados.
    // O script `population.js` garante isso.
    cy.log('Preenchendo credenciais válidas');
    cy.get('input[name="username"]').type('João');
    cy.get('input[name="senha"]').type('1234');

    cy.log('Clicando no botão de login');
    cy.get('button[value="login"]').click();

    cy.log('Verificando o redirecionamento para a home');
    cy.url().should('include', '/home');
  });

  /**
   * Teste para o Cenário de Login com Credenciais Incorretas
   * História: H2A1
   */
  it('Cenário Login (Falha) - Deve exibir erro com senha incorreta', () => {
    cy.log('Preenchendo com senha incorreta');
    cy.get('input[name="username"]').type('João');
    cy.get('input[name="senha"]').type('senha-muito-errada');

    cy.log('Clicando no botão de login');
    cy.get('button[value="login"]').click();

    cy.log('Verificando a mensagem de erro');
    cy.url().should('not.include', '/home'); // Garante que não houve redirecionamento
    cy.contains('Senha incorreta!').should('be.visible');
  });

});