# TaskFlow - Sistema de Gerenciamento de Tarefas

Um moderno sistema de gerenciamento de tarefas full-stack desenvolvido com **NestJS** (backend) e **Next.js** (frontend) utilizando **PostgreSQL** como banco de dados.

## 📋 Visão Geral

O TaskFlow é uma aplicação completa para gerenciamento de tarefas que permite:
- Criar, visualizar, editar e excluir tarefas
- Organizar tarefas em categorias
- Filtrar e buscar tarefas por diferentes critérios
- Interface moderna e responsiva com design glassmorphism

## 🚀 Funcionalidades

### Backend (NestJS + Prisma + PostgreSQL)
- ✅ API REST completa para gerenciamento de tarefas
- ✅ Operações CRUD completas
- ✅ Sistema avançado de filtros (status, prioridade, categoria)
- ✅ Gerenciamento de categorias
- ✅ Validação forte com class-validator
- ✅ CORS habilitado para comunicação com frontend

### Frontend (Next.js + React + TypeScript + Tailwind CSS)
- ✅ Interface moderna e responsiva
- ✅ Dashboard com filtros em tempo real
- ✅ Criação, edição e exclusão de tarefas
- ✅ Seleção múltipla de categorias por tarefa
- ✅ Gerenciamento de status de tarefas
- ✅ Interface de gerenciamento de categorias

### Esquema do Banco de Dados
- **User**: id, name, email, createdAt
- **Task**: id, title, description, dueDate, priority, status, userId, createdAt, updatedAt
- **Category**: id, name, createdAt
- **Relacionamentos**: Tasks ↔ Categories (muitos-para-muitos)

## 🛠️ Stack Tecnológico

- **Backend**: NestJS, Prisma ORM, PostgreSQL, TypeScript
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Banco de Dados**: PostgreSQL
- **Validação**: class-validator, class-transformer
- **Estilização**: Tailwind CSS com design glassmorphism

## 📁 Estrutura do Projeto

```
taskflow-fullstack/
├── backend/                 # Servidor API NestJS
│   ├── src/
│   │   ├── prisma/         # Configuração do banco
│   │   ├── task/           # Módulo de tarefas (CRUD)
│   │   ├── category/       # Módulo de categorias (CRUD)
│   │   ├── user/           # Módulo de usuários (placeholder)
│   │   └── app.module.ts   # Módulo principal da aplicação
│   ├── prisma/             # Schema e migrações do banco
│   └── package.json
├── frontend/                # Aplicação React Next.js
│   ├── src/
│   │   ├── app/            # Páginas do Next.js App Router
│   │   ├── lib/            # Cliente API e utilitários
│   │   └── types/          # Definições de tipos TypeScript
│   └── package.json
├── images/                  # Screenshots da aplicação
├── .gitignore              # Git ignore abrangente
└── README.md              # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ e npm
- PostgreSQL (recomendado) ou SQLite para desenvolvimento
- Git

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd taskflow-fullstack
   ```

2. **Configure o Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure o Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuração do Banco de Dados

1. **Configure a conexão com o banco em `backend/.env`**
   ```env
   # Para PostgreSQL:
   DATABASE_URL="postgresql://username:password@localhost:5432/taskflow_db"

   # Para SQLite (desenvolvimento):
   DATABASE_URL="file:./dev.db"
   ```

2. **Execute as migrações do banco**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

3. **Gere o cliente Prisma**
   ```bash
   npx prisma generate
   ```

### Executando a Aplicação

1. **Inicie o Backend** (Terminal 1)
   ```bash
   cd backend
   npm run start:dev
   ```
   O backend ficará disponível em: http://localhost:3000

2. **Inicie o Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   O frontend ficará disponível em: http://localhost:3001

## 📱 Screenshots

### Dashboard Principal
![Dashboard](images/dasboard.png)

*Interface principal mostrando lista de tarefas com filtros laterais*

### Task Staus
![TaskFlow Logo](images/taskflow.jpg)

*Orinetação sobre o status das tarefas*

### View Page
![View Page](images/viewpage.png)

*Pagina para vizualização detalhada da task*

### Edit Page
![Edit Page](images/editpage.png)

*Pagina para edição da task permitindo multiplas seleções de categoria*

## 📋 Endpoints da API

### Tarefas
- `GET /tasks` - Lista tarefas com filtros
- `POST /tasks` - Criar nova tarefa
- `GET /tasks/:id` - Obter tarefa por ID
- `PATCH /tasks/:id` - Atualizar tarefa
- `PATCH /tasks/:id/status` - Atualizar status da tarefa
- `DELETE /tasks/:id` - Excluir tarefa

### Categorias
- `GET /categories` - Listar todas as categorias
- `POST /categories` - Criar nova categoria
- `GET /categories/:id` - Obter categoria por ID
- `PATCH /categories/:id` - Atualizar categoria
- `DELETE /categories/:id` - Excluir categoria

## 🎨 Páginas do Frontend

- `/` - **Dashboard**: Lista de tarefas com filtros e indicadores de página
- `/tasks/new` - **Criar Tarefa**: Formulário completo com navegação breadcrumb
- `/tasks/[id]` - **Detalhes da Tarefa**: Visualização completa com navegação
- `/tasks/[id]/edit` - **Editar Tarefa**: Formulário de edição com breadcrumb
- `/categories` - **Gerenciar Categorias**: Interface completa de CRUD

## 🔧 Desenvolvimento

### Scripts do Backend
```bash
npm run start:dev      # Desenvolvimento com hot reload
npm run build         # Build para produção
npm run test          # Executar testes
npm run lint          # Verificar código
```

### Scripts do Frontend
```bash
npm run dev           # Servidor de desenvolvimento
npm run build         # Build para produção
npm run start         # Iniciar servidor de produção
npm run lint          # Verificar código
```

## 🏗️ Decisões Técnicas

### Backend
- **NestJS**: Framework estruturado para APIs escaláveis
- **Prisma**: ORM moderno com type safety e migrações automáticas
- **PostgreSQL**: Banco relacional robusto para produção
- **class-validator**: Validação forte de dados de entrada
- **CORS**: Habilitado para comunicação segura com frontend

### Frontend
- **Next.js 16**: Framework React com App Router para melhor performance
- **TypeScript**: Type safety completo em toda a aplicação
- **Tailwind CSS**: Utility-first CSS com design glassmorphism
- **Lucide React**: Ícones consistentes e modernos
- **Componentes Modulares**: Separação clara de responsabilidades

### Arquitetura
- **RESTful API**: Padrão consolidado para APIs web
- **State Management**: React hooks para gerenciamento local
- **Responsive Design**: Interface adaptável para desktop e mobile
- **Error Handling**: Tratamento robusto de erros em toda aplicação

### Decisões Técnicas - Interface Modal vs Navegação
- **Modal-Centric Design**: Optamos por usar modais em vez de navegação entre páginas para operações CRUD (criar, editar, visualizar detalhes)
- **Performance Otimizada**: Evita recarregamentos de página e mantém o contexto do usuário no dashboard
- **Experiência Fluida**: Transições suaves entre visualização e edição sem perder o estado da aplicação
- **Manutenibilidade**: Centralização da lógica de formulários e validações em componentes reutilizáveis
- **SEO Trade-off**: Priorizamos UX interativa sobre SEO para páginas de formulários (aceitável para aplicação interna)
