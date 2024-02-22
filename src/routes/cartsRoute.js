
import { Router } from "express";

const cartsRoute = Router();
const carts = [];

cartsRoute.post("/", (req, res) => {
    try {
      const newCart = {
        id: generateCartId(),
        products: [],
      };
  
      carts.push(newCart)
      res.status(201).json(carts);
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      res.status(500).send("Error al crear el carrito");
    }
  });
  
  function generateCartId() {
    let idCounter = 1;
  
    if (carts.length > 0) {
      const lastCartId = carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0);
      idCounter = lastCartId + 1;
    }
  
    return idCounter
  }

  cartsRoute.get("/:cid", (req, res) => {
    try {
      const { cid } = req.params;

      const cart = carts.find((cart) => cart.id == cid);

      if (!cart) {
        res.status(404).send("No se encontró el carrito con el id " + cid);
        return;
      }
  
      const products = cart.products;
  
      res.status(200).json(products);
    } catch (error) {
      console.error("Error al obtener los productos del carrito:", error);
      res.status(500).send("Error al obtener los productos del carrito");
    }
  });

  cartsRoute.post("/:cid/product/:pid/", (req, res) => {
    try {
      const { cid, pid } = req.params;
  
      const cart = carts.find((cart) => cart.id == cid);
  
      if (!cart) {
        res.status(404).send("No se encontró el carrito con el id " + cid);
        return;
      }
  
      const existingProduct = cart.products.find((product) => product.id == pid);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        const newProduct = {
          id: pid,
          quantity: 1,
        };
        cart.products.push(newProduct);
      }
  
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      res.status(500).send("Error al agregar el producto al carrito");
    }
  });

export default cartsRoute;