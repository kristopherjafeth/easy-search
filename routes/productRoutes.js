const { Router } = require("express");

const Product = require("../models/product");

const router = Router();



router.post("/create-products", async (req, res) => {
  let productsData = req.body; // Expecting an array of products

  // If the data is not an array, wrap it in an array
  if (!Array.isArray(productsData)) {
    console.log("Los datos no están en un array. Convirtiendo a un array.");
    productsData = [productsData]; // Convert to an array
  }

  // Validate that the array is not empty
  if (productsData.length === 0) {
    console.log("Debe enviar al menos un producto.");
    return res.status(400).json({ message: "Debe enviar al menos un producto." });
  }

  try {
    // Insert the products into the database
    const createdProducts = await Product.insertMany(productsData);
    console.log(`${createdProducts.length} productos creados con éxito.`);

    // Return success response
    res.json({
      message: `${createdProducts.length} productos creados con éxito.`,
      products: createdProducts,
    });
  } catch (error) {
    console.error("Error al crear los productos:", error);
    res.status(500).json({ message: "Error al crear productos.", error });
  }
});



// Ruta para buscar productos en MongoDB
router.get("/search", async (req, res) => {
  const { query } = req.query;

  const filters = {};

  if (query) {
    filters.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { categories: { $regex: query, $options: "i" } },
      { brand: { $regex: query, $options: "i" } },
      { sku: { $regex: query, $options: "i" } },
    ];
  }

  try {
    const products = await Product.find(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar productos", error });
  }
});


router.post("/update-product", async (req, res) => {
  const { external_id, name, price, sku, status, action, created_at, updated_at, categories, images } = req.body;



  // Validar los campos obligatorios
  if (!external_id || !action) {
    return res.status(400).json({ message: "El external_id y la acción son obligatorios." });
  }

  // Validar que las categorías e imágenes no estén vacías si están presentes
  if (categories && categories.length === 0) {
    console.log("Categorías están vacías");
  }

  if (images && images.length === 0) {
    console.log("Imágenes están vacías");
  }

  try {
    if (action === "create" || action === "update") {
      // Crear o actualizar producto
      

      
      const updatedProduct = await Product.findOneAndUpdate(
        { external_id },
        {
          external_id,
          name,
          price,
          sku,
          status,
          created_at,
          updated_at,
          categories: categories || [], // Garantiza que sea un arreglo
          images: images || [],         // Garantiza que sea un arreglo
        },
        { upsert: true, new: true, runValidators: true }
      ).catch(error => {
        console.error('Error al guardar el producto:', error);
      });
      

      if (!updatedProduct) {
        return res.status(500).json({
          message: "No se pudo crear o actualizar el producto.",
        });
      }


      return res.json({
        message: `Producto ${action === "create" ? "creado" : "actualizado"} con éxito.`,
        product: updatedProduct,
      });
    } else if (action === "delete") {
     

      const deletedProduct = await Product.findOneAndDelete({ external_id });

      if (!deletedProduct) {
        return res.status(404).json({ message: "El producto no existe o ya fue eliminado." });
      }

      return res.json({
        message: "Producto eliminado con éxito.",
        product: deletedProduct,
      });


    } else {
      return res.status(400).json({ message: "Acción no válida. Use 'create', 'update' o 'delete'." });
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return res.status(500).json({ message: "Error al procesar la solicitud.", error });
  }
});





module.exports = router;
