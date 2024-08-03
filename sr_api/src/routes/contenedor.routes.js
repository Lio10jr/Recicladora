const { Router } = require('express');
const {
    createContenedor,
    getContenedor,
    updateContenedor,
    deleteContenedor,
    getContenedores,
    getContenedoresActivos,
    despacharContenedor
} = require('../controllers/contenedor.controller');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');
const { roles } = require('../config');

const router = Router();

router.get('/', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getContenedores);
router.get('/gca/', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getContenedoresActivos);
router.get('/gc/:uid', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getContenedor);
router.post('/', isAuthenticated, isAuthorized(roles.admin), createContenedor);
router.post('/dc/:id', isAuthenticated, isAuthorized(roles.admin), despacharContenedor);
router.put('/uc/:uid', isAuthenticated, isAuthorized(roles.admin), updateContenedor);
router.delete('/dtc/:uid', isAuthenticated, isAuthorized(roles.admin), deleteContenedor);

module.exports = router;
