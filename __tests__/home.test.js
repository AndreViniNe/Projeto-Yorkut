const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const homeRouter = require('../routes/home');

// Mock dos modelos para isolar o teste do banco de dados
jest.mock('../models/User', () => ({ findOne: jest.fn() }));
jest.mock('../models/Post', () => ({ create: jest.fn(), findAll: jest.fn() }));
jest.mock('../models/Group', () => ({ findOne: jest.fn() }));
jest.mock('../models/Members', () => ({ findAll: jest.fn() }));
jest.mock('../models/Friends', () => ({ findAll: jest.fn() }));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Monta a rota na raiz para facilitar os testes
app.use('/', homeRouter);

describe('Testes da Rota de Home (/home)', () => {
    // Importa os mocks para poder resetá-los
    const Post = require('../models/Post');
    const Friends = require('../models/Friends');
    const Members = require('../models/Members');

    beforeEach(() => {
        jest.clearAllMocks();
        // Configura um retorno padrão para chamadas que buscam amigos e grupos para evitar erros
        Friends.findAll.mockResolvedValue([]);
        Members.findAll.mockResolvedValue([]);
    });

    /**
     * Teste para o Cenário C413 (Deixar Depoimentos)
     * e Cenário C5P1 (Criar Novo Tópico)
     */
    describe('Cenário C413/C5P1 - Criação de Post/Depoimento', () => {
        it('Deve criar um novo post com sucesso quando os dados são válidos', async () => {
            const userId = '1';
            const requestBody = {
                mensagem: 'Este é um novo post de teste!',
            };
            const queryParams = {
                destination: '2', // ID do amigo ou grupo
                tp: '0', // 0 para amigo, 1 para grupo
            };

            const response = await request(app)
                .post(`/${userId}/addpost?destination=${queryParams.destination}&tp=${queryParams.tp}`)
                .send(requestBody);

            expect(Post.create).toHaveBeenCalledWith({
                content: requestBody.mensagem,
                author: userId,
                destination: queryParams.destination,
                destinationtp: queryParams.tp,
            });
            expect(response.status).toBe(302); // Espera um redirecionamento
            expect(response.headers.location).toContain('msg=Postagem%20realizada%20com%20sucesso!');
        });

        it('Não deve criar um post se o conteúdo estiver vazio', async () => {
            const userId = '1';
            const requestBody = {
                mensagem: ' ', // Mensagem vazia
            };
            const queryParams = {
                destination: '2',
                tp: '0',
            };

            const response = await request(app)
                .post(`/${userId}/addpost?destination=${queryParams.destination}&tp=${queryParams.tp}`)
                .send(requestBody);
            
            expect(Post.create).not.toHaveBeenCalled();
            expect(response.status).toBe(302);
            expect(response.headers.location).toContain('msg=Insira%20uma%20mensagem%20antes%20de%20continuar!');
        });
    });
});