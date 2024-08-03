const { Router } = require('express');
const {
    createDespacho,
    getDespacho,
    updateDespacho,
    deleteDespacho,
} = require('../controllers/despacho.controller');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');
const { roles } = require('../config');

const router = Router();

router.post('/', isAuthenticated, isAuthorized(roles.admin), createDespacho);
router.get('/:uid', isAuthenticated, isAuthorized(roles.admin), getDespacho);
router.put('/:uid', isAuthenticated, isAuthorized(roles.admin), updateDespacho);
router.delete('/:uid', isAuthenticated, isAuthorized(roles.admin), deleteDespacho);

module.exports = router;
