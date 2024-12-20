# Easy Search Node

`easy-search-node` es un paquete NPM diseñado para facilitar la creación de APIs para gestionar productos utilizando MongoDB, Express y Node.js. Este paquete incluye rutas predefinidas para crear, buscar, actualizar y eliminar productos, así como una configuración sencilla para conectarse a una base de datos MongoDB.

## Instalación

```bash
npm install easy-search-node
```

## Uso

A continuación, se muestra un ejemplo básico de cómo configurar un servidor utilizando `easy-search-node`:

### Configuración del servidor

```javascript
const express = require("express");
const connectMongo = require("easy-search-node/config/db");
const { productRoutes } = require("easy-search-node/routes/productRoutes");

const app = express();

// Configuración de Express
app.use(express.json());

// Conexión a MongoDB
connectMongo().then(() => {
  console.log("Conectado a MongoDB");
}).catch(err => {
  console.error("Error al conectar a MongoDB", err);
});

// Configuración de rutas
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
```

### Variables de entorno

Asegúrate de configurar las siguientes variables en tu archivo `.env`:

```env
MONGO_URI=mongodb://<usuario>:<contraseña>@<host>:<puerto>/<nombre_base_datos>
```

## Rutas incluidas

### Crear productos

**POST** `/api/products/create-products`

- **Descripción**: Permite crear uno o varios productos en la base de datos.
- **Cuerpo de la solicitud**:
  ```json
  [
    {
      "name": "Producto 1",
      "price": 100,
      "sku": "SKU001",
      "categories": ["Categoría 1"],
      "description": "Descripción del producto",
      "brand": "Marca 1",
      "images": ["url1", "url2"]
    }
  ]
  ```
- **Respuesta de éxito**:
  ```json
  {
    "message": "1 productos creados con éxito.",
    "products": [ { ... } ]
  }
  ```

### Buscar productos

**GET** `/api/products/search`

- **Descripción**: Permite buscar productos en la base de datos.
- **Parámetros de consulta**:
  - `query` (opcional): Cadena para buscar productos por nombre, descripción, categorías, marca o SKU.
- **Respuesta de éxito**:
  ```json
  [
    {
      "_id": "<id>",
      "name": "Producto 1",
      "price": 100,
      "sku": "SKU001",
      ...
    }
  ]
  ```

### Actualizar o eliminar productos

**POST** `/api/products/update-product`

- **Descripción**: Permite actualizar o eliminar un producto según la acción especificada.
- **Cuerpo de la solicitud**:
  ```json
  {
    "external_id": "12345",
    "action": "update",
    "name": "Nuevo nombre",
    "price": 150
  }
  ```
- **Acciones soportadas**:
  - `create`: Crea un nuevo producto si no existe.
  - `update`: Actualiza un producto existente.
  - `delete`: Elimina un producto por su `external_id`.
- **Respuesta de éxito**:
  ```json
  {
    "message": "Producto actualizado con éxito.",
    "product": { ... }
  }
  ```

## Configuración de la base de datos

El archivo de configuración para conectar a MongoDB se encuentra en `easy-search-node/config/db`.

### Ejemplo

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectMongo;
```




