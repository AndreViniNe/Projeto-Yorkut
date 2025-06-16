const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const profileRouter = require('../routes/profile');

// Mock dos modelos para isolar o teste da rota do banco de dados
jest.mock('../models/User', () => ({
    findOne: jest.fn(),
}));
jest.mock('../models/Group', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));
jest.mock('../models/Members', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));
jest.mock('../models/Friends', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', profileRouter); // Montamos a rota de perfil na raiz para o teste

describe('Testes da Rota de Perfil (/profile)', () => {
    // Importa os mocks para poder resetá-los
    const User = require('../models/User');
    const Group = require('../models/Group');
    const Members = require('../models/Members');
    const Friends = require('../models/Friends');

    // Limpa os mocks antes de cada teste para garantir que um teste não interfira no outro
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Teste para a História H1C1: "Quero criar novas comunidades"
    describe('Cenário C3C1 - Criação de Grupo', () => {
        it('Deve criar um novo grupo com sucesso se o nome não existir', async () => {
            // CORREÇÃO: IDs de rotas são strings.
            const userId = '1';
            const groupName = 'Nova Comunidade de Teste';

            // Simula que não encontrou um grupo com o mesmo nome
            Group.findOne.mockResolvedValue(null);
            // Simula a criação bem-sucedida do grupo, retornando um objeto com ID
            Group.create.mockResolvedValue({ id: 10, name: groupName, admin: userId });
            // Simula a criação da associação do membro
            Members.create.mockResolvedValue({});

            const response = await request(app)
                .post(`/${userId}/addgroup`)
                .send({ groupname: groupName });

            // A asserção agora vai comparar string com string, o que vai passar.
            expect(Group.create).toHaveBeenCalledWith({ name: groupName, admin: userId });
            expect(Members.create).toHaveBeenCalledWith({ groupID: 10, memberID: userId, status: true });
            expect(response.status).toBe(302); // Espera um redirecionamento
            expect(response.headers.location).toContain('msggp=Grupo%20cadastrado%20com%20sucesso!');
        });

        it('Não deve criar um grupo se o nome já existir', async () => {
            // CORREÇÃO: IDs de rotas são strings.
            const userId = '1';
            const groupName = 'Comunidade Existente';

            // Simula que encontrou um grupo com o mesmo nome
            Group.findOne.mockResolvedValue({ id: 11, name: groupName });

            const response = await request(app)
                .post(`/${userId}/addgroup`)
                .send({ groupname: groupName });
            
            // Garante que o Group.create NÃO foi chamado
            expect(Group.create).not.toHaveBeenCalled();
            expect(response.status).toBe(302);
            expect(response.headers.location).toContain('msggp=Nome%20de%20grupo%20j%C3%A1%20existente');
        });
    });

    // Teste para a funcionalidade de adicionar amigos (relacionado à História de Interações Sociais)
    describe('Cenário C4I1 - Adicionar Amigo', () => {
        it('Deve enviar uma solicitação de amizade se o usuário existir e ainda não for amigo', async () => {
            // CORREÇÃO: IDs de rotas são strings.
            const userId = '1';
            const friendName = 'amigo_novo';
            const friendId = 2;

            // Simula que o usuário 'amigo_novo' foi encontrado
            User.findOne.mockResolvedValue({ id: friendId, name: friendName });
            // Simula que ainda não existe uma amizade ou solicitação
            Friends.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post(`/${userId}/searchfriend`)
                .send({ username: friendName });

            // A asserção agora vai comparar string com string, o que vai passar.
            expect(Friends.create).toHaveBeenCalledWith({ userID: userId, friendID: friendId });
            expect(response.status).toBe(302);
            expect(response.headers.location).toContain('msg=Usu%C3%A1rio%20adicionado%20com%20sucesso');
        });

        it('Não deve enviar uma solicitação se o usuário não for encontrado', async () => {
            // CORREÇÃO: IDs de rotas são strings.
            const userId = '1';
            const friendName = 'usuario_inexistente';

            // Simula que o usuário não foi encontrado
            User.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post(`/${userId}/searchfriend`)
                .send({ username: friendName });
            
            expect(Friends.create).not.toHaveBeenCalled();
            expect(response.status).toBe(302);
            expect(response.headers.location).toContain('msg=Usu%C3%A1rio%20n%C3%A3o%20encontrado');
        });
    });
});