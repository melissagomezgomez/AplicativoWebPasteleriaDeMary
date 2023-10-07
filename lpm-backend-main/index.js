const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./src/routes");
require("./database/config");

const PORT = 3001;

// Configurar el middleware body-parser para analizar datos JSON
app.use(bodyParser.json());

//Configurar las rutas del servidor
app.use("/api", routes);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en puerto ${PORT}`);
});

module.exports = app;
