const { admin } = require('../database/firebase');
const { sendNotification } = require('./despacho.controller');
// Crear un nuevo depósito
const createDeposito = async (req, res) => {
    const { cliente, contenedor_uid, tipo_reciclaje, peso, montoPagado, fecha } = req.body;

    try {
        // Obtener el contenedor
        const contenedorRef = admin.firestore().collection('contenedores').doc(contenedor_uid);
        const contenedorDoc = await contenedorRef.get();
        
        if (!contenedorDoc.exists) {
            return res.status(404).json({message: 'Contenedor no encontrado'});
        }
        
        const contenedorData = contenedorDoc.data();
        const capacidadMax = contenedorData.capacidadMax;
        const capacidadActual = contenedorData.capacidadActual;
        
        // Validar si hay suficiente espacio
        const espacioDisponible = capacidadMax - capacidadActual;
        var estado = '';
        if (peso > espacioDisponible) {
            return res.status(400).json({message: 'No hay suficiente espacio en el contenedor'});
        }
        if (peso === espacioDisponible) {
            estado = 'Lleno';
            sendNotification(tipo_reciclaje)
        } else {
            estado = 'En uso';
        }
        
        // Crear el depósito
        const depositoRef = admin.firestore().collection('depositos').doc(); // Firestore generará el UID
        await depositoRef.set({ cliente, contenedor_uid, tipo_reciclaje, peso, montoPagado, fecha });
        
        // Actualizar la capacidad del contenedor
        await contenedorRef.update({ capacidadActual: capacidadActual + peso, estado: estado });
        
        // Actualizar el saldo del cliente
        const clienteRef = admin.firestore().collection('Usuarios').doc(cliente);
        const clienteDoc = await clienteRef.get();
        
        if (!clienteDoc.exists) {
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        
        const clienteData = clienteDoc.data();
        const saldoActual = clienteData.saldo;
        const nuevoSaldo = saldoActual + montoPagado;
        
        await clienteRef.update({ saldo: nuevoSaldo });
        
        res.status(200).json({message: 'Depósito creado y saldo del cliente actualizado exitosamente'});
    } catch (error) {
        console.error('Error al crear depósito:', error);
        res.status(500).json({message: 'Error al crear depósito.', error: error.message});
    }
};

// Leer un depósito por UID
const getDeposito = async (req, res) => {
    const { uid } = req.params;
    try {
        const depositoRef = admin.firestore().collection('depositos').doc(uid);
        const doc = await depositoRef.get();
        if (!doc.exists) {
            return res.status(404).send('Depósito no encontrado');
        }
        res.status(200).json(doc.data());
    } catch (error) {
        res.status(500).send('Error al obtener depósito: ' + error.message);
    }
};

// Actualizar un depósito
const updateDeposito = async (req, res) => {
    const { uid } = req.params;
    const { cliente, contenedor_uid, tipo_reciclaje, peso, monto_pagado, fecha } = req.body;
    try {
        const depositoRef = admin.firestore().collection('depositos').doc(uid);
        await depositoRef.update({ cliente, contenedor_uid, tipo_reciclaje, peso, monto_pagado, fecha });
        res.status(200).send('Depósito actualizado exitosamente');
    } catch (error) {
        res.status(500).send('Error al actualizar depósito: ' + error.message);
    }
};

// Eliminar un depósito
const deleteDeposito = async (req, res) => {
    const { uid } = req.params;
    try {
        const depositoRef = admin.firestore().collection('depositos').doc(uid);
        await depositoRef.delete();
        res.status(200).send('Depósito eliminado exitosamente');
    } catch (error) {
        res.status(500).send('Error al eliminar depósito: ' + error.message);
    }
};

module.exports = {
    createDeposito,
    getDeposito,
    updateDeposito,
    deleteDeposito
};