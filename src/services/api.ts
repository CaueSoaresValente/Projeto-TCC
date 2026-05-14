// ============================================================
// src/services/api.ts
// ============================================================
// Este arquivo centraliza TODAS as chamadas do frontend
// para o backend. Em vez de escrever "fetch(...)" em cada
// página Vue, chamamos funções daqui.
//
// COMO FUNCIONA:
// 1. O frontend roda na porta 3000 (Vite)
// 2. O backend roda na porta 3001 (Express)
// 3. O Vite tem um "proxy" configurado:
//    quando chamamos "/api/...", ele redireciona para :3001
// 4. Assim, não precisamos escrever "http://localhost:3001"
//    em lugar nenhum do frontend — basta usar "/api/..."
// ============================================================

// --- Onde o token JWT é guardado no navegador ---
const TOKEN_KEY = 'token';
const USER_KEY = 'usuario';

// ============================================================
// FUNÇÃO BASE — todas as outras usam esta
// ============================================================
async function request(url: string, options: RequestInit = {}) {
  // Força a porta 3001 do backend
  const baseUrl = 'http://localhost:3001';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  const token = localStorage.getItem(TOKEN_KEY);

  // Monta os headers padrão
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Se tem token, adiciona no header Authorization
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Faz a requisição HTTP
  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // Se deu erro, lança uma exceção
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ${response.status}`);
  }

  // Se não houver conteúdo (ex: DELETE com status 204), não tentamos parsear o JSON
  if (response.status === 204) {
    return null;
  }

  // Retorna os dados em JSON
  return response.json().catch(() => ({}));
}

// ============================================================
// AUTH — Login e Recuperação de Senha
// ============================================================

/**
 * Faz login com email e senha.
 * Se der certo, salva o token e os dados do usuário no localStorage.
 */
export async function login(email: string, senha: string) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });

  // Salva o token e o usuário no navegador
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));

  return data;
}

/**
 * Solicita recuperação de senha por e-mail.
 */
export async function recuperarSenha(email: string) {
  return request('/api/auth/recuperar', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Faz logout — apaga o token e os dados do navegador.
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Retorna o usuário logado (ou null).
 */
export function getUsuarioLogado() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Verifica se o usuário está logado.
 */
export function estaLogado(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

// ============================================================
// CADASTRO — Criar novo usuário
// ============================================================

/**
 * Cria um novo cadastro (gestor, opp ou professor).
 */
export async function criarCadastro(dados: {
  nome: string;
  email: string;
  senha: string;
  funcao: string;
}) {
  return request('/api/cadastro', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/**
 * Busca um cadastro pelo ID.
 */
export async function buscarCadastro(id: number) {
  return request(`/api/cadastro/${id}`);
}

/**
 * Lista todos os cadastros (usuários).
 */
export async function listarCadastros() {
  return request('/api/cadastro');
}

/**
 * Atualiza um cadastro existente.
 */
export async function editarCadastro(id: number, dados: any) {
  return request(`/api/cadastro/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

/**
 * Exclui um cadastro.
 */
export async function excluirCadastro(id: number) {
  return request(`/api/cadastro/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================
// ÁREAS — CRUD completo
// ============================================================
// Estas funções chamam o backend para gerenciar as áreas.
// O backend salva tudo no banco de dados MySQL.
// ============================================================

/**
 * Lista todas as áreas cadastradas.
 * Retorna um array com: idArea, nome, status, unidadesCurriculares[]
 */
export async function listarAreas() {
  return request('/api/areas');
}

/**
 * Cria uma nova área.
 * @param dados - Objeto com o campo "nome" (obrigatório)
 */
export async function criarArea(dados: { nome: string }) {
  return request('/api/areas', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/**
 * Atualiza uma área existente.
 * @param id - ID da área que será atualizada
 * @param dados - Objeto com os campos que serão alterados
 */
export async function editarArea(id: number, dados: { nome: string }) {
  return request(`/api/areas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

/**
 * Exclui uma área.
 * @param id - ID da área que será excluída
 */
export async function excluirArea(id: number) {
  return request(`/api/areas/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================
// COMPETÊNCIAS (Unidades Curriculares) — CRUD completo
// ============================================================
// Na tela do usuário chamamos de "Competência",
// mas no banco o nome da tabela é "unidade_curricular".
// ============================================================

/**
 * Lista todas as competências cadastradas.
 * Retorna um array com: idUC, nome, descricao, idArea, area (objeto)
 */
export async function listarCompetencias() {
  return request('/api/competencias');
}

/**
 * Cria uma nova competência.
 * @param dados - Objeto com: nome, descricao, idArea
 */
export async function criarCompetencia(dados: {
  nome: string;
  descricao?: string;
  idArea: number;
}) {
  return request('/api/competencias', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/**
 * Atualiza uma competência existente.
 * @param id - ID da competência (idUC)
 * @param dados - Campos que serão alterados
 */
export async function editarCompetencia(id: number, dados: {
  nome?: string;
  descricao?: string;
  idArea?: number;
}) {
  return request(`/api/competencias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

/**
 * Exclui uma competência.
 * @param id - ID da competência (idUC)
 */
export async function excluirCompetencia(id: number) {
  return request(`/api/competencias/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================
// PROFESSOR — Buscar por Cadastro
// ============================================================
// Quando o professor faz login, o token tem o idUsuario (cadastro).
// Precisamos descobrir o idProfessor para usar nas rotas abaixo.
// ============================================================

/**
 * Busca o professor pelo ID do cadastro.
 * Retorna o objeto professor com idProfessor, idCadastro, status.
 */
export async function buscarProfessorPorCadastro(idCadastro: number) {
  return request(`/api/professor/cadastro/${idCadastro}`);
}

// ============================================================
// PROFESSOR — ÁREAS DE ATUAÇÃO — CRUD
// ============================================================
// Gerencia quais áreas cada professor escolheu.
// ============================================================

/**
 * Lista as áreas de atuação de um professor.
 * Retorna array com: idProfessorArea, idProfessor, idArea, area (objeto)
 */
export async function listarAreasProfessor(idProfessor: number) {
  return request(`/api/professor/${idProfessor}/areas`);
}

/**
 * Vincula uma nova área ao professor.
 * @param idProfessor - ID do professor
 * @param idArea - ID da área que o professor quer adicionar
 */
export async function adicionarAreaProfessor(idProfessor: number, idArea: number) {
  return request(`/api/professor/${idProfessor}/areas`, {
    method: 'POST',
    body: JSON.stringify({ idArea }),
  });
}

/**
 * Atualiza o vínculo de área do professor (troca a área).
 * @param id - ID do vínculo (idProfessorArea)
 * @param idArea - Novo ID da área
 */
export async function editarAreaProfessor(id: number, idArea: number) {
  return request(`/api/professor/areas/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ idArea }),
  });
}

/**
 * Remove o vínculo de área do professor.
 * @param id - ID do vínculo (idProfessorArea)
 */
export async function excluirAreaProfessor(id: number) {
  return request(`/api/professor/areas/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================
// PROFESSOR — UNIDADES CURRICULARES — CRUD
// ============================================================
// Gerencia quais UCs cada professor sabe ministrar,
// junto com o nível de competência (0 a 100%).
// ============================================================

/**
 * Lista as UCs de um professor.
 * Retorna array com: idProfessorUC, idUC, idProfessor, nivelCompetencia, unidadeCurricular (objeto)
 */
export async function listarUCsProfessor(idProfessor: number) {
  return request(`/api/professor/${idProfessor}/ucs`);
}

/**
 * Lista as UCs de uma área específica (para popular o dropdown).
 * @param idArea - ID da área
 */
export async function listarUCsPorArea(idArea: number) {
  return request(`/api/competencias/area/${idArea}`);
}

/**
 * Vincula uma UC ao professor com nível de competência.
 * @param idProfessor - ID do professor
 * @param idUC - ID da UC
 * @param nivelCompetencia - Nível de 0 a 100
 */
export async function adicionarUCProfessor(idProfessor: number, idUC: number, nivelCompetencia: number) {
  return request(`/api/professor/${idProfessor}/ucs`, {
    method: 'POST',
    body: JSON.stringify({ idUC, nivelCompetencia }),
  });
}

/**
 * Atualiza o nível de competência de uma UC do professor.
 * @param id - ID do vínculo (idProfessorUC)
 * @param nivelCompetencia - Novo nível de 0 a 100
 */
export async function editarUCProfessor(id: number, nivelCompetencia: number) {
  return request(`/api/professor/ucs/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ nivelCompetencia }),
  });
}

/**
 * Remove o vínculo de UC do professor.
 * @param id - ID do vínculo (idProfessorUC)
 */
export async function excluirUCProfessor(id: number) {
  return request(`/api/professor/ucs/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================
// PROFESSOR — CERTIFICAÇÕES — CRUD
// ============================================================
// Gerencia as certificações do professor (AWS, Scrum, etc.)
// ============================================================

/**
 * Lista as certificações de um professor.
 */
export async function listarCertificacoes(idProfessor: number) {
  return request(`/api/professor/${idProfessor}/certificacoes`);
}

/**
 * Cria uma nova certificação.
 * @param idProfessor - ID do professor
 * @param dados - Objeto com: nome, instituicao, cargaHoraria, dataObtencao
 */
export async function adicionarCertificacao(idProfessor: number, dados: {
  nome: string;
  instituicao?: string;
  cargaHoraria?: string;
  dataObtencao?: string;
}) {
  return request(`/api/professor/${idProfessor}/certificacoes`, {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/**
 * Atualiza uma certificação existente.
 * @param id - ID da certificação
 * @param dados - Campos que serão alterados
 */
export async function editarCertificacao(id: number, dados: {
  nome?: string;
  instituicao?: string;
  cargaHoraria?: string;
  dataObtencao?: string;
}) {
  return request(`/api/professor/certificacoes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

/**
 * Exclui uma certificação.
 * @param id - ID da certificação
 */
export async function excluirCertificacao(id: number) {
  return request(`/api/professor/certificacoes/${id}`, {
    method: 'DELETE',
  });
}

