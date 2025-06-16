const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Importar a rota que queremos testar
const loginRouter = require('../routes/login');

// Mock do modelo User para não depender do banco de dados nos testes unitários
jest.mock('../models/User', () => {
    const originalBcrypt = jest.requireActual('bcryptjs');
    const mockUsers = {}; // Simula nosso banco de dados em memória

    return {
        findOne: jest.fn(({ where: { name } }) => {
            if (mockUsers[name]) {
                return Promise.resolve(mockUsers[name]);
            }
            return Promise.resolve(null);
        }),
        create: jest.fn((user) => {
            const hashedPassword = originalBcrypt.hashSync(user.password, 10);
            const newUser = { ...user, id: Object.keys(mockUsers).length + 1, password: hashedPassword };
            mockUsers[user.name] = newUser;
            return Promise.resolve(newUser);
        }),
        // Adicionar um método para limpar os mocks entre os testes
        __clearMocks: () => {
            for (const key in mockUsers) {
                delete mockUsers[key];
            }
        }
    };
});

// Mock do bcrypt para controlar a comparação de senhas
jest.mock('bcryptjs', () => ({
    ...jest.requireActual('bcryptjs'), // Importa o bcrypt real
    compare: jest.fn((plainPassword, hashedPassword) => {
        // Para este mock, simplesmente retornamos true se as senhas forem iguais
        // Em um teste real, você poderia usar bcrypt.compareSync
        return Promise.resolve(plainPassword === "senhaCorreta");
    })
}));


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Montamos a rota no nosso app de teste
app.use('/', loginRouter);

describe('Cenário C1A1/C2A2 - Login válido e inválido', () => {

    const User = require('../models/User');
    const bcrypt = require('bcryptjs');

    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        User.findOne.mockClear();
        User.create.mockClear();
        User.__clearMocks();
        bcrypt.compare.mockClear();
    });

    // Teste para a História H1A1: "Quero criar uma conta na plataforma"
    test('Deve cadastrar um novo usuário com sucesso', async () => {
        const response = await request(app)
            .post('/cadastroelogin')
            .send({ action: 'cadastro', username: 'novoUsuario', senha: '123' });

        // Esperamos que o model User.create tenha sido chamado
        expect(User.create).toHaveBeenCalled();
        // Esperamos um redirecionamento após o cadastro
        expect(response.status).toBe(302);
    });

    test('Não deve cadastrar um usuário que já existe', async () => {
        // Primeiro, criamos um usuário
        await request(app).post('/cadastroelogin').send({ action: 'cadastro', username: 'usuarioExistente', senha: '123' });

        // Agora, tentamos cadastrar de novo
        const response = await request(app)
            .post('/cadastroelogin')
            .send({ action: 'cadastro', username: 'usuarioExistente', senha: '123' });
        
        // Esperamos que a criação não seja chamada uma segunda vez
        expect(User.create).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(302); // Deve redirecionar com a mensagem de erro
    });

    // Teste para a História H2A1: "Quero fazer login com minhas credenciais"
    test('Deve fazer login com sucesso com credenciais corretas', async () => {
        // Cadastra um usuário para o teste de login
        await request(app).post('/cadastroelogin').send({ action: 'cadastro', username: 'usuarioLogin', senha: 'senhaCorreta' });
        
        const response = await request(app)
            .post('/cadastroelogin')
            .send({ action: 'login', username: 'usuarioLogin', senha: 'senhaCorreta' });

        // Espera que o login seja bem-sucedido e redirecione para a home
        expect(response.status).toBe(302);
        expect(response.headers.location).toMatch(/\/home\/\d+/);
    });

    test('Não deve fazer login com senha incorreta', async () => {
         // Cadastra um usuário para o teste de login
         await request(app).post('/cadastroelogin').send({ action: 'cadastro', username: 'usuarioLogin', senha: 'senhaCorreta' });
        
         const response = await request(app)
             .post('/cadastroelogin')
             .send({ action: 'login', username: 'usuarioLogin', senha: 'senhaErrada' });
 
        // Espera um redirecionamento de volta para a página de login com mensagem de erro
         expect(response.status).toBe(302);
         expect(response.headers.location).toBe('/?msg=Senha%20incorreta!');
    });

});