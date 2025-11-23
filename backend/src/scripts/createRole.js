const { Role } = require('../models');

async function createTestRole() {
  try {
    console.log('Criando role de teste...');

    const [testRole, created] = await Role.findOrCreate({
      where: { name: 'TESTE' },
      defaults: { 
        name: 'TESTE',
        description: 'Role de teste sem permissões'
      }
    });

    if (created) {
      console.log('✓ Role TESTE criada com sucesso!');
      console.log(`ID: ${testRole.id}`);
      console.log(`Nome: ${testRole.name}`);
      console.log(`Descrição: ${testRole.description}`);
    } else {
      console.log('⚠ Role TESTE já existe!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar role:', error);
    process.exit(1);
  }
}

createTestRole();
