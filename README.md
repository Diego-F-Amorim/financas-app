# 💰 Finanças App

Plataforma de gestão financeira para **pessoas e empresas**. Um mesmo sistema permite
controlar as finanças pessoais e as de um negócio, em espaços separados e com controle
de acesso por papel.

> 🚧 **Em desenvolvimento.** Projeto de portfólio construído do zero, cobrindo back-end,
> banco de dados, front-end e, futuramente, mobile.

---

## ✨ Funcionalidades

| Funcionalidade                                  | Back-end | Front-end |
| ----------------------------------------------- | :------: | :-------: |
| Cadastro e login de usuário                     |    ✅    |    ✅     |
| Espaço pessoal criado automaticamente           |    ✅    |    ✅     |
| Lançamentos de receitas e despesas              |    ✅    |    ⏳     |
| Categorias padrão                               |    ✅    |    ⏳     |
| Categorias personalizadas                       |    ⏳    |    ⏳     |
| Dashboard (saldo e gastos por categoria no mês) |    ⏳    |    ⏳     |
| Despesas recorrentes                            |    ⏳    |    ⏳     |
| Metas (economia e limite de gasto)              |    ⏳    |    ⏳     |
| Exportação CSV                                  |    ⏳    |    ⏳     |
| Espaços de empresa com membros e papéis         |    ⏳    |    ⏳     |

✅ Pronto · ⏳ Planejado

---

## 🏗️ Arquitetura

### Multi-tenant com espaços (workspaces)

Os dados financeiros pertencem a **espaços**, não diretamente a usuários.

- Cada pessoa ganha um **espaço pessoal** ao se cadastrar.
- Um espaço de **empresa** pode ter vários membros, cada um com um papel:
  - `OWNER`: dono, acesso total
  - `ADMIN`: gerencia membros e dados
  - `MEMBER`: cria e edita lançamentos
  - `VIEWER`: apenas visualiza (ex.: contador)

Assim, o mesmo sistema atende tanto o controle pessoal quanto o empresarial.

### Decisões técnicas

- **Valores monetários em centavos (inteiros)** para evitar erros de arredondamento de ponto flutuante.
- **Controle de acesso em camadas:** autenticação (JWT) → verificação de membro do espaço → verificação de papel.
- **Proteção contra IDOR:** toda consulta é filtrada pelo espaço do usuário.
- **Validação de entrada com Zod** e tratamento centralizado de erros.
- **Senhas com hash bcrypt**; a senha original nunca é armazenada.
- **Variáveis de ambiente validadas** na inicialização (_fail fast_).

---

## 🛠️ Tecnologias

**Back-end:** Node.js · TypeScript · Express 5 · Prisma 7 · PostgreSQL 18 · Zod · JWT · bcrypt

**Front-end:** React · TypeScript · Vite · Tailwind CSS

**Infraestrutura:** Docker / Docker Compose

**Ferramentas:** Git · GitHub · Bruno (coleção de requisições versionada em `/bruno`)

---

## 📁 Estrutura

```
financas-app/
├── apps/
│   ├── api/                # Back-end (Express + Prisma)
│   │   ├── prisma/         # Schema e migrations
│   │   └── src/
│   │       ├── database/   # Seed
│   │       ├── errors/     # Erros da aplicação
│   │       ├── lib/        # Conexão com o banco
│   │       ├── middlewares/# Autenticação, acesso ao espaço, papéis, erros
│   │       └── modules/    # auth, transactions...
│   └── web/                # Front-end (React + Vite)
├── bruno/                  # Requisições de teste da API
└── docker-compose.yml      # PostgreSQL
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 26+
- Docker Desktop
- Git

### 1. Clonar e configurar o banco

```bash
git clone https://github.com/Diego-F-Amorim/financas-app.git
cd financas-app
cp .env.example .env          # defina a senha do banco
docker compose up -d
```

### 2. API

```bash
cd apps/api
cp .env.example .env          # ajuste DATABASE_URL e gere um JWT_SECRET
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev                   # http://localhost:3333
```

Para gerar o `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Front-end

```bash
cd apps/web
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

---

## 🔌 Endpoints da API

| Método | Rota                               | Descrição                                                  | Auth  |
| ------ | ---------------------------------- | ---------------------------------------------------------- | :---: |
| GET    | `/health`                          | Status da API                                              |   —   |
| GET    | `/categories`                      | Categorias padrão                                          |   —   |
| POST   | `/auth/register`                   | Cadastro (cria espaço pessoal)                             |   —   |
| POST   | `/auth/login`                      | Login, retorna JWT                                         |   —   |
| GET    | `/auth/me`                         | Dados do usuário e seus espaços                            |  🔒   |
| GET    | `/workspaces/:id/transactions`     | Lista lançamentos (filtros: `month`, `type`, `categoryId`) |  🔒   |
| GET    | `/workspaces/:id/transactions/:id` | Detalha um lançamento                                      |  🔒   |
| POST   | `/workspaces/:id/transactions`     | Cria lançamento                                            | 🔒 ✏️ |
| PATCH  | `/workspaces/:id/transactions/:id` | Edita lançamento                                           | 🔒 ✏️ |
| DELETE | `/workspaces/:id/transactions/:id` | Exclui lançamento                                          | 🔒 ✏️ |

🔒 Requer token · ✏️ Requer papel `OWNER`, `ADMIN` ou `MEMBER`

---

## 🗺️ Roadmap

1. **MVP pessoal:** telas de login, lançamentos e dashboard; recorrentes, metas e CSV.
2. **Empresas:** criação de espaços de empresa, convite de membros e permissões.
3. **Mobile:** PWA e, depois, app com React Native (Expo).
4. **Recursos empresariais:** contas bancárias, contas a pagar/receber, relatórios.

---

## 👤 Autor

**Diego Furtado Amorim**
[GitHub](https://github.com/Diego-F-Amorim)
[Linkedin](https://www.linkedin.com/in/diego-furtado-amorim/)

---

## 📄 Licença

© 2026 Diego Furtado Amorim. Todos os direitos reservados.
Este código está disponível publicamente apenas para fins de portfólio e avaliação.
Não é permitido copiar, modificar ou distribuir sem autorização.
