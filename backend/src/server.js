require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const roleRoutes = require('./routes/roles');
const permissionRoutes = require('./routes/permissions');

const app = express();

// Middlewares - CORS configurado para produção
app.use(cors({
  origin: ['https://sistema-estagio-fag.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Sistema com RBAC e ACL',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      roles: '/api/roles',
      permissions: '/api/permissions'
    }
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Para Vercel serverless - exporta o app diretamente
module.exports = app;

// Para desenvolvimento local
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✓ Servidor rodando na porta ${PORT}`);
    console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\n📍 API disponível em: http://localhost:${PORT}`);
  });
}
