const { admin, bucket  } = require('../database/firebase');

// Crear un nuevo producto
const createProducto = async (req, res) => {
    const { nombre_pro, vendedor_ced, descripcion, image, precio, estado, fecha_publicacion } = req.body;
    try {
        const productoRef = admin.firestore().collection('productos').doc(); // Firestore generará el UID
        await productoRef.set({ nombre_pro, vendedor_ced, descripcion, image, precio, estado, fecha_publicacion });
        res.status(200).json({message: 'Producto creado exitosamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al crear producto: ', error: error.message});
    }
};

// Leer un producto por UID
const getProducto = async (req, res) => {
    const { uid } = req.params;
    try {
        const productoRef = admin.firestore().collection('productos').doc(uid);
        const doc = await productoRef.get();
        if (!doc.exists) {
            return res.status(404).json('Producto no encontrado');
        }
        res.status(200).json(doc.data());
    } catch (error) {
        res.status(500).json('Error al obtener producto: ' + error.message);
    }
};

// Obtener productos con estado en true
const getProductosConEstadoActivo = async (req, res) => {
    try {
        const productosRef = admin.firestore().collection('productos');
        const query = productosRef.where('estado', '==', true);
        const snapshot = await query.get();

        if (snapshot.empty) {
            return res.status(404).json({ error: 'No se encontraron productos activos' });
        }

        const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos activos:', error);
        res.status(500).json({ error: 'Error al obtener productos activos' });
    }
};

// Actualizar un producto
const updateProducto = async (req, res) => {
    const { uid } = req.params;
    const { nombre_pro, vendedor_ced, descripcion, image, precio, estado, fecha_publicacion } = req.body;
    try {
        const productoRef = admin.firestore().collection('productos').doc(uid);
        await productoRef.update({ nombre_pro, vendedor_ced, descripcion, image, precio, estado, fecha_publicacion });
        res.status(200).json('Producto actualizado exitosamente');
    } catch (error) {
        res.status(500).json('Error al actualizar producto: ' + error.message);
    }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
    const { uid } = req.params;
    try {
        const productoRef = admin.firestore().collection('productos').doc(uid);
        await productoRef.delete();
        res.status(200).json({message: 'Producto eliminado exitosamente'});
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar producto', error: + error.message});
    }
};

// Subir la imagen del producto
const uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No existe el archivo' });
    }
    try {
        const file = req.file;
        const uniqueId = Date.now().toString();
        const fileName = `${uniqueId}-${file.originalname}`;

        // Referencia al archivo en Firebase Storage
        const fileUpload = bucket.file(fileName);

        // Subir archivo a Firebase Storage
        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype
            },
            public: true
        });

        // Obtener la URL pública del archivo
        const [metadata] = await fileUpload.getMetadata();
        const publicUrl = `https://storage.googleapis.com/${metadata.bucket}/${fileName}`;

        // Responder con la URL pública
        res.json({ imageUrl: publicUrl });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
};

module.exports = {
    createProducto,
    getProducto,
    updateProducto,
    deleteProducto,
    getProductosConEstadoActivo,
    uploadImage
};