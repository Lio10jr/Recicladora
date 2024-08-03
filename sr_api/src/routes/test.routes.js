const { Router } = require('express');
const router = Router();

const test = (req, res) => {
    res.send('Servidor ejecutándose correctamente');
};

router.get("/test", test);

module.exports = router;