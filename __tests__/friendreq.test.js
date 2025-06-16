const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const friendreqRouter = require('../routes/friendreq');

// Mock dos modelos
jest.mock('../models/User', () => ({ findOne: jest.fn() }));
jest.mock('../models/Group', () => ({ findOne: jest.fn() }));
jest.mock('../models/Members', () => ({ findAll: jest.fn() }));
jest.mock('../models/Friends', () => ({
    findAll: jest.fn(),
    update: jest.fn(),
}));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', friendreqRouter);

describe('Testes da Rota de Requisições de Amizade (/friendreq)', () => {
    const Friends = require('../models/Friends');
    
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock padrão para a busca de listas
        Friends.findAll.mockResolvedValue([]);
    });

    /**
     * Teste que complementa o Cenário C411 (Adicionar como Amigo),
     * validando a etapa de aceitação do pedido.
     */
    describe('Cenário C411 - Aceitar Pedido de Amizade', () => {
        it('Deve atualizar o status da amizade para 1 (aceito) ao receber um POST em /:id/add', async () => {
            const userId = '1'; // O usuário que está aceitando o pedido
            const friendId = '2'; // O usuário que enviou o pedido

            // Simula uma atualização bem-sucedida
            Friends.update.mockResolvedValue([1]); // Retorna o número de linhas afetadas

            const response = await request(app)
                .post(`/${userId}/add?fId=${friendId}`);

            expect(Friends.update).toHaveBeenCalledWith(
                { status: 1 }, // O que será atualizado
                { where: { userID: friendId, friendID: userId, status: 0 } } // Condição
            );

            expect(response.status).toBe(302);
            expect(response.headers.location).toContain('msg=Solicita%C3%A7%C3%A3o%20aceita%20com%20sucesso!');
        });
    });
});