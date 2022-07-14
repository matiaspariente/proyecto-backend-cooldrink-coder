const express = require("express");
const Productos = require('../controllers/apiProducts.js');
//import io from "../app.js";
//import log4js from '../utils/loggers/log4js.js';

//const logger = log4js.getLogger();

//const loggerError = log4js.getLogger('loggerFileError');

const router = express.Router();

const categories = ['Cerveza', 'BebidaBlanca','Whisky','Vino','Champagne','Aperitivo']

const managerProductos = new Productos("Productos");

router.get('/',async(req,res)=>{
    //logger.info(" Ruta /api/productos Metodo Get")
    let content = await managerProductos.leer() //llamo a la funcion leer los productos
    if(content.length!=0) res.send(content); //lo informo
    else{
        //loggerError.error('no hay productos cargados')
        res.send({error: 'no hay productos cargados'})
    } 
})

router.get('/:id',async (req,res)=>{
    //logger.info(" Ruta /api/productos/:id Metodo Get")
    let {id} = req.params; //tomo el id
    
    if (categories.includes(id)) {
        let content = await managerProductos.leerCategory(id) 
        if(content!=undefined)  res.send(content); // lo informo
        else {
            //loggerError.error(`producto con id ${id} no encontrado`)
            res.send({error: 'Categoria sin productos'})
        }
    }
    else{
        let content = await managerProductos.leerId(id) 
        if(content!=undefined)  res.send(content); // lo informo
        else {
            //loggerError.error(`producto con id ${id} no encontrado`)
            res.send({error: 'Producto No encontrado'})
        }
    }    

})

router.post('/',async(req,res)=>{
    //logger.info(" Ruta /api/productos Metodo Post")
    let id = await managerProductos.guardar(req.body.category,req.body.detail,req.body.pictureUrl,req.body.price,req.body.title) //llamo a la funcion guardar elemento
    let content = await managerProductos.leerId(id)
    res.send(content) // lo informo
    //io.emit('log',managerProductos.leer())// envio mensaje al servidor para que se modifique la tabla de productos
})

router.delete('/:id',async(req,res)=>{
    //logger.info(" Ruta /api/productos/:id Metodo Delete")
    let {id} = req.params;
    let content = await managerProductos.leerId() 
    if(content!=undefined) {
        await managerProductos.borrar(id) // una vez leido llamo a la funcion borrar
        res.send({status:'success',message:`Producto con ID:${id} borrado`})  //lo informo
    } 
    else {
        //loggerError.error(`producto con id ${id} no encontrado`)
        res.send({error: 'producto no encontrado'})
    }
    //io.emit('log',managerProductos.leer()) // envio mensaje al servidor para que se modifique la tabla de productos
})

router.put('/:id',async (req,res)=>{
    //logger.info(" Ruta /api/productos/:id Metodo Put")
    let {id} = req.params;
    let content = await managerProductos.leerId()
    if(content!=undefined) {
        await managerProductos.modificar(req.body.category,req.body.detail,req.body.pictureUrl,req.body.price,req.body.title,id) // llamo a la funcion modificar
        res.send({status:'success',message:`Producto con ID:${id} modificado`}) // lo informo
    } 
    else {
        //loggerError.error(`producto con id ${id} no encontrado`)
        res.send({error: 'producto no encontrado'})
    }
    //io.emit('log',managerProductos.leer())// envio mensaje al servidor para que se modifique la tabla de productos
})

module.exports = router;