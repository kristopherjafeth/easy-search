// Importar dependencias principales
const express = require("express");
const bodyParser = require("body-parser");
const { connectMongo } = require("./config/db");
const productRoutes = require("./routes/productRoutes");

// Express
const app = express();
app.use(bodyParser.json());

// Rutas de la API
app.use("/api/products", productRoutes);

// Inicializar el servidor
const PORT = 5000;
app.listen(PORT, async () => {
  await connectMongo();
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

