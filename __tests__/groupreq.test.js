const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const groupreqRouter = require('../routes/groupreq');

// Mock dos modelos
jest.mock('../models/User', () => ({ findOne: jest.fn() }));
jest.mock('../models/Group', () => ({ findAll: jest.fn() }));
jest.mock('../models/Friends', () => ({ findAll: jest.fn() }));
jest.mock('../models/Members', () => ({
    findAll: jest.fn(),
    update: jest.fn(),
}));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', groupreqRouter);

describe('Testes da Rota de Requisições de Grupo (/groupreq)', () => {
    const Members = require('../models/Members');
    const Group = require('../models/Group');
    const Friends = require('../models/Friends');
    
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock padrão para as buscas de lista
        Group.findAll.mockResolvedValue([]);
        Members.findAll.mockResolvedValue([]);
        Friends.findAll.mockResolvedValue([]);
    });

    /**
     * Teste para o Cenário C6A1 (Gerenciar Membros),
     * validando a etapa de aceitação de um novo membro.
     */
    describe('Cenário C6A1 - Aceitar Pedido de Membro', () => {
        it('Deve atualizar o status do membro para 1 (aceito) ao receber um POST em /:id/addGroup', async () => {
            const adminId = '1'; // O admin do grupo que está aceitando
            const memberId = '2'; // O usuário que quer entrar
            const groupId = '10'; // O ID do grupo

            Members.update.mockResolvedValue([1]); // Simula a atualização bem-sucedida

            const response = await request(app)
                .post(`/${adminId}/addGroup?gId=${groupId}&mId=${memberId}`);

            expect(Members.update).toHaveBeenCalledWith(
                { status: 1 }, // O que será atualizado
                { where: { memberId: memberId, groupID: groupId, status: 0 } } // Condição
            );

            expect(response.status).toBe(302);
            expect(response.headers.location).toContain('msggp=Solicita%C3%A7%C3%A3o%20aceita%20com%20sucesso!');
        });
    });
});