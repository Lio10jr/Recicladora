const { admin } = require('../database/firebase');

// Crear un nuevo contenedor
const createContenedor = async (req, res) => {
    const { tipo_reciclaje, categorias, capacidad_max, capacidad_actual, estado, activo } = req.body;
    try {
        const contenedorRef = admin.firestore().collection('contenedores').doc(); // Firestore generará el UID
        await contenedorRef.set({ tipo_reciclaje, categorias, capacidad_max, capacidad_actual, estado, activo });
        res.status(201).send('Contenedor creado exitosamente');
    } catch (error) {
        res.status(500).send('Error al crear contenedor: ' + error.message);
    }
};

// Leer un contenedor por UID
const getContenedor = async (req, res) => {
    const { uid } = req.params;
    try {
        const contenedorRef = admin.firestore().collection('contenedores').doc(uid);
        const doc = await contenedorRef.get();
        if (!doc.exists) {
            return res.status(404).send('Contenedor no encontrado');
        }
        res.status(200).json(doc.data());
    } catch (error) {
        res.status(500).send('Error al obtener contenedor: ' + error.message);
    }
};

// Obtener todos los contenedores
const getContenedores = async (req, res) => {
    try {
        const contenedoresRef = admin.firestore().collection('contenedores');
        const snapshot = await contenedoresRef.get();
        if (snapshot.empty) {
            return res.status(404).json({ error: 'No se encontraron contenedores' });
        }
        const contenedores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(contenedores);
    } catch (error) {
        console.error('Error al obtener contenedores:', error);
        res.status(500).json({ error: 'Error al obtener contenedores' });
    }
};

// Obtener todos los contenedores
const getContenedoresActivos = async (req, res) => {
    try {
        const contenedoresRef = admin.firestore().collection('contenedores');
        const snapshot = await contenedoresRef.where('activo', '==', true).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No se encontraron contenedores activos' });
        }

        const contenedores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(contenedores);
    } catch (error) {
        console.error('Error al obtener contenedores activos:', error);
        res.status(500).json({ massage: 'Error al obtener contenedores activos', error: error });
    }
};

// Actualizar un contenedor
const updateContenedor = async (req, res) => {
    const { uid } = req.params;
    const { tipo_reciclaje, categorias, capacidad_max, capacidad_actual, estado, activo } = req.body;
    try {
        const contenedorRef = admin.firestore().collection('contenedores').doc(uid);
        await contenedorRef.update({ tipo_reciclaje, categorias, capacidad_max, capacidad_actual, estado, activo });
        res.status(200).send('Contenedor actualizado exitosamente');
    } catch (error) {
        res.status(500).send('Error al actualizar contenedor: ' + error.message);
    }
};

// Eliminar un contenedor
const deleteContenedor = async (req, res) => {
    const { uid } = req.params;
    try {
        const contenedorRef = admin.firestore().collection('contenedores').doc(uid);
        await contenedorRef.delete();
        res.status(200).send('Contenedor eliminado exitosamente');
    } catch (error) {
        res.status(500).send('Error al eliminar contenedor: ' + error.message);
    }
};

const despacharContenedor = async (req, res) => {
    const { id } = req.params; // Asumimos que el ID del contenedor se envía como parámetro en la URL
    const contenedorData = req.body; // Los datos del contenedor enviados por el cliente

    try {
        const contenedoresRef = admin.firestore().collection('contenedores');
        const contenedorRef = contenedoresRef.doc(id);

        // Obtén el contenedor existente
        const doc = await contenedorRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Contenedor no encontrado' });
        }

        // Actualiza el contenedor existente
        await contenedorRef.update({
            activo: false,
            estado: 'Despachado'
        });

        // Crea un nuevo contenedor
        await contenedoresRef.add({
            activo: true,
            estado: 'En uso',
            capacidadActual: 0,
            capacidadMax: contenedorData.capacidadMax,
            categorias: contenedorData.categorias,
            tipo_reciclaje: contenedorData.tipo_reciclaje,
        });

        res.status(200).json({ message: 'Contenedor despachado y nuevo contenedor creado' });
    } catch (error) {
        console.error('Error al despachar el contenedor:', error);
        res.status(500).json({ error: 'Error al despachar el contenedor' });
    }
};

const initializeContenedores = async () => {
    try {
        const contenedoresRef = admin.firestore().collection('contenedores');
        const snapshot = await contenedoresRef.get();

        if (snapshot.empty) {
            const initialContenedores = [
                {
                    tipo_reciclaje: 'Orgánico', categorias: [
                        { nombre: 'Cascara de Frutas', precioKg: 0.05 },
                        { nombre: 'Verduras', precioKg: 0.04 },
                        { nombre: 'Hojas', precioKg: 0.01 },
                    ], capacidadMax: 1000, capacidadActual: 0, activo: true, estado: 'En uso'
                },
                {
                    tipo_reciclaje: 'Papel', categorias: [
                        { nombre: 'Revistas', precioKg: 0.10 },
                        { nombre: 'Cartón', precioKg: 0.14 },
                        { nombre: 'Fotos', precioKg: 0.05 },
                        { nombre: 'Libros', precioKg: 0.06 },
                        { nombre: 'Periódico', precioKg: 0.07 },
                    ], capacidadMax: 1000, capacidadActual: 0, activo: true, estado: 'En uso'
                },
                {
                    tipo_reciclaje: 'Vidrio', categorias: [
                        { nombre: 'Botellas', precioKg: 0.05 },
                        { nombre: 'Platos', precioKg: 0.04 },
                        { nombre: 'Vasos', precioKg: 0.04 },
                    ], capacidadMax: 1000, capacidadActual: 0, activo: true, estado: 'En uso'
                },
                {
                    tipo_reciclaje: 'Peligroso', categorias: [
                        { nombre: 'Pilas', precioKg: 0.15 },
                        { nombre: 'Focos', precioKg: 0.20 },
                        { nombre: 'Medicamentos', precioKg: 0.25 },
                        { nombre: 'Pegamento', precioKg: 0.12 },
                        { nombre: 'Baterias', precioKg: 0.30 },
                    ], capacidadMax: 1000, capacidadActual: 0, activo: true, estado: 'En uso'
                },
                {
                    tipo_reciclaje: 'Plástico', categorias: [
                        { nombre: 'Cubiertos', precioKg: 0.15 },
                        { nombre: 'Fundas', precioKg: 0.15 },
                        { nombre: 'Tuberías', precioKg: 0.46 },
                        { nombre: 'Envases', precioKg: 0.20 },
                    ], capacidadMax: 1000, capacidadActual: 0, activo: true, estado: 'En uso'
                },
            ];

            const batch = admin.firestore().batch();

            initialContenedores.forEach((contenedor) => {
                const docRef = contenedoresRef.doc();
                batch.set(docRef, contenedor);
            });

            await batch.commit();
            console.log('Contenedores iniciales creados.');
        } else {
            console.log('La colección de contenedores no está vacía.');
        }
    } catch (error) {
        console.error('Error al inicializar contenedores:', error);
    }
};


module.exports = {
    createContenedor,
    getContenedor,
    updateContenedor,
    deleteContenedor,
    getContenedores,
    getContenedoresActivos,
    despacharContenedor,
    initializeContenedores
};