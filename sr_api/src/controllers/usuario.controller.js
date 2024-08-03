const { admin } = require('../database/firebase');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

// Login de usuario
const login = async (req, res) => {
    const { cedula } = req.body;
    if (!cedula) {
        return res.status(400).send('Cédula es requerida');
    }

    try {
        const usuarioRef = admin.firestore().collection('Usuarios').doc(cedula);
        const doc = await usuarioRef.get();
        if (!doc.exists) {
            return res.status(404).send('Usuario no encontrado');
        }

        const userData = doc.data();
        // Generar token JWT
        const token = jwt.sign(
            { cedula: userData.cedula, rol: userData.rol },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Devolver los datos del usuario y el token
        res.status(200).json({ usuario: userData, token: token });
    } catch (error) {
        res.status(500).send('Error al iniciar sesión: ' + error.message);
    }
};

// Crear un nuevo usuario
const createUsuario = async (req, res) => {
    const { cedula, nombre, apellido, saldo, rol } = req.body;
    try {
        const user = { cedula, nombre, apellido, saldo, rol };
        const userRef = admin.firestore().collection('Usuarios').doc(cedula);
        await userRef.set(user);

        const token = jwt.sign(
            { cedula: cedula, rol: rol },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({ usuario: user, token: token });
    } catch (error) {
        res.status(500).send('Error al crear usuario: ' + error.message);
    }
};

// Leer un usuario por cédula
const getUsuario = async (req, res) => {
    const { cedula } = req.params;

    try {
        const userRef = admin.firestore().collection('Usuarios').doc(cedula);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).json(doc.data());
    } catch (error) {
        res.status(500).send('Error al obtener usuario: ' + error.message);
    }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
    const { cedula } = req.params;
    const { nombre, apellido, saldo, rol } = req.body;
    try {
        const userRef = admin.firestore().collection('Usuarios').doc(cedula);
        await userRef.update({ nombre, apellido, saldo, rol });
        res.status(200).send('Usuario actualizado exitosamente');
    } catch (error) {
        res.status(500).send('Error al actualizar usuario: ' + error.message);
    }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
    const { cedula } = req.params;
    try {
        const userRef = admin.firestore().collection('Usuarios').doc(cedula);
        await userRef.delete();
        res.status(200).send('Usuario eliminado exitosamente');
    } catch (error) {
        res.status(500).send('Error al eliminar usuario: ' + error.message);
    }
};

// veroficar token
const verifyToken = async (req, res) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({ status: false });
    }
    const token = authorizationHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        req.usuario = decoded;
        return res.status(200).json({ status: true });
    } catch (error) {
        return res.status(401).json({ status: false });
    }
};

const actualizarToken = async (req, res) => {
    const { cedula } = req.params;
    const { token_noti } = req.body;

    if (!token_noti) {
        return res.status(400).json({ error: 'El token_noti es requerido' });
    }

    try {
        const usuariosRef = admin.firestore().collection('Usuarios');
        const usuarioRef = usuariosRef.doc(cedula);

        const doc = await usuarioRef.get();

        if (!doc.exists) {
            await usuarioRef.set({
                token_noti: token_noti
            });
            return res.status(201).json({ message: 'Usuario creado y token_noti actualizado' });
        } else {
            await usuarioRef.update({
                token_noti: token_noti
            });
            return res.status(200).json({ message: 'Token_noti actualizado' });
        }
    } catch (error) {
        console.error('Error al actualizar el token del usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el token del usuario' });
    }
};

// crear el administrador inicial
const adminUser = async () => {
    try {
        const usersRef = admin.firestore().collection('Usuarios');
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
            const adminUser = {
                cedula: '0100000000',
                nombre: 'Super',
                apellido: 'Administrador',
                email: 'admin@admin.com',
                rol: 'admin',
                token_noti: null, // Si tienes un token de notificación inicial, puedes agregarlo aquí
            };
            await usersRef.doc(adminUser.cedula).set(adminUser);
            console.log('Usuario administrador creado.');
        } else {
            console.log('La colección de usuarios no está vacía.');
        }
    } catch (error) {
        console.error('Error al inicializar usuario administrador:', error);
    }
};

module.exports = {
    login,
    createUsuario,
    getUsuario,
    updateUsuario,
    deleteUsuario,
    verifyToken,
    actualizarToken,
    adminUser
};