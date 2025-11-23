const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar permissões - requer permissão READ em permissions
router.get('/', hasPermission('permissions', 'READ'), permissionController.index);

// Buscar permissão - requer permissão READ em permissions
router.get('/:id', hasPermission('permissions', 'READ'), permissionController.show);

module.exports = router;
