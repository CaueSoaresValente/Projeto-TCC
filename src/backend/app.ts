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
import { ProfessorAreaController } from './modules/professor/professor-area.controller.js';
import { ProfessorUCController } from './modules/professor/professor-uc.controller.js';
import { CertificacaoController } from './modules/professor/certificacao.controller.js';
import { ProfessorController } from './modules/professor/professor.controller.js';
import { DisponibilidadeController } from './modules/disponibilidade/disponibilidade.controller.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ====================== INSTÂNCIA DOS CONTROLLERS ======================
const authController = new AuthController();
const cadastroController = new CadastroController();
const areaController = new AreaController();
const ucController = new UnidadeCurricularController();
const profAreaController = new ProfessorAreaController();
const profUCController = new ProfessorUCController();
const certificacaoController = new CertificacaoController();
const professorController = new ProfessorController();
const disponibilidadeController = new DisponibilidadeController();

// ====================== ROTAS DE AUTENTICAÇÃO ======================
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/recuperar', (req, res) => authController.recuperarSenha(req, res));

// ====================== ROTAS DE CADASTRO ======================
app.get('/api/cadastro', authMiddleware(['gestor']), (req, res) => cadastroController.listAll(req, res));
app.get('/api/cadastro/:id', authMiddleware(['gestor', 'opp', 'professor']), (req, res) => cadastroController.findById(req, res));
app.post('/api/cadastro', (req, res) => cadastroController.create(req, res));
app.put('/api/cadastro/:id', authMiddleware(['gestor']), (req, res) => cadastroController.update(req, res));
app.delete('/api/cadastro/:id', authMiddleware(['gestor']), (req, res) => cadastroController.delete(req, res));

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

// ====================== ROTA PARA BUSCAR PROFESSOR POR CADASTRO ======================
// Quando o professor faz login, sabemos o idUsuario (cadastro).
// Com essa rota, descobrimos o idProfessor para usar nas rotas abaixo.
app.get('/api/professor/cadastro/:idCadastro', (req, res) => professorController.findByCadastro(req, res));
app.post('/api/professor', (req, res) => professorController.create(req, res));

// ====================== ROTAS DE ÁREAS DO PROFESSOR ======================
// Estas rotas gerenciam quais áreas cada professor escolheu.
// Ex: Professor João escolheu "Tecnologia" e "Informática".
app.get('/api/professor/:idProfessor/areas', (req, res) => profAreaController.list(req, res));
app.post('/api/professor/:idProfessor/areas', (req, res) => profAreaController.create(req, res));
app.put('/api/professor/areas/:id', (req, res) => profAreaController.update(req, res));
app.delete('/api/professor/areas/:id', (req, res) => profAreaController.delete(req, res));

// ====================== ROTAS DE UCs DO PROFESSOR ======================
// Estas rotas gerenciam as Unidades Curriculares do professor.
// O professor primeiro escolhe uma área, depois escolhe uma UC daquela área.
app.get('/api/professor/:idProfessor/ucs', (req, res) => profUCController.list(req, res));
app.get('/api/competencias/area/:idArea', (req, res) => profUCController.listByArea(req, res));
app.post('/api/professor/:idProfessor/ucs', (req, res) => profUCController.create(req, res));
app.put('/api/professor/ucs/:id', (req, res) => profUCController.update(req, res));
app.delete('/api/professor/ucs/:id', (req, res) => profUCController.delete(req, res));

// ====================== ROTAS DE CERTIFICAÇÕES DO PROFESSOR ======================
// Estas rotas gerenciam as certificações (AWS, Scrum, Google, etc.)
app.get('/api/professor/:idProfessor/certificacoes', (req, res) => certificacaoController.list(req, res));
app.post('/api/professor/:idProfessor/certificacoes', (req, res) => certificacaoController.create(req, res));
app.put('/api/professor/certificacoes/:id', (req, res) => certificacaoController.update(req, res));
app.delete('/api/professor/certificacoes/:id', (req, res) => certificacaoController.delete(req, res));

// ====================== ROTAS DE DISPONIBILIDADE DO PROFESSOR ======================
// Gerenciam quando o professor pode dar aula (por dia e período).
// Um professor pode ter VÁRIOS períodos no mesmo dia (ex: Manhã e Tarde na Segunda).
app.get('/api/professor/:idProfessor/disponibilidade', (req, res) => disponibilidadeController.findByProfessor(req, res));
app.post('/api/professor/:idProfessor/disponibilidade', (req, res) => disponibilidadeController.adicionar(req, res));
app.put('/api/professor/:idProfessor/disponibilidade', (req, res) => disponibilidadeController.sincronizarSemana(req, res));
app.delete('/api/professor/disponibilidade/:id', (req, res) => disponibilidadeController.remover(req, res));

export default app;

