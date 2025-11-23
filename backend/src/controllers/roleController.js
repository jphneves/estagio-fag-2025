const { Role, Permission } = require('../models');

class RoleController {
  async index(req, res) {
    try {
      const roles = await Role.findAll({
        include: [{
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'resource', 'action']
        }],
        order: [['name', 'ASC']]
      });

      return res.json(roles);
    } catch (error) {
      console.error('Erro ao listar roles:', error);
      return res.status(500).json({ error: 'Erro ao listar roles' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const role = await Role.findByPk(id, {
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      });

      if (!role) {
        return res.status(404).json({ error: 'Role não encontrada' });
      }

      return res.json(role);
    } catch (error) {
      console.error('Erro ao buscar role:', error);
      return res.status(500).json({ error: 'Erro ao buscar role' });
    }
  }
}

module.exports = new RoleController();
