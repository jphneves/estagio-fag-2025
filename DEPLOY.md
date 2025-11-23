# 🚀 Guia de Deploy - Vercel + Neon

Este guia mostra como colocar o projeto em produção usando Neon.tech (PostgreSQL) e Vercel (hospedagem).

## 📋 Pré-requisitos

- Conta no [Neon.tech](https://neon.tech) (gratuito)
- Conta no [Vercel](https://vercel.com) (gratuito)
- Git instalado
- Código no GitHub (recomendado)

---

## 1️⃣ Configurar Banco de Dados no Neon

### Passo 1: Criar Projeto no Neon

1. Acesse https://neon.tech e faça login
2. Clique em **"New Project"**
3. Configure:
   - **Project name**: `sistema-rbac`
   - **Region**: Escolha a mais próxima (ex: US East)
   - **PostgreSQL version**: 16 (mais recente)
4. Clique em **"Create Project"**

### Passo 2: Obter Connection String

Após criar o projeto, você verá a **Connection String**:

```
postgresql://usuario:senha@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

⚠️ **Copie e guarde essa string!** Você vai precisar dela.

### Passo 3: Ajustar Models para Produção

O Neon usa SSL, então precisamos ajustar a configuração:

**Edite:** `backend/src/config/database.js`

```javascript
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
```

---

## 2️⃣ Preparar Projeto para Deploy

### Backend - Criar vercel.json

Crie o arquivo `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Frontend - Ajustar next.config.js

Edite `frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

---

## 3️⃣ Deploy do Backend na Vercel

### Opção A: Via GitHub (Recomendado)

1. **Criar repositório no GitHub**
   ```bash
   cd /home/moxsy/Documents/ESTAGIO-2025
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/SEU-USUARIO/sistema-rbac.git
   git push -u origin main
   ```

2. **Importar no Vercel**
   - Acesse https://vercel.com
   - Clique em **"Add New Project"**
   - Selecione seu repositório GitHub
   - **Configure o projeto Backend:**
     - **Framework Preset**: Other
     - **Root Directory**: `backend`
     - **Build Command**: (deixe vazio)
     - **Output Directory**: (deixe vazio)

3. **Adicionar Variáveis de Ambiente**
   
   Em **"Environment Variables"**, adicione:
   
   ```
   DATABASE_URL=postgresql://seu-usuario:sua-senha@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=sua_chave_secreta_muito_segura_producao_2024
   NODE_ENV=production
   PORT=3001
   ```

4. **Deploy!** Clique em **"Deploy"**

Sua API estará em: `https://seu-backend.vercel.app`

### Opção B: Via Vercel CLI

```bash
cd backend
npm i -g vercel
vercel login
vercel --prod
```

---

## 4️⃣ Executar Migrations no Neon

### Método 1: Localmente

```bash
cd backend

# Criar arquivo .env.production
echo "DATABASE_URL=postgresql://usuario:senha@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=sua_chave_secreta_producao
NODE_ENV=production" > .env.production

# Carregar variáveis e executar
export $(cat .env.production | xargs)
npm run migrate
npm run seed
```

### Método 2: Via Neon SQL Editor

1. Acesse seu projeto no Neon.tech
2. Vá em **"SQL Editor"**
3. Execute o SQL manualmente (copie do migration gerado)

---

## 5️⃣ Deploy do Frontend na Vercel

1. **Importar projeto Frontend**
   - No Vercel, clique em **"Add New Project"**
   - Selecione o mesmo repositório
   - **Configure:**
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

2. **Adicionar Variáveis de Ambiente**
   
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
   ```

3. **Deploy!** Clique em **"Deploy"**

Seu frontend estará em: `https://seu-frontend.vercel.app`

---

## 6️⃣ Configurar CORS no Backend

**Edite:** `backend/src/server.js`

```javascript
// Configurar CORS para permitir seu domínio Vercel
const cors = require('cors');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seu-frontend.vercel.app'] 
    : '*',
  credentials: true
};

app.use(cors(corsOptions));
```

Depois faça commit e push:

```bash
git add .
git commit -m "Configure CORS for production"
git push
```

---

## 7️⃣ Testar em Produção

1. Acesse seu frontend: `https://seu-frontend.vercel.app`
2. Faça login com as credenciais de teste:
   - Admin: admin@example.com / admin123
3. Teste todas as funcionalidades

---

## 🔧 Problemas Comuns

### Backend não conecta ao Neon
- Verifique se a CONNECTION_STRING está correta
- Certifique-se que `sslmode=require` está na URL
- Verifique se as migrations foram executadas

### CORS Error
- Adicione o domínio do frontend no CORS
- Verifique se a variável `NEXT_PUBLIC_API_URL` está correta

### Frontend não carrega
- Verifique os logs no Vercel
- Certifique-se que `NEXT_PUBLIC_API_URL` aponta para o backend correto

---

## 📊 Monitoramento

### Neon Dashboard
- Monitore conexões em tempo real
- Veja queries sendo executadas
- Gerencie branches do banco

### Vercel Dashboard
- Veja logs de erro
- Monitore performance
- Configure domínio customizado

---

## 🎯 Próximos Passos

### Domínio Customizado (Opcional)
1. No Vercel, vá em **Settings > Domains**
2. Adicione seu domínio (ex: `meuapp.com.br`)
3. Configure DNS conforme instruções

### Otimizações
- Configure cache no Vercel
- Habilite Analytics
- Configure Monitoring

---

## 📝 Checklist de Deploy

- [ ] Projeto no GitHub
- [ ] Banco criado no Neon
- [ ] Connection string copiada
- [ ] Backend configurado com SSL
- [ ] Backend deployed na Vercel
- [ ] Variáveis de ambiente configuradas (backend)
- [ ] Migrations executadas no Neon
- [ ] Seed executado
- [ ] Frontend deployed na Vercel
- [ ] Variáveis de ambiente configuradas (frontend)
- [ ] CORS configurado
- [ ] Teste de login funcionando
- [ ] CRUD funcionando

---

## 🆘 Suporte

- **Neon Docs**: https://neon.tech/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Desenvolvido por João Pedro H Neves**
