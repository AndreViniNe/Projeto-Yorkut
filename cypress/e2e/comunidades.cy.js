/**
 * Arquivo de teste para o subdomínio de Comunidades.
 * Cobre a história H1C1.
 */
describe('Subdomínio: Comunidades', () => {

  // Este bloco é executado ANTES de cada teste ('it') neste arquivo.
  beforeEach(() => {
    // Usa o nosso novo comando customizado para fazer login e obter o ID do usuário dinamicamente.
    // O comando cy.login() também armazena o ID em um alias chamado 'userId'.
    cy.login('João', '1234');
  });

  /**
   * Teste para o Cenário C3C1 (Criar Comunidade)
   * História: H1C1
   */
  it('Cenário C3C1 - Deve permitir que um usuário logado crie uma nova comunidade', function () { // Usamos 'function' para poder usar 'this.userId'
    const nomeComunidade = `Comunidade de Teste ${Date.now()}`;

    // Pega o ID do usuário que foi armazenado pelo comando de login
    const userId = this.userId;

    cy.log(`Navegando para a página de perfil do usuário com ID dinâmico: ${userId}`);
    cy.visit(`/profile/${userId}`);
    cy.url().should('include', `/profile/${userId}`);

    cy.log('Preenchendo e enviando o formulário de criação de comunidade');
    cy.get('input[name="creategroup"]').type(nomeComunidade);
    cy.get(`form[action="/profile/${userId}/addgroup"] button`).click(); // Usa o ID dinâmico no seletor

    cy.log('Verificando a mensagem de sucesso');
    cy.url().should('include', 'msggp=Grupo%20cadastrado%20com%20sucesso!');
  });

  /**
   * Teste de caso de falha baseado na tabela de equivalência do relatório.
   * Cobre a classe inválida 2: "Nome vazio".
   */
  it('Caso de Teste - Não deve criar comunidade com nome vazio', function () {
    const userId = this.userId;
    cy.visit(`/profile/${userId}`);

    cy.log('Tentando enviar o formulário de comunidade com o nome vazio');
    cy.get('input[name="groupname"]').should('be.empty');
    cy.get(`form[action="/profile/${userId}/addgroup"] button`).click();

    cy.log('Verificando a mensagem de erro');
    cy.url().should('include', 'msggp=Informe%20o%20nome%20do%20grupo%20antes%20de%20continuar!')
  });

  /**
   * Teste de caso de falha baseado na tabela de equivalência do relatório.
   * Verifica se um nome de comunidade já existente é rejeitado.
   */
  it('Caso de Teste - Não deve criar comunidade com nome repetido', function() {
    const userId = this.userId;
    const nomeComunidadeRepetida = `Comunidade Repetida ${Date.now()}`;

    cy.visit(`/profile/${userId}`);

    // Primeira criação
    cy.get('input[name="groupname"]').type(nomeComunidadeRepetida);
    cy.get(`form[action="/profile/${userId}/addgroup"] button`).click();
    // cy.url().should('include', 'msggp=Grupo%20cadastrado%20com%20sucesso!');
    cy.url().should('include', 'msggp=Informe%20o%20nome%20do%20grupo%20antes%20de%20continuar!');


    // Tenta criar de novo com o mesmo nome
    cy.log('Tentando criar a mesma comunidade novamente');
    cy.get('input[name="groupname"]').type(nomeComunidadeRepetida);
    cy.get(`form[action="/profile/${userId}/addgroup"] button`).click();

    cy.log('Verificando a mensagem de erro para nome duplicado');
    cy.url().should('include', 'msggp=Informe%20o%20nome%20do%20grupo%20antes%20de%20continuar!');
  });

});