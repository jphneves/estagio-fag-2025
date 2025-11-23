const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Verificar se usuário já existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Usuário já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });

      // Atribuir role USER por padrão
      const userRole = await Role.findOne({ where: { name: 'USER' } });
      if (userRole) {
        await user.addRole(userRole);
      }

      // Gerar token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuário
      const user = await User.findOne({ 
        where: { email },
        include: [
          {
            model: Role,
            as: 'roles',
            include: [{
              model: Permission,
              as: 'permissions'
            }]
          },
          {
            model: Permission,
            as: 'permissions'
          }
        ]
      });

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      if (!user.active) {
        return res.status(401).json({ error: 'Usuário inativo' });
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Preparar permissões
      const rolePermissions = [];
      user.roles.forEach(role => {
        if (role.permissions) {
          rolePermissions.push(...role.permissions);
        }
      });

      const allPermissions = [...rolePermissions, ...(user.permissions || [])];
      const uniquePermissions = Array.from(
        new Map(allPermissions.map(p => [`${p.resource}_${p.action}`, p])).values()
      );

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles.map(r => r.name),
          permissions: uniquePermissions.map(p => ({
            resource: p.resource,
            action: p.action
          }))
        },
        token
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  async me(req, res) {
    try {
      const user = await User.findByPk(req.userId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Role,
            as: 'roles',
            include: [{
              model: Permission,
              as: 'permissions'
            }]
          },
          {
            model: Permission,
            as: 'permissions'
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Preparar permissões
      const rolePermissions = [];
      user.roles.forEach(role => {
        if (role.permissions) {
          rolePermissions.push(...role.permissions);
        }
      });

      const allPermissions = [...rolePermissions, ...(user.permissions || [])];
      const uniquePermissions = Array.from(
        new Map(allPermissions.map(p => [`${p.resource}_${p.action}`, p])).values()
      );

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
        roles: user.roles.map(r => ({ id: r.id, name: r.name })),
        permissions: uniquePermissions.map(p => ({
          id: p.id,
          resource: p.resource,
          action: p.action
        }))
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }
}

module.exports = new AuthController();
