const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const isAuthenticated = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    
    if (!authorizationHeader) {
        return res.status(401).send('No se ha proporcionado un token de autenticación');
    }
    const token = authorizationHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        req.usuario = decoded;
        return next();
    } catch (error) {
        return res.status(401).send('Token de autenticación inválido');
    }
};

function isAuthorized(...allowedRoles) {
    return function (req, res, next) {
        if (!req.usuario) {
            return res.status(401).send('No se ha proporcionado un token de autenticación');
        }
        const userRole = req.usuario.rol;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send('Acceso denegado.');
        }
        next();
    };
};

module.exports = {
    isAuthenticated,
    isAuthorized,
};