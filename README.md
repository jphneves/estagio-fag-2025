# Sistema de Gestão com RBAC e ACL

Projeto web completo com controle de acesso baseado em funções (RBAC) e listas de controle de acesso (ACL).

## 🚀 Tecnologias

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT para autenticação
- Bcrypt para hash de senhas

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios para requisições

## 📁 Estrutura do Projeto

```
├── backend/          # API REST com Node.js
│   ├── src/
│   │   ├── config/   # Configurações
│   │   ├── models/   # Modelos do banco
│   │   ├── routes/   # Rotas da API
│   │   ├── controllers/ # Controladores
│   │   ├── middleware/ # Middlewares (auth, RBAC, ACL)
│   │   └── utils/    # Utilitários
│   └── package.json
│
├── frontend/         # Interface Next.js
│   ├── src/
│   │   ├── app/      # App Router
│   │   ├── components/ # Componentes React
│   │   └── lib/      # Bibliotecas e utils
│   └── package.json
│
└── README.md
```

## 🔐 Sistema de Controle de Acesso

### RBAC (Role-Based Access Control)
- **Admin**: Acesso total ao sistema
- **Manager**: Gerenciamento de usuários e recursos
- **User**: Acesso básico aos recursos

### ACL (Access Control List)
- Controle granular de permissões por recurso
- Permissões: CREATE, READ, UPDATE, DELETE
- Associação de permissões por role e usuário

## 🌐 Demo Online

- **Frontend**: https://sistema-estagio-fag.vercel.app
- **Backend API**: https://estagio-fag-2025.vercel.app

## 🛠️ Instalação Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Backend

```bash
cd backend
npm install
```

Configure o arquivo `.env`:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_db
JWT_SECRET=sua_chave_secreta_aqui
PORT=3001
NODE_ENV=development
```

Execute as migrations (se usar banco local):

```bash
npm run migrate
npm run seed
```

Inicie o servidor:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Configure o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Inicie o frontend:

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuário atual

### Usuários (requer autenticação)
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Roles e Permissões
- `GET /api/roles` - Listar roles
- `GET /api/permissions` - Listar permissões
- `POST /api/users/:id/permissions` - Atribuir permissão

## 🔑 Credenciais Padrão

Após executar o seed:
- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **User**: user@example.com / user123

## 🚀 Deploy

O projeto está hospedado no **Vercel**:
- Frontend e Backend deployados automaticamente via GitHub
- Banco de dados PostgreSQL hospedado no **Neon.tech**
- SSL/TLS configurado automaticamente

### Estrutura de Deploy
- `backend/api/index.js` - Função serverless Vercel
- `backend/vercel.json` - Configuração de rotas
- `frontend/vercel.json` - Configuração do Next.js

## 👨‍💻 Desenvolvedor

**Feito por João Pedro H Neves**

Stack: Next.js • React • Node.js • PostgreSQL • TypeScript

## 📄 Licença

MIT
