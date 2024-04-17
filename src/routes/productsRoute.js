import ProductManager from "../dao/services/productManager.js"
import express from "express"
import { io } from '../app.js';


const productManager = new ProductManager()
const productsRouter = express.Router()


productsRouter.get("/", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort = "", query = "", availability = "" } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        const filter = {};
        const sortOption = {};

        // Filtro por categoría
        if (query) {
            filter.category = query;
        }

        // Filtro por disponibilidad
        if (availability) {
            filter.status = availability === "available";
        }

        // Ordenamiento por precio
        if (sort === "desc") {
            sortOption.price = -1;
        } else if (sort === "asc") {
            sortOption.price = 1;
        } else {
            sortOption._id = 1;
        }

        const skip = (page - 1) * limit;
        const result = await productManager.getAll(limit, skip, sortOption, filter);

        res.json({ data: result });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error al obtener los productos");
    }
});

productsRouter.get("/:_id", async (req, res) => {

    try {
        let id = req.params._id;
        let data = await productManager.getById(id);
        res.json({ data });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send("Error al obtener el producto");
    }
})

productsRouter.post("/", async (req, res) => {

    try {
        const newProduct = req.body;
        let result = await productManager.addProduct(newProduct);
        res.json({ result });
        let data = await productManager.getAll();
        io.emit('products', data);
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).send("Error al agregar el producto");
    }
})

productsRouter.post("/insert", async (req, res) => {

    try {
        const product = req.body;
        let result = await productManager.addProducts(product);
        res.json({ result });
        let data = await productManager.getAll();
        io.emit('products', data);
    } catch (error) {
        console.error("Error al insertar el documento:", error);
        res.status(500).send("Error al instertar el documento");
    }
})

productsRouter.put("/:_id", async (req, res) => {

    try {
        let id = req.params._id;
        let productOrigin = await productManager.getById(id)
        let upDateProduct = req.body;
        let result = await productManager.updateProduct(id, upDateProduct);
        console.log("🚀 ~ productsRouter.put ~ result:", result)
        res.json({ originalProduct: productOrigin, modifiedProduct: upDateProduct, result: result })
        let data = await productManager.getAll()
        io.emit('products', data.result.docs);
    } catch (error) {
        console.error("Error al editar el producto:", error);
        res.status(500).send("Error al editar el producto");
    }
})

productsRouter.delete("/:_id", async (req, res) => {

    try {
        let id = req.params._id;
        let result = await productManager.delateProduct(id);
        res.json({ result });
        let data = await productManager.getAll()
        io.emit('products', data);
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).send("Error al eliminar el producto");
    }
})

export default productsRouter;
