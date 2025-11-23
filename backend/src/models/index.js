const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const { DataTypes } = require('sequelize');

// Tabela de relacionamento User-Role
const UserRole = sequelize.define('UserRole', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id'
    }
  }
}, {
  tableName: 'user_roles',
  timestamps: false,
  underscored: true
});

// Tabela de relacionamento Role-Permission
const RolePermission = sequelize.define('RolePermission', {
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id'
    }
  },
  permissionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Permission,
      key: 'id'
    }
  }
}, {
  tableName: 'role_permissions',
  timestamps: false,
  underscored: true
});

// Tabela de relacionamento User-Permission (ACL direto)
const UserPermission = sequelize.define('UserPermission', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  permissionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Permission,
      key: 'id'
    }
  }
}, {
  tableName: 'user_permissions',
  timestamps: false,
  underscored: true
});

// Definir relacionamentos
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId', as: 'roles' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId', as: 'users' });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId', as: 'roles' });

User.belongsToMany(Permission, { through: UserPermission, foreignKey: 'userId', as: 'permissions' });
Permission.belongsToMany(User, { through: UserPermission, foreignKey: 'permissionId', as: 'users' });

module.exports = {
  sequelize,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  UserPermission
};
