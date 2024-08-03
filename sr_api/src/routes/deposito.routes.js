const { Router } = require('express');
const {
    createDeposito,
    getDeposito,
    updateDeposito,
    deleteDeposito,
    //getDepositosPorCliente
} = require('../controllers/deposito.controller');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');
const { roles } = require('../config');

const router = Router();

router.get('/:uid', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getDeposito);
router.post('/cd/', isAuthenticated, isAuthorized(roles.admin, roles.cliente), createDeposito);
router.put('/ud/:uid', isAuthenticated, isAuthorized(roles.admin), updateDeposito);
router.delete('/dd/:uid', isAuthenticated, isAuthorized(roles.admin), deleteDeposito);
//router.get('/depositos/cliente/:cedula', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getDepositosPorCliente);

module.exports = router;
