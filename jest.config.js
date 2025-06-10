module.exports = {
  // O ambiente de teste que será usado para o teste
  testEnvironment: 'node',

  // Desativa o cache para evitar problemas em ambientes de CI
  cache: false,

  // Um padrão de glob que indica um conjunto de arquivos para os quais a cobertura deve ser coletada
  collectCoverageFrom: ['**/routes/*.js', '**/models/*.js'],

  // Indica se a cobertura de código deve ser relatada durante a execução do teste
  collectCoverage: true,

  // Diretório onde o Jest deve gerar seus arquivos de relatório de cobertura
  coverageDirectory: 'coverage',

  // Uma lista de nomes de repórteres que o Jest usa para escrever relatórios de cobertura
  coverageReporters: ['text', 'lcov'],
};