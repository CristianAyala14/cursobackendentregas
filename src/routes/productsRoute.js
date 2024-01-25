import { Router } from "express";
//product Manager
import { ProductManagerDB } from "../dao/managers/productManagerdb.js";
import productsModel from "../dao/models/productsModel.js";

const router = Router();
const productManager = new ProductManagerDB();

//buscar productos (TESTED)
router.get("/", async (req,res)=>{
    try {
        const { limit, page, sort, searchType, searchValue } =req.query;
        let filter = {}
        if (searchType === "title") {
            filter = { title: searchValue };
        } else if (searchType === "category") {
            filter = { category: searchValue };
        } else if(searchType === "none"){
            filter = {};
        }
        
        const options = {
            limit: (parseInt(limit) > 0) ? parseInt(limit) : 10,
            page: (parseInt(page) > 0) ? parseInt(page) : 1,
            sort: { price: sort === "asc" ? 1 : -1 },
            lean: true,
        };

        const products = await productManager.getProducts(filter, options)
        res.send({
            status: "success",
            message: products
        })
       
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log(error)
    }
})
//registrar producto (TESTED)
router.post("/registerproducts" , async(req,res)=>{
    try {
        const {title, description, code, price, stock, category} = req.body;
        
        if(!title || !description || !code || !price || !stock|| !category){
            return res.status(400).send({
                status: "error",
                message: "Valores incompletos"
            })
        }
        const product = {title, description, code, price, stock, category }
        const result = await productManager.createProducts(product)
    
        res.send({
            status: "success",
            message: result
        })

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log("error")
    }
})
//buscar producto por id(TESTED)
router.get("/:uid", async(req,res)=>{
    const id = req.params.uid;
    const product = await productManager.getProductById(id)
    res.send({
        status: "success",
        message: product
    })
})
//eliminar producto por id(TESTED)
router.delete("/:uid", async(req,res)=>{

    const id = req.params.uid;
    await productManager.deleteProduct(id)
    res.send({
        status: "success",
        message: "El producto se elimino correctamente."
    })
})
//update product
router.put("/:uid" , async(req,res)=>{
    const id = req.params.uid;
    const {title, description, code, price, stock, category} = req.body;
    //verifico que existe el producto
    const productExist = await productsModel.findOne({_id:id})
    //verifico que esten todos los campos correctos
    if(!title || !description || !code || !price || !stock|| !category){
        return res.status(400).send({
            status: "error",
            message: "Valores incompletos"
        })
    }
    let updatedProduct = {
        title,
        description,
        code,
        price,
        stock,
        category
    };

    //corrijo en base de datos
    if (productExist) {
        const result = await productsModel.updateOne({ _id: id }, { $set: updatedProduct });
        res.send({
            status: "success",
            message: result
        });
    } else {
        res.status(404).send({
            status: "error",
            message: "Producto no encontrado"
        });
    }
    res.send({
       status: "success",
        message: result
    })
})



export default router; 



