const bcrypt = require('bcryptjs');
const { User, Role, Permission } = require('../models');

async function seed() {
  try {
    console.log('Iniciando seed do banco de dados...');

    // Criar Roles
    console.log('Criando roles...');
    const [adminRole] = await Role.findOrCreate({
      where: { name: 'ADMIN' },
      defaults: { description: 'Administrador com acesso total' }
    });

    const [managerRole] = await Role.findOrCreate({
      where: { name: 'MANAGER' },
      defaults: { description: 'Gerente com acesso de gestão' }
    });

    const [userRole] = await Role.findOrCreate({
      where: { name: 'USER' },
      defaults: { description: 'Usuário comum com acesso básico' }
    });

    console.log('✓ Roles criadas');

    // Criar Permissões
    console.log('Criando permissões...');
    const resources = ['users', 'roles', 'permissions'];
    const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
    const permissions = [];

    for (const resource of resources) {
      for (const action of actions) {
        const [permission] = await Permission.findOrCreate({
          where: { resource, action },
          defaults: { description: `${action} em ${resource}` }
        });
        permissions.push(permission);
      }
    }

    console.log('✓ Permissões criadas');

    // Associar todas as permissões ao Admin
    console.log('Associando permissões ao Admin...');
    await adminRole.setPermissions(permissions);

    // Manager tem todas exceto DELETE de roles e permissions
    const managerPermissions = permissions.filter(p => 
      p.resource === 'users' || 
      (p.resource !== 'users' && p.action !== 'DELETE')
    );
    await managerRole.setPermissions(managerPermissions);

    // User tem apenas READ
    const userPermissions = permissions.filter(p => p.action === 'READ');
    await userRole.setPermissions(userPermissions);

    console.log('✓ Permissões associadas às roles');

    // Criar usuários de teste
    console.log('Criando usuários de teste...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const [admin] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Administrador',
        password: hashedPassword,
        active: true
      }
    });
    await admin.setRoles([adminRole]);

    const [manager] = await User.findOrCreate({
      where: { email: 'manager@example.com' },
      defaults: {
        name: 'Gerente',
        password: await bcrypt.hash('manager123', 10),
        active: true
      }
    });
    await manager.setRoles([managerRole]);

    const [user] = await User.findOrCreate({
      where: { email: 'user@example.com' },
      defaults: {
        name: 'Usuário Comum',
        password: await bcrypt.hash('user123', 10),
        active: true
      }
    });
    await user.setRoles([userRole]);

    console.log('✓ Usuários criados');

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\nCredenciais de teste:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Manager: manager@example.com / manager123');
    console.log('User: user@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Erro durante o seed:', error);
    process.exit(1);
  }
}

seed();
