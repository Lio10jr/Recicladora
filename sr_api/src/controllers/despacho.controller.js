const { admin } = require('../database/firebase');

// Crear un nuevo despacho
const createDespacho = async (req, res) => {
    try {
        const despachoData = req.body;
        const despachoRef = admin.firestore().collection('Despachos').doc(); // Genera un nuevo UID automáticamente
        await despachoRef.set(despachoData);
        res.status(201).json({ id: despachoRef.id, ...despachoData });
    } catch (error) {
        console.error('Error al crear despacho:', error);
        res.status(500).json({ error: 'Error al crear despacho' });
    }
};

// Obtener un despacho por UID
const getDespacho = async (req, res) => {
    const { uid } = req.params;
    try {
        const despachoRef = admin.firestore().collection('Despachos').doc(uid);
        const despachoDoc = await despachoRef.get();
        if (!despachoDoc.exists) {
            return res.status(404).json({ error: 'Despacho no encontrado' });
        }
        res.status(200).json(despachoDoc.data());
    } catch (error) {
        console.error('Error al obtener despacho:', error);
        res.status(500).json({ error: 'Error al obtener despacho' });
    }
};

// Actualizar un despacho por UID
const updateDespacho = async (req, res) => {
    const { uid } = req.params;
    const despachoData = req.body;
    try {
        const despachoRef = admin.firestore().collection('Despachos').doc(uid);
        const despachoDoc = await despachoRef.get();
        if (!despachoDoc.exists) {
            return res.status(404).json({ error: 'Despacho no encontrado' });
        }
        await despachoRef.update(despachoData);
        res.status(200).json({ id: uid, ...despachoData });
    } catch (error) {
        console.error('Error al actualizar despacho:', error);
        res.status(500).json({ error: 'Error al actualizar despacho' });
    }
};

// Eliminar un despacho por UID
const deleteDespacho = async (req, res) => {
    const { uid } = req.params;
    try {
        const despachoRef = admin.firestore().collection('Despachos').doc(uid);
        const despachoDoc = await despachoRef.get();
        if (!despachoDoc.exists) {
            return res.status(404).json({ error: 'Despacho no encontrado' });
        }
        await despachoRef.delete();
        res.status(200).json({ message: 'Despacho eliminado' });
    } catch (error) {
        console.error('Error al eliminar despacho:', error);
        res.status(500).json({ error: 'Error al eliminar despacho' });
    }
};

const sendNotification = async (tipo_reciclaje) => {
    try {
      const usersRef = admin.firestore().collection('Usuarios');
      const snapshot = await usersRef.where('token_noti', '!=', null).get();
  
      if (snapshot.empty) {
        console.log('No se encontraron usuarios con token_noti.');
        return;
      }
  
      // Preparar los tokens
      const tokens = [];
      snapshot.forEach(doc => {
        const user = doc.data();
        tokens.push(user.token_noti);
      });
  
      // Crear el mensaje de la notificación
      const message = {
        notification: {
          title: 'Contenedor Lleno',
          body: `El contenedor de tipo ${tipo_reciclaje} se ha completado es hora de despacharlo!.`,
        },
        tokens: tokens,
        data: {
            page: '/menu/home',
        },
        android: {
            priority: 'high'
        }
      };
  
      // Enviar la notificación
      const response = await admin.messaging().sendMulticast(message);
      console.log('Notificaciones enviadas:', response);
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  };  

module.exports = {
    createDespacho,
    getDespacho,
    updateDespacho,
    deleteDespacho,
    sendNotification
};
