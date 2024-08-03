const { Router } = require('express');
const {
    createUsuario,
    getUsuario,
    updateUsuario,
    deleteUsuario,
    login,
    verifyToken,
    actualizarToken
} = require('../controllers/usuario.controller');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');
const { roles } = require('../config');

const router = Router();

router.post('/', createUsuario);
router.get('/gu/:cedula', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getUsuario);
router.get('/token', verifyToken);
router.put('/uu/:cedula', isAuthenticated, isAuthorized(roles.admin), updateUsuario);
router.post('/ut/:cedula', isAuthenticated, isAuthorized(roles.admin), actualizarToken);
router.delete('/dd/:cedula', isAuthenticated, isAuthorized(roles.admin), deleteUsuario);
router.post('/login', login);

module.exports = router;
