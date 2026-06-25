# NexTalk

NexTalk e um sistema corporativo enxuto para produtividade e gestao de funcionarios, inspirado em versoes simplificadas de plataformas como DingTalk, Teams e Slack. O projeto foi criado como portfolio de Analise e Desenvolvimento de Sistemas, com foco em autenticacao, tarefas, ponto eletronico e aplicativo mobile.

## Objetivo

Construir uma aplicacao completa, organizada e demonstravel, contendo:

- API REST em Node.js e Express.
- Banco de dados PostgreSQL.
- Aplicativo mobile em React Native com Expo.
- Front-end web simples em HTML, CSS e JavaScript vanilla.
- Fluxos principais de login, tarefas e ponto eletronico.

## Stack

### Backend

- Node.js
- Express
- PostgreSQL
- pg
- bcrypt
- jsonwebtoken
- dotenv

### Mobile

- React Native
- Expo
- React Navigation
- JavaScript
- StyleSheet nativo
- AsyncStorage
- Axios

### Frontend web

- HTML5
- CSS3
- JavaScript vanilla

## Arquitetura

```txt
NexTalk/
  backend/       API REST, autenticacao, regras de negocio e SQL
  frontend/      Interface web estatica inicial
  mobile/        App React Native com Expo
  _archive/      Base Next.js inicial arquivada
```

Fluxo esperado:

```txt
Mobile Expo / Frontend Web
        |
        | HTTP + JWT
        v
Backend Express
        |
        | SQL
        v
PostgreSQL
```

## Como rodar

### 1. Backend

Crie um arquivo `.env` dentro de `backend/` com base em `backend/.env.example`.

```bash
cd backend
npm install
npm run dev
```

A API roda por padrao em:

```txt
http://localhost:3001
```

### 2. Banco de dados

Com PostgreSQL e `psql` instalados/configurados:

```bash
cd backend
npm run db:setup
```

Esse comando cria o banco `nextalk`, se ele ainda nao existir, e executa:

```txt
backend/database/schema.sql
```

Tabelas criadas:

- `usuarios`
- `tarefas`
- `ponto`

### 3. Mobile

Crie um arquivo `.env` dentro de `mobile/` com base em `mobile/.env.example`.

Para testar em celular fisico, use o IP local do computador:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3001
```

Depois:

```bash
cd mobile
npm install
npm start -- --host lan
```

Abra o QR Code no Expo Go.

### 4. Frontend web

Abra o arquivo:

```txt
frontend/index.html
```

## Scripts principais

Na raiz do projeto:

```bash
npm run dev        # inicia o backend em modo watch
npm start          # inicia o backend
npm run db:setup   # cria o banco e executa o schema via Node.js
npm run db:schema  # executa o schema SQL
npm run mobile     # inicia o Expo
npm run mobile:lan # inicia o Expo em modo LAN
```

No backend:

```bash
npm run dev
npm start
npm run db:setup
npm run db:schema
```

No mobile:

```bash
npm start
npm run android
npm run ios
npm run web
```

## Rotas atuais da API

### Autenticacao

```txt
POST /auth/register
POST /auth/login
```

### Tarefas

```txt
POST  /tarefas/criar
GET   /tarefas
PATCH /tarefas/:id/status
```

### Ponto

```txt
POST /ponto/bater
GET  /ponto
```

Rotas de tarefas e ponto exigem:

```txt
Authorization: Bearer SEU_TOKEN_JWT
```

## Estado atual

Concluido:

- Estrutura separada em `backend/`, `frontend/` e `mobile/`.
- Base antiga em Next.js arquivada em `_archive/nextjs-initial/`.
- Backend Express com rotas de autenticacao, tarefas e ponto.
- Schema SQL inicial do PostgreSQL.
- App mobile Expo com login mockado, abas, tarefas e ponto.
- Front-end web inicial com tela de login corporativo.

Proximos passos:

- Configurar PostgreSQL local.
- Executar `schema.sql`.
- Testar cadastro, login, JWT, tarefas e ponto.
- Conectar o login mobile ao backend real.
- Criar telas reais de perfil, criacao de tarefa e estados vazios.
- Adicionar validacao de entrada com Zod ou Joi.

## Portfolio

Itens planejados para apresentacao:

- Screenshots do mobile.
- GIF ou video curto do fluxo login, tarefas e ponto.
- Diagrama simples da arquitetura.
- Deploy do backend.
- Banco remoto para demonstracao.
