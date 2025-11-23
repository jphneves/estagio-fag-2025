const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/auth');
const { hasPermission } = require('../middleware/rbac');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar roles - requer permissão READ em roles
router.get('/', hasPermission('roles', 'READ'), roleController.index);

// Buscar role - requer permissão READ em roles
router.get('/:id', hasPermission('roles', 'READ'), roleController.show);

module.exports = router;
