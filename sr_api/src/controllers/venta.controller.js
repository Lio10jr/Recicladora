const { admin } = require('../database/firebase');

// Crear una nueva venta
const createVenta = async (req, res) => {
    const { producto_uid, vendedor_ced, comprador_ced, precio_pro, comision, monto_total, fecha } = req.body;

    try {
        // Crear la venta en Firestore
        const ventaRef = admin.firestore().collection('ventas').doc(); // Firestore generará el UID
        await ventaRef.set({
            producto_uid,
            vendedor_ced,
            comprador_ced,
            precio_pro,
            comision,
            monto_total,
            fecha
        });

        // Actualizar el saldo del vendedor
        const vendedorRef = admin.firestore().collection('Usuarios').doc(vendedor_ced);
        const vendedorDoc = await vendedorRef.get();
        if (!vendedorDoc.exists) {
            return res.status(404).json({message: 'Vendedor no encontrado'});
        }
        const vendedorData = vendedorDoc.data();
        const nuevoSaldoVendedor = vendedorData.saldo + monto_total;
        await vendedorRef.update({ saldo: nuevoSaldoVendedor });

        // Actualizar el saldo del comprador
        const compradorRef = admin.firestore().collection('Usuarios').doc(comprador_ced);
        const compradorDoc = await compradorRef.get();
        if (!compradorDoc.exists) {
            return res.status(404).json({message: 'Comprador no encontrado'});
        }
        const compradorData = compradorDoc.data();
        const nuevoSaldoComprador = compradorData.saldo - precio_pro;
        await compradorRef.update({ saldo: nuevoSaldoComprador });

        // Actualizar el estado del producto
        const productoRef = admin.firestore().collection('productos').doc(producto_uid);
        const productoDoc = await productoRef.get();
        if (!productoDoc.exists) {
            return res.status(404).json({message: 'Producto no encontrado'});
        }
        await productoRef.update({ estado: false });

        res.status(200).json({message: 'Venta creada y saldos actualizados exitosamente'});
    } catch (error) {
        console.error('Error al crear venta:', error);
        res.status(500).json({message: 'Error al crear venta', error: error.message});
    }
};

// Leer una venta por UID
const getVenta = async (req, res) => {
    const { uid } = req.params;
    try {
        const ventaRef = admin.firestore().collection('ventas').doc(uid);
        const doc = await ventaRef.get();
        if (!doc.exists) {
            return res.status(404).json('Venta no encontrada');
        }
        res.status(200).json(doc.data());
    } catch (error) {
        res.status(500).json('Error al obtener venta: ' + error.message);
    }
};

// Actualizar una venta
const updateVenta = async (req, res) => {
    const { uid } = req.params;
    const { producto_uid, vendedor_ced, comprador_ced, precio_pro, comision, monto_total, fecha } = req.body;
    try {
        const ventaRef = admin.firestore().collection('ventas').doc(uid);
        await ventaRef.update({ producto_uid, vendedor_ced, comprador_ced, precio_pro, comision, monto_total, fecha });
        res.status(200).json('Venta actualizada exitosamente');
    } catch (error) {
        res.status(500).json('Error al actualizar venta: ' + error.message);
    }
};

// Eliminar una venta
const deleteVenta = async (req, res) => {
    const { uid } = req.params;
    try {
        const ventaRef = admin.firestore().collection('ventas').doc(uid);
        await ventaRef.delete();
        res.status(200).json('Venta eliminada exitosamente');
    } catch (error) {
        res.status(500).json('Error al eliminar venta: ' + error.message);
    }
};

const getVentasUser = async (req, res) => {
    const { cedula } = req.params;
    try {
      // Referencia a la colección de ventas
      const ventasRef = admin.firestore().collection('ventas');
      
      // Consultar ventas donde 'comprador_ced' o 'vendedor_ced' coincidan con la cedula
      const ventasQuery = ventasRef.where('comprador_ced', '==', cedula)
                                  .get()
                                  .then(snapshot => {
                                    if (snapshot.empty) {
                                      return [];
                                    }
                                    return snapshot.docs.map(doc => doc.data());
                                  });
  
      const ventasQuery2 = ventasRef.where('vendedor_ced', '==', cedula)
                                  .get()
                                  .then(snapshot => {
                                    if (snapshot.empty) {
                                      return [];
                                    }
                                    return snapshot.docs.map(doc => doc.data());
                                  });
  
      // Esperar ambas consultas
      const [compras, ventas] = await Promise.all([ventasQuery, ventasQuery2]);
  
      // Combinar ambas listas
      const allVentas = [...compras, ...ventas];
  
      // Obtener los productos correspondientes y añadir el nombre_pro
      const ventasConProductos = await Promise.all(allVentas.map(async (venta) => {
        const productoRef = admin.firestore().collection('productos').doc(venta.producto_uid);
        const productoDoc = await productoRef.get();
        if (productoDoc.exists) {
          const productoData = productoDoc.data();
          venta.producto_uid = productoData.nombre_pro;
        }
        return venta;
      }));
  
      if (ventasConProductos.length === 0) {
        return res.status(404).json('Ventas no encontradas');
      }
  
      res.status(200).json(ventasConProductos);
    } catch (error) {
      res.status(500).json('Error al obtener ventas: ' + error.message);
    }
  };
  

module.exports = {
    createVenta,
    getVenta,
    updateVenta,
    deleteVenta,
    getVentasUser
};