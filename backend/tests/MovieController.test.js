const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const MovieController = require('../controllers/MovieController');
const MovieService = require('../services/MovieService');
const Movie = require('../models/Movie');

// Mock do MovieService e do Movie
jest.mock('../services/MovieService');
jest.mock('../models/Movie');

const app = express();
app.use(bodyParser.json());

describe('MovieController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve adicionar um filme com sucesso', async () => {
        MovieService.addMovie.mockResolvedValue({ message: 'Movie added successfully' });

        // Configurar a rota e middleware para o teste específico
        app.post('/movies/add', MovieController.addMovie);

        const response = await request(app)
            .post('/movies/add')
            .send({ title: 'Inception', movieId: '12345', label: 'PretendoAssistir' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Movie added successfully' });
    });

    it('deve retornar erro 400 se campos obrigatórios estiverem faltando', async () => {
        // Configurar a rota e middleware para o teste específico
        app.post('/movies/add', MovieController.addMovie);

        const response = await request(app)
            .post('/movies/add')
            .send({ title: 'Inception' }); // movieId está faltando

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    it('deve retornar erro 401 se o usuário não estiver autenticado', async () => {
        // Configurar o middleware e a rota para o teste específico
        app.use((req, res, next) => {
            req.user = {}; // Usuário não autenticado
            next();
        });
        app.post('/movies/add', MovieController.addMovie);

        const response = await request(app)
            .post('/movies/add')
            .send({ title: 'Inception', movieId: '12345' });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Unauthorized' });
    });

    it('deve retornar erro 400 se o serviço falhar', async () => {
        MovieService.addMovie.mockRejectedValue(new Error('Failed to add movie'));

        // Configurar a rota e middleware para o teste específico
        app.post('/movies/add', MovieController.addMovie);

        const response = await request(app)
            .post('/movies/add')
            .send({ title: 'Inception', movieId: '12345', label: 'PretendoAssistir' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Failed to add movie' });
    });
});

describe('MovieService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve adicionar um filme com sucesso', async () => {
        Movie.findByMovieId.mockResolvedValue(null); // Não há filme com o mesmo ID
        Movie.findAllMoviesByUser.mockResolvedValue([]); // Nenhum filme existente com o mesmo título
        Movie.create.mockResolvedValue({ message: 'Movie added successfully' });

        const result = await MovieService.addMovie(1, 'Inception', 'PretendoAssistir', '12345');
        expect(result).toEqual({ message: 'Movie added successfully' });
    });

    it('deve lançar erro se o label não for permitido', async () => {
        const allowedLabels = ['Assistido', 'Favorito']; // Mockando a lista de labels permitidos
        MovieService.allowedLabels = allowedLabels; // Definindo a lista permitida

        await expect(MovieService.addMovie(1, 'Inception', 'UnknownLabel', '12345'))
            .rejects
            .toThrow('Label \'UnknownLabel\' não é permitido. Allowed labels: Assistido, Favorito');
    });

    it('deve lançar erro se o movieId já existir', async () => {
        Movie.findByMovieId.mockResolvedValue({ id: '12345' }); // Retorna um filme existente

        await expect(MovieService.addMovie(1, 'Inception', 'PretendoAssistir', '12345'))
            .rejects
            .toThrow('Movie with this ID already exists for the user');
    });

    it('deve lançar erro se o título já existir', async () => {
        Movie.findByMovieId.mockResolvedValue(null);
        Movie.findAllMoviesByUser.mockResolvedValue([{ title: 'Inception' }]); // Filme com o mesmo título existente

        await expect(MovieService.addMovie(1, 'Inception', 'PretendoAssistir', '67890'))
            .rejects
            .toThrow('Movie with this title already exists for the user');
    });
});
