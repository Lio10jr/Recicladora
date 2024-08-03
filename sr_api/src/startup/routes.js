const express = require('express');
const cors = require('cors');
const testRoutes = require("../routes/test.routes");
const usuarioRoutes = require('../routes/usuario.routes')
const productoRoutes = require('../routes/producto.routes')
const contenedorRoutes = require('../routes/contenedor.routes')
const depositoRoutes = require('../routes/deposito.routes')
const despachoRoutes = require('../routes/despacho.routes')
const ventaRoutes = require('../routes/venta.routes')

const { err } = require("../middlewares/err");

module.exports = function (app) {
  // Middlewares
  const allowedOrigins = [
    'https://recicladora.vercel.app/api/',
    'http://localhost:8100', 
    'http://localhost:4200', 
    'http://192.168.100.36:8100', 
    'https://localhost'
  ];
  
  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));

  app.use(express.json());

  // Routes
  app.use("/api", testRoutes);
  app.use("/api/usuario", usuarioRoutes);
  app.use("/api/producto", productoRoutes);
  app.use("/api/contenedor", contenedorRoutes);
  app.use("/api/deposito", depositoRoutes);
  app.use("/api/despacho", despachoRoutes);
  app.use("/api/venta", ventaRoutes);

  // Middleware de errores
  app.use(err);
}