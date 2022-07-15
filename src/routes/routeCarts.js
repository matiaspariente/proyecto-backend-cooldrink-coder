const express = require("express");
const Carritos = require('../controllers/apiCarts.js');
const log4js = require('../libs/log4js.js');

const logger = log4js.getLogger();
const loggerError = log4js.getLogger('loggerFileError');

const router = express.Router();

const managerCarts = new Carritos(); // se llama a instancia de Carts

router.get('/:cid/products',async (req,res)=>{
    let {cid} = req.params // se toma Cid
    logger.info(`Ruta /api/carts/${cid}/products Metodo Get`)
    let content = await managerCarts.leer(cid)  // se consulta carrito con cid tomado 
    if(content!=undefined) {
        if(content.products.length!=0) res.status(200).send(content); //se informa carrito
        else{
            loggerError.error(`no hay productos cargados en carrito ${cid} no encontrado`)
            res.status(404).send({status:'error',message: 'no hay productos guardados en el carrito'})
        }    
    } 
    else {
        loggerError.error(` Carrito con id ${cid} inexistente`)
        res.status(404).send({status:'error',message: 'carrito inexistente'})
    }        
})

router.post('/', async (req,res)=>{
    logger.info("Ruta /api/carts/ Metodo Post")  
    let id = await managerCarts.crear() //se genera carrito con metodo crear
    res.status(200).send({status:'success',message:`carrito creado con ID: ${id}`,cartId:id}) // se informa
})

router.post('/:cid/products',async (req,res)=>{   
    let {cid} = req.params;
    logger.info(`Ruta /api/carts/${cid}/products Metodo Post`)
    let content = await managerCarts.guardar(cid,req.body.id,req.body.quantity,req.body.price) //se suma elemento al carrito correspondiente con metodo guardar
    res.status(200).send(content) // se informa 
    })

router.delete('/:cid',async (req,res)=>{
    let {cid} = req.params;
    logger.info(`Ruta /api/carts/${cid} Metodo Delete`)
    let content = await managerCarts.leer(cid) // se lee el carrito
    if(content!=undefined) { // si existe se borra
        await managerCarts.borrar(cid) // una vez leido se llama a la funcion borrar
        res.status(200).send({status:'success',message:`Carrito con ID:${cid} borrado`})  //se informa
    } 
    else {
        loggerError.error(`Carrito con id ${cid} inexistente`)
        res.status(404).send({status:'error',message: 'carrito inexistente'})
    }
})

router.delete('/:cid/products/:pid',async (req,res)=>{
    let {cid,pid} = req.params;
    logger.info(`Ruta /api/carts/${cid}/products/${pid} Metodo Delete`)
    let content = await managerCarts.leer(cid) // se lee el carrito
    if(content!=undefined) {
        content=await managerCarts.borrarProducto(cid,pid) // una vez leido se llama a la funcion borrar
        if(content==-1) {
            loggerError.error(` Producto con ${pid} inexistente en carrito con id ${cid}`)
            res.status(404).send({status:'error',message:`Producto con ID:${pid} inexistente en carrito con ID${cid}`})
        }
        else res.status(200).send({status:'success',message:`Producto con ID:${pid} borrado de carrito con ID:${cid}`})  //lo informo
    } 
    else {
        loggerError.error(` Carrito con id ${cid} inexistente`)
        res.status(404).send({status:'error',message: 'carrito inexistente'})
    }
})

module.exports = router;