import { Router } from 'express';
import ProductManager from "../dao/services/productManager.js";

const realTimeProducts = Router();
const productManager = new ProductManager();

realTimeProducts.get('/', async (req, res) => {
  try {
    const products = await productManager.getAll(31, 0);
    console.log("🚀 ~ realTimeProducts.get ~ products:", products.result.docs)

    res.render('realTimeProducts', { products: products.result.docs });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error al obtener la lista de productos');
  }
});

export default realTimeProducts;