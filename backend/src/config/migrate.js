const { sequelize } = require('../models');

async function migrate() {
  try {
    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✓ Conexão estabelecida com sucesso!');

    console.log('Sincronizando modelos com o banco de dados...');
    await sequelize.sync({ force: false });
    console.log('✓ Tabelas criadas/atualizadas com sucesso!');

    console.log('\nMigração concluída!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
}

migrate();
