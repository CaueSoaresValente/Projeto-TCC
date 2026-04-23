import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './modules/auth/auth.middleware.js';
import { AuthController } from './modules/auth/auth.controller.js';
import { CadastroController } from './modules/cadastro/cadastro.controller.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authController = new AuthController();
const cadastroController = new CadastroController();

// Rotas de Autenticação
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/recuperar', (req, res) => authController.recuperarSenha(req, res));

// Rotas Protegidas (Exemplo)
app.get('/api/cadastro/:id', authMiddleware(['gestor', 'opp', 'professor']), (req, res) => cadastroController.findById(req, res));
app.post('/api/cadastro', (req, res) => cadastroController.create(req, res));

export default app;
