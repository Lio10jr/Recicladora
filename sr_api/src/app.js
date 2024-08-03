require('dotenv').config();
const express = require('express');
const { initializeContenedores } = require('./controllers/contenedor.controller');
const { adminUser } = require('./controllers/usuario.controller');
require('express-async-errors');
const initializeRoutes = require('./startup/routes');

const app = express();
const port = process.env.PORT || 4000;

const initializeDatabase = async () => {
  await initializeContenedores();
  await adminUser();
};

initializeRoutes(app);

// inicializar datos iniciales
initializeDatabase();

process.on("uncaughtException", (err) => console.log(err.message));

process.on("unhandledRejection", (err) => console.log(err.message));

app.listen(port, () => {
  console.log(`Servidor ejecutado en el puerto ${port}`);
});