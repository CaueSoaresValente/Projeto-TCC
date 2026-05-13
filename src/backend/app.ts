// ============================================================
// src/backend/app.ts
// ============================================================
// Este é o arquivo principal do backend Express.
// Aqui registramos TODAS as rotas da aplicação.
//
// COMO ADICIONAR UMA NOVA ROTA:
// 1. Importe o Controller do módulo
// 2. Instancie o Controller
// 3. Registre a rota com app.get/post/put/delete
// ============================================================

import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './modules/auth/auth.middleware.js';
import { AuthController } from './modules/auth/auth.controller.js';
import { CadastroController } from './modules/cadastro/cadastro.controller.js';
import { AreaController } from './modules/area/area.controller.js';
import { UnidadeCurricularController } from './modules/disciplina/unidade-curricular.controller.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ====================== INSTÂNCIA DOS CONTROLLERS ======================
const authController = new AuthController();
const cadastroController = new CadastroController();
const areaController = new AreaController();
const ucController = new UnidadeCurricularController();

// ====================== ROTAS DE AUTENTICAÇÃO ======================
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/recuperar', (req, res) => authController.recuperarSenha(req, res));

// ====================== ROTAS DE CADASTRO ======================
app.get('/api/cadastro/:id', authMiddleware(['gestor', 'opp', 'professor']), (req, res) => cadastroController.findById(req, res));
app.post('/api/cadastro', (req, res) => cadastroController.create(req, res));

// ====================== ROTAS DE ÁREAS ======================
// Estas rotas permitem gerenciar as áreas (Tecnologia, Manutenção, etc.)
app.get('/api/areas', (req, res) => areaController.list(req, res));
app.post('/api/areas', (req, res) => areaController.create(req, res));
app.put('/api/areas/:id', (req, res) => areaController.update(req, res));
app.delete('/api/areas/:id', (req, res) => areaController.delete(req, res));

// ====================== ROTAS DE COMPETÊNCIAS (UCs) ======================
// Estas rotas permitem gerenciar as competências/unidades curriculares
app.get('/api/competencias', (req, res) => ucController.list(req, res));
app.post('/api/competencias', (req, res) => ucController.create(req, res));
app.put('/api/competencias/:id', (req, res) => ucController.update(req, res));
app.delete('/api/competencias/:id', (req, res) => ucController.delete(req, res));

export default app;
