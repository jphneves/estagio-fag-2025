require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const roleRoutes = require('./routes/roles');
const permissionRoutes = require('./routes/permissions');

const app = express();

// Middlewares
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*'
    : '*',
  credentials: true
};

app.use(cors(corsOptions));
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

// Inicializar servidor
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Testar conexão com banco
    await sequelize.authenticate();
    console.log('✓ Conexão com banco de dados estabelecida');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✓ Servidor rodando na porta ${PORT}`);
      console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n📍 API disponível em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
