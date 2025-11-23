# Guia Rápido de Instalação

## ⚠️ Problema Identificado: PostgreSQL

O PostgreSQL no seu sistema precisa ser atualizado. Siga estes passos:

### 1. Atualizar PostgreSQL (Arch Linux)

```bash
# Fazer upgrade do PostgreSQL
sudo -u postgres pg_upgrade \
  --old-datadir=/var/lib/postgres/data \
  --new-datadir=/var/lib/postgres/data-new \
  --old-bindir=/usr/bin \
  --new-bindir=/usr/bin
```

**OU** (mais simples, mas perde dados existentes):

```bash
# Fazer backup de dados importantes primeiro!
sudo rm -rf /var/lib/postgres/data

# Recriar o cluster do PostgreSQL
sudo -u postgres initdb -D /var/lib/postgres/data

# Iniciar PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Criar Banco de Dados

```bash
# Criar banco de dados
sudo -u postgres createdb sistema_rbac

# OU via psql
sudo -u postgres psql -c "CREATE DATABASE sistema_rbac;"
```

### 3. Executar Migrations e Seed

```bash
cd /home/moxsy/Documents/ESTAGIO-2025/backend

# Criar tabelas
npm run migrate

# Popular com dados iniciais
npm run seed
```

### 4. Iniciar Servidores

#### Terminal 1 - Backend
```bash
cd /home/moxsy/Documents/ESTAGIO-2025/backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd /home/moxsy/Documents/ESTAGIO-2025/frontend
npm run dev
```

### 5. Acessar o Sistema

Abra o navegador em: **http://localhost:3000**

## Credenciais de Teste

- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123  
- **User**: user@example.com / user123

## 📁 Estrutura Criada

```
ESTAGIO-2025/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── config/       # Configuração e DB
│   │   ├── models/       # Modelos Sequelize
│   │   ├── controllers/  # Lógica de negócio
│   │   ├── routes/       # Rotas da API
│   │   ├── middleware/   # Auth, RBAC, ACL
│   │   └── server.js     # Entrada da aplicação
│   ├── package.json
│   └── .env
│
├── frontend/             # Next.js + React
│   ├── src/
│   │   ├── app/          # Páginas (App Router)
│   │   ├── components/   # Componentes React
│   │   ├── contexts/     # Context API (Auth)
│   │   └── lib/          # Utilitários e API client
│   ├── package.json
│   └── .env.local
│
├── README.md
├── INSTALL.md
└── install.sh
```

## 🔐 Sistema de Controle de Acesso

### RBAC (Role-Based Access Control)
- **ADMIN**: Acesso total
- **MANAGER**: Gerenciamento de usuários
- **USER**: Acesso somente leitura

### ACL (Access Control List)
- Permissões granulares por recurso (users, roles, permissions)
- Ações: CREATE, READ, UPDATE, DELETE

## 🚀 Funcionalidades Implementadas

✅ Autenticação JWT  
✅ CRUD de Usuários  
✅ Sistema de Roles e Permissões  
✅ Middleware de RBAC  
✅ Middleware de ACL  
✅ Dashboard com estatísticas  
✅ Interface responsiva (Tailwind CSS)  
✅ Proteção de rotas no frontend  
✅ API RESTful completa  

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuário atual

### Usuários
- `GET /api/users` - Listar
- `GET /api/users/:id` - Buscar
- `POST /api/users` - Criar
- `PUT /api/users/:id` - Atualizar
- `DELETE /api/users/:id` - Deletar

### Roles
- `GET /api/roles` - Listar
- `GET /api/roles/:id` - Buscar

### Permissões
- `GET /api/permissions` - Listar
- `GET /api/permissions/:id` - Buscar

## ❓ Problemas Comuns

### PostgreSQL não inicia
```bash
sudo journalctl -xeu postgresql.service
```

### Porta já em uso
```bash
# Encontrar processo
lsof -i :3000
lsof -i :3001

# Matar processo
kill -9 <PID>
```

### Erro de conexão com banco
Verifique o arquivo `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sistema_rbac
```

## 📚 Documentação Completa

Veja `INSTALL.md` para instruções detalhadas.
