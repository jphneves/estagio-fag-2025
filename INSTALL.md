# Guia de Instalação Completo

## Pré-requisitos

### 1. Node.js e npm
Certifique-se de ter Node.js 18+ instalado:
```bash
node --version
npm --version
```

### 2. PostgreSQL
O PostgreSQL deve estar instalado e rodando:
```bash
sudo systemctl status postgresql
```

## Instalação Passo a Passo

### 1. Clone/Acesse o Projeto
```bash
cd /home/moxsy/Documents/ESTAGIO-2025
```

### 2. Configure o Banco de Dados PostgreSQL

#### a) Acesse o PostgreSQL
```bash
sudo -u postgres psql
```

#### b) Crie o banco de dados
```sql
CREATE DATABASE sistema_rbac;
```

#### c) (Opcional) Crie um usuário específico
```sql
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE sistema_rbac TO seu_usuario;
\q
```

#### d) Atualize o arquivo .env do backend
Se você criou um usuário específico, edite `backend/.env`:
```env
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/sistema_rbac
```

### 3. Instale as Dependências

#### Opção A: Usando o script de instalação
```bash
chmod +x install.sh
./install.sh
```

#### Opção B: Manualmente
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Configure o Banco de Dados

```bash
cd backend

# Execute as migrations para criar as tabelas
npm run migrate

# Execute o seed para criar dados iniciais
npm run seed
```

### 5. Inicie os Servidores

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

O backend estará rodando em: http://localhost:3001

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

O frontend estará rodando em: http://localhost:3000

## Testando o Sistema

### Credenciais de Teste

Após executar o seed, use estas credenciais para login:

- **Admin** (acesso total)
  - Email: `admin@example.com`
  - Senha: `admin123`

- **Manager** (gerenciamento)
  - Email: `manager@example.com`
  - Senha: `manager123`

- **User** (acesso básico)
  - Email: `user@example.com`
  - Senha: `user123`

### Acessos por Role

#### ADMIN
- ✅ Todas as permissões em todos os recursos
- Pode criar, ler, atualizar e deletar: usuários, roles, permissões

#### MANAGER
- ✅ Gerenciar usuários (CRUD completo)
- ✅ Visualizar roles e permissões
- ✅ Criar e editar roles/permissões
- ❌ Não pode deletar roles e permissões

#### USER
- ✅ Visualizar usuários, roles e permissões
- ❌ Não pode criar, editar ou deletar

## Estrutura de Permissões (RBAC + ACL)

### RBAC (Role-Based Access Control)
- Permissões atribuídas através de roles
- Exemplo: Role ADMIN tem todas as permissões

### ACL (Access Control List)
- Permissões específicas atribuídas diretamente a usuários
- Sobrescreve permissões de role
- Útil para casos especiais

## Troubleshooting

### Erro de conexão com PostgreSQL
```bash
# Verifique se o PostgreSQL está rodando
sudo systemctl status postgresql

# Reinicie se necessário
sudo systemctl restart postgresql
```

### Erro "role postgres does not exist"
```bash
sudo -u postgres createuser --superuser $USER
```

### Porta 3000 ou 3001 já em uso
```bash
# Encontre o processo usando a porta
lsof -i :3000
lsof -i :3001

# Mate o processo
kill -9 <PID>
```

### Limpar e recriar o banco
```bash
cd backend

# Recriar tabelas (CUIDADO: apaga todos os dados)
node -e "require('./src/models').sequelize.sync({ force: true }).then(() => process.exit())"

# Executar seed novamente
npm run seed
```

## Comandos Úteis

### Backend
```bash
npm run dev      # Inicia servidor em modo desenvolvimento
npm start        # Inicia servidor em produção
npm run migrate  # Executa migrations
npm run seed     # Popula banco com dados iniciais
```

### Frontend
```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm start        # Inicia servidor de produção
npm run lint     # Executa linter
```

## Testando a API com curl

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Listar Usuários (com token)
```bash
TOKEN="seu_token_aqui"
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Personalizações

### Adicionar Nova Role
Edite `backend/src/config/seed.js` e adicione:
```javascript
const [customRole] = await Role.findOrCreate({
  where: { name: 'CUSTOM' },
  defaults: { description: 'Role customizada' }
});
```

### Adicionar Novo Recurso
1. Crie permissões para o recurso em `seed.js`
2. Crie o modelo em `backend/src/models/`
3. Crie o controller em `backend/src/controllers/`
4. Adicione as rotas em `backend/src/routes/`
5. Proteja com middleware RBAC/ACL

## Suporte

Para problemas ou dúvidas:
1. Verifique os logs do backend e frontend
2. Confirme que todas as dependências foram instaladas
3. Verifique as configurações no `.env`
4. Certifique-se de que o PostgreSQL está acessível
