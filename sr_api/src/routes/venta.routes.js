const { Router } = require('express');
const {
    createVenta,
    getVenta,
    updateVenta,
    deleteVenta,
    getVentasUser
    //getVentasPorComprador
} = require('../controllers/venta.controller');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');
const { roles } = require('../config');

const router = Router();

router.post('/cv/', isAuthenticated, isAuthorized(roles.admin, roles.cliente), createVenta);
router.get('/:uid', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getVenta);
router.get('/gvu/:cedula', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getVentasUser);
router.put('/:uid', isAuthenticated, isAuthorized(roles.admin), updateVenta);
router.delete('/:uid', isAuthenticated, isAuthorized(roles.admin), deleteVenta);
//router.get('/ventas/comprador/:cedula', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getVentasPorComprador);

module.exports = router;
