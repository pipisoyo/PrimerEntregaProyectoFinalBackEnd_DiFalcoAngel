
import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const routerProducts = Router();
const productManager = new ProductManager();


//Lista todos los productos si no se incluye un limite
routerProducts.get("/", async ({ query }, res) => {
  try {
    const { limit } = query;
    console.log("🚀 ~ routerProducts.get ~ limit:", limit);
    let products = await productManager.getProducts();

    if (limit) {
      products = products.slice(0, parseInt(limit));
    }
    res.json(products);
  } catch (error) {
    console.error("Error al obtener los productos", error);
    res.status(500).send("Error al obtener los productos");
  }
});

//Muestra el producto con el id encontrado
routerProducts.get("/:pid/", async (req, res) => {
  try {
    const { pid } = req.params;
    console.log("🚀 ~ routerProducts.get ~ pid:", pid);
    const product = await productManager.getProductById(pid);

    res.json(product);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send("Error al obtener el producto");
  }
});

//Agrega Productos
routerProducts.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Crear el objeto de datos del nuevo producto
    const productData = {
      title,
      description,
      code,
      price,
      thumbnail: thumbnails || [],
      stock,
      category,
    };
    await productManager.addProduct(productData);

    res.status(201).send("Producto agregado exitosamente"); // Devuelve una respuesta exitosa
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).send("Error al agregar el producto");
  }
});

//Actualiza productos
routerProducts.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;

    try {
      const updateSuccess = await productManager.updateProduct(pid, updatedFields);

      if (updateSuccess) {
        res.send("Producto actualizado exitosamente");
      } else {
        res.status(404).send("No se encontró el producto con el id " + pid);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).send("Error al actualizar el producto");
  }
});

routerProducts.delete("/:pid/", async (req, res) => {
  try {
    const { pid } = req.params;

    // Busca el producto con el pid indicado
    const product = await productManager.getProductById(pid);

    if (!product) {
      res.status(404).send("No se encontró el producto con el id " + pid);
      return;
    }

    // Elimina el producto de la lista
    const deletedProduct = await productManager.deleteProduct(pid);

    if (!deletedProduct) {
      res.status(500).send("Error al eliminar el producto");
      return;
    }

    res.send("Producto eliminado exitosamente");
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).send("Error al eliminar el producto");
  }
});

export default routerProducts;