const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar usuários - requer permissão READ em users
router.get('/', hasPermission('users', 'READ'), userController.index);

// Buscar usuário - requer permissão READ em users
router.get('/:id', hasPermission('users', 'READ'), userController.show);

// Criar usuário - requer permissão CREATE em users
router.post('/', hasPermission('users', 'CREATE'), userController.create);

// Atualizar usuário - requer permissão UPDATE em users
router.put('/:id', hasPermission('users', 'UPDATE'), userController.update);

// Deletar usuário - requer permissão DELETE em users
router.delete('/:id', hasPermission('users', 'DELETE'), userController.delete);

// Atribuir permissão a usuário - requer permissão UPDATE em users
router.post('/:id/permissions', hasPermission('users', 'UPDATE'), userController.assignPermission);

// Remover permissão de usuário - requer permissão UPDATE em users
router.delete('/:id/permissions/:permissionId', hasPermission('users', 'UPDATE'), userController.removePermission);

module.exports = router;
