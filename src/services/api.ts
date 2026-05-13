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
  // Pega o token do localStorage (se existir)
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
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Se deu erro, lança uma exceção
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ${response.status}`);
  }

  // Retorna os dados em JSON
  return response.json();
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
