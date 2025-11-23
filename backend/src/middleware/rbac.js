const { User, Role, Permission } = require('../models');

/**
 * Middleware para verificar se o usuário possui uma role específica
 */
const hasRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId, {
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['name']
        }]
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const userRoles = user.roles.map(role => role.name);
      const hasPermission = allowedRoles.some(role => userRoles.includes(role));

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Acesso negado. Você não possui a role necessária.' 
        });
      }

      req.userRoles = userRoles;
      return next();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao verificar permissões' });
    }
  };
};

/**
 * Middleware para verificar se o usuário possui permissão específica (ACL)
 */
const hasPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId, {
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

      // Verificar permissões diretas do usuário (ACL)
      const directPermissions = user.permissions || [];
      const hasDirectPermission = directPermissions.some(
        p => p.resource === resource && p.action === action
      );

      if (hasDirectPermission) {
        return next();
      }

      // Verificar permissões através de roles (RBAC)
      const rolePermissions = [];
      user.roles.forEach(role => {
        if (role.permissions) {
          rolePermissions.push(...role.permissions);
        }
      });

      const hasRolePermission = rolePermissions.some(
        p => p.resource === resource && p.action === action
      );

      if (hasRolePermission) {
        return next();
      }

      return res.status(403).json({ 
        error: `Acesso negado. Permissão necessária: ${action} em ${resource}` 
      });
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      return res.status(500).json({ error: 'Erro ao verificar permissões' });
    }
  };
};

module.exports = {
  hasRole,
  hasPermission
};
