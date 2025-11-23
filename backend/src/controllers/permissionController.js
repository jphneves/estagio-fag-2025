const { Permission } = require('../models');

class PermissionController {
  async index(req, res) {
    try {
      const permissions = await Permission.findAll({
        order: [['resource', 'ASC'], ['action', 'ASC']]
      });

      return res.json(permissions);
    } catch (error) {
      console.error('Erro ao listar permissões:', error);
      return res.status(500).json({ error: 'Erro ao listar permissões' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const permission = await Permission.findByPk(id);

      if (!permission) {
        return res.status(404).json({ error: 'Permissão não encontrada' });
      }

      return res.json(permission);
    } catch (error) {
      console.error('Erro ao buscar permissão:', error);
      return res.status(500).json({ error: 'Erro ao buscar permissão' });
    }
  }
}

module.exports = new PermissionController();
