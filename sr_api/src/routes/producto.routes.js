const { Router } = require('express');
const {
    createProducto,
    getProducto,
    updateProducto,
    deleteProducto,
    getProductosConEstadoActivo,
    uploadImage
} = require('../controllers/producto.controller');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');
const { roles } = require('../config');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(), 
    limits: { fileSize: 5 * 1024 * 1024 }
});

const router = Router();

router.get('/gpa/', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getProductosConEstadoActivo);
router.get('/:uid', isAuthenticated, isAuthorized(roles.admin, roles.cliente), getProducto);
router.post('/cp/', isAuthenticated, isAuthorized(roles.admin, roles.cliente), createProducto);
router.post('/ci/upload', isAuthenticated, isAuthorized(roles.admin, roles.cliente), upload.single('image'), uploadImage);
router.put('/:uid', isAuthenticated, isAuthorized(roles.admin), updateProducto);
router.delete('/dp/:uid', isAuthenticated, isAuthorized(roles.admin, roles.cliente), deleteProducto);

module.exports = router;
