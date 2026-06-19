# 🎓 Sistema de Gestão de Professores e Alocação de Turmas (TCC)

> **Trabalho de Conclusão de Curso (TCC)** desenvolvido para a instituição **SENAI (Serviço Nacional de Aprendizagem Industrial)**. Este projeto foi concebido para automatizar e otimizar a coordenação de professores, suas disponibilidades e a alocação de turmas/unidades curriculares, eliminando conflitos de horários e simplificando o processo de planejamento acadêmico.

---

## 📋 Contexto do Projeto

Em instituições de ensino técnico e profissionalizante como o **SENAI**, a gestão de docentes e a distribuição de turmas é um processo altamente complexo. Os coordenadores e orientadores enfrentam desafios diários como:
* Coordenar a disponibilidade de horários dos professores (que frequentemente trabalham em diferentes turnos ou regime de horista).
* Garantir que cada professor lecione apenas Unidades Curriculares (UCs) para as quais possui certificação ou competência comprovada.
* Evitar choques de horários e sobreposição de aulas durante a alocação de turmas.

Este sistema oferece uma plataforma centralizada e inteligente onde os **Gestores** e **Orientadores de Prática Profissional (OPPs)** conseguem planejar as turmas, enquanto os **Professores** gerenciam diretamente suas competências, certificações e janelas de disponibilidade de horário em tempo real.

---

## 🛠️ Tecnologias Utilizadas

A solução adota uma arquitetura fullstack moderna baseada em TypeScript:

### **Frontend**
* **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Estilização & Componentes:** [Vuetify 4](https://vuetifyjs.com/) & [Tailwind CSS 4](https://tailwindcss.com/)
* **Validação:** [Vuelidate](https://vuelidate.js.org/)
* **Roteamento:** [Vue Router](https://router.vuejs.org/)

### **Backend**
* **Ambiente de Execução:** [Node.js](https://nodejs.org/) com [TypeScript](https://www.typescriptlang.org/)
* **Framework Web:** [Express](https://expressjs.com/)
* **Persistência de Dados (ORM):** [TypeORM](https://typeorm.io/)
* **Comunicação em Tempo Real:** [WebSockets (ws)](https://github.com/websockets/ws)
* **Autenticação:** JWT (JSON Web Tokens) & Google OAuth

### **Banco de Dados & Deploy**
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) (Hospedado na plataforma Serverless [Neon DB](https://neon.tech/))
* **Hospedagem & Deploy:** [Vercel](https://vercel.com/) (configurado via `vercel.json` para hospedar tanto a SPA em Vue quanto a API Serverless)

---

## ⚙️ Arquitetura e Fluxo do Sistema

O sistema é dividido em três perfis de usuários com permissões específicas (Role-Based Access Control - RBAC):

```mermaid
flowchart TD
    A[Usuário] --> B{Login / Autenticação}
    B -->|Gestor| C[Módulo do Gestor]
    B -->|OPP| D[Módulo do OPP]
    B -->|Professor| E[Módulo do Professor]

    C --> C1[CRUD de Usuários / Cadastros]
    C --> C2[Gerenciar Áreas & Competências]
    C --> C3[Planejar Turmas & Alocações]
    
    D --> D1[Visualizar Perfis de Professores da sua Área]
    D --> D2[Alocar Professores Elegíveis nas Turmas]
    
    E --> E1[Editar Informações de Perfil]
    E --> E2[Selecionar Áreas de Atuação & UCs]
    E --> E3[Cadastrar Certificações]
    E --> E4[Definir Grade de Disponibilidade Semanal]
    E --> E5[Visualizar Calendário de Aulas Alocadas]
```

### 👥 Perfis de Acesso e Funcionalidades

#### **1. Gestor (Administrador)**
* **Controle Total:** Criação, edição e exclusão de contas de usuários (Professores, OPPs e outros Gestores).
* **Gestão Estrutural:** Cadastro e manutenção das Áreas Tecnológicas (ex: Tecnologia da Informação, Metalmecânica) e suas respectivas Unidades Curriculares (UCs).
* **Gestão de Turmas:** Planejamento completo de novas turmas, definição de períodos letivos e cargas horárias.
* **Alocação de Professores:** Consulta em tempo real de professores elegíveis para cada turma e alocação direta.

#### **2. OPP (Orientador de Prática Profissional)**
* **Visão por Área:** Acesso focado no perfil dos professores vinculados às suas áreas de orientação.
* **Alocação Inteligente:** Filtra e busca automaticamente professores qualificados que tenham compatibilidade de horário (sem conflitos) para alocação nas turmas.
* **Monitoramento:** Acompanhamento do andamento e planejamento das turmas em sua jurisdição acadêmica.

#### **3. Professor**
* **Autodeclaração de Competências:** O próprio professor indica em quais áreas e disciplinas (UCs) está apto a lecionar.
* **Currículo Digital:** Cadastro de certificações profissionais para comprovação de competências.
* **Grade de Disponibilidade:** Painel interativo para preenchimento de quais dias da semana e turnos (Manhã, Tarde e Noite) está livre para trabalhar.
* **Calendário Pessoal:** Visualização unificada de todas as aulas e turmas em que foi alocado.

---

## 📁 Estrutura do Projeto

Abaixo está a organização principal de pastas do repositório:

```text
ProjetoTCC/
├── api/                  # Ponto de entrada da API para deploy na Vercel
├── public/               # Ativos públicos do frontend (ícones, imagens estáticas)
├── src/
│   ├── assets/           # Imagens e logotipos do sistema (incluindo Senai)
│   ├── components/       # Componentes Vue reutilizáveis (Menu, Footer, Modais)
│   ├── pages/            # Páginas/Telas do sistema organizadas por módulo
│   │   ├── Areas_Competencias/  # Telas de Gestão de Áreas e Disciplinas
│   │   ├── gestaoProfessores/   # Telas de visualização e busca de Professores
│   │   ├── login/               # Telas de Autenticação e Entrada
│   │   ├── perfil/              # Edição do Perfil do Usuário
│   │   ├── professor/           # Telas de uso exclusivo do Professor (Disponibilidade, Calendário)
│   │   └── turmas/              # Planejamento e Alocação de Turmas
│   ├── plugins/          # Configurações do Vuetify e dependências do Vue
│   ├── router/           # Configuração de rotas e guardas de navegação (Vue Router)
│   ├── services/         # Clientes de API HTTP (Axios/Fetch) e WebSockets
│   ├── styles/           # Arquivos de estilo (SASS, Tailwind CSS)
│   │
│   └── backend/          # Código-fonte do Backend (Node.js + Express)
│       ├── config/       # Configuração de conexão do banco de dados (TypeORM)
│       ├── database/     # Migrações e scripts do banco de dados
│       ├── modules/      # Controladores, Entidades e Serviços organizados por domínio
│       │   ├── auth/     # Lógica de Login, JWT e Google OAuth
│       │   ├── cadastro/ # Gestão de contas de usuários
│       │   ├── professor/# Perfis de professores, certificados e agendas
│       │   └── ...
│       ├── scripts/      # Scripts de utilidade para o banco de dados
│       └── shared/       # Gerenciadores e utilitários compartilhados (Ex: WebSocket)
│
├── vercel.json           # Configurações de rotas e builds para a Vercel
├── vite.config.mts       # Configuração do Vite (empacotador frontend)
├── tsconfig.json         # Configurações gerais do TypeScript
└── package.json          # Manifesto de dependências e scripts de execução
```

---

## 🚀 Como Executar o Projeto Localmente

### **Pré-requisitos**
* [Node.js](https://nodejs.org/) (Recomendado versão 18 ou superior)
* Um banco de dados [PostgreSQL](https://www.postgresql.org/) (pode ser local ou remoto como o Neon)

### **Passo 1: Clonar o Repositório e Instalar Dependências**
Abra o terminal no diretório do projeto e execute:
```bash
npm install
```

### **Passo 2: Configurar as Variáveis de Ambiente**
Crie um arquivo chamado `.env` na raiz do projeto (use as configurações abaixo como modelo):
```env
# Banco de Dados (Exemplo com Neon ou PostgreSQL Local)
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_banco?sslmode=require

# Chave secreta para assinatura dos tokens JWT
JWT_SECRET=sua_chave_secreta_aqui

# Integração com Google OAuth (Login com Google)
GOOGLE_CLIENT_ID=seu_client_id_do_google.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=seu_client_id_do_google.apps.googleusercontent.com
```

### **Passo 3: Executar o Banco de Dados (Migrations)**
Para criar todas as tabelas necessárias no seu banco de dados PostgreSQL, execute o script de migração:
```bash
# Executa a inicialização do banco local e criação de tabelas
npx tsx src/backend/scripts/init-local-db.ts
```

### **Passo 4: Executar a Aplicação em Modo de Desenvolvimento**

Para testar localmente, você precisará rodar o **Frontend** e o **Backend** em paralelo. Você pode fazer isso abrindo dois terminais:

* **Terminal 1 (Frontend):**
  ```bash
  npm run dev
  ```
  O frontend estará disponível em `http://localhost:5173`.

* **Terminal 2 (Backend):**
  ```bash
  npm run dev:backend
  ```
  O servidor backend iniciará em `http://localhost:3000` (ou na porta configurada no seu ambiente).

---

## 📦 Deploy na Vercel

O projeto está configurado para deploy automático na **Vercel** utilizando as especificações definidas em [vercel.json](file:///c:/Users/CAUEVA/Desktop/ProjetoTCC/vercel.json):

1. Conecte o repositório GitHub no dashboard da Vercel.
2. Nas configurações do projeto na Vercel, adicione as variáveis de ambiente necessárias (`DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, etc.).
3. O build unificado irá gerar o frontend estático e as Serverless Functions do backend no endpoint `/api/*`.

---

> [!IMPORTANT]
> **Trabalho Acadêmico de Conclusão de Curso**
>
> Desenvolvido com fins educacionais como requisito parcial para obtenção do título de técnico/tecnólogo na instituição **SENAI**. Todos os direitos reservados aos autores do projeto.
