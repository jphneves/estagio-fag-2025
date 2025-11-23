const { User, Role, Permission } = require('../models');
const bcrypt = require('bcryptjs');

class UserController {
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Role,
            as: 'roles',
            attributes: ['id', 'name']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
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

      return res.json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async create(req, res) {
    try {
      const { name, email, password, roleIds } = req.body;

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

      // Atribuir roles
      if (roleIds && roleIds.length > 0) {
        const roles = await Role.findAll({ where: { id: roleIds } });
        await user.setRoles(roles);
      } else {
        // Role USER por padrão
        const userRole = await Role.findOne({ where: { name: 'USER' } });
        if (userRole) {
          await user.addRole(userRole);
        }
      }

      const userWithRoles = await User.findByPk(user.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'name']
        }]
      });

      return res.status(201).json(userWithRoles);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, roleIds, active } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verificar email duplicado
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }
      }

      // Atualizar dados
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (active !== undefined) updateData.active = active;
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await user.update(updateData);

      // Atualizar roles
      if (roleIds && roleIds.length > 0) {
        const roles = await Role.findAll({ where: { id: roleIds } });
        await user.setRoles(roles);
      }

      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'name']
        }]
      });

      return res.json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Não permitir deletar a si mesmo
      if (parseInt(id) === req.userId) {
        return res.status(400).json({ error: 'Você não pode deletar sua própria conta' });
      }

      await user.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }

  async assignPermission(req, res) {
    try {
      const { id } = req.params;
      const { permissionId } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const permission = await Permission.findByPk(permissionId);
      if (!permission) {
        return res.status(404).json({ error: 'Permissão não encontrada' });
      }

      await user.addPermission(permission);

      return res.json({ message: 'Permissão atribuída com sucesso' });
    } catch (error) {
      console.error('Erro ao atribuir permissão:', error);
      return res.status(500).json({ error: 'Erro ao atribuir permissão' });
    }
  }

  async removePermission(req, res) {
    try {
      const { id, permissionId } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const permission = await Permission.findByPk(permissionId);
      if (!permission) {
        return res.status(404).json({ error: 'Permissão não encontrada' });
      }

      await user.removePermission(permission);

      return res.json({ message: 'Permissão removida com sucesso' });
    } catch (error) {
      console.error('Erro ao remover permissão:', error);
      return res.status(500).json({ error: 'Erro ao remover permissão' });
    }
  }
}

module.exports = new UserController();
