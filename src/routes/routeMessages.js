const express = require("express");
const Mensajes = require('../controllers/apiMessages.js');
const log4js = require('../libs/log4js.js');
const io = require('../app.js')
const {DateTime} = require('luxon')

const logger = log4js.getLogger();
const loggerError = log4js.getLogger('loggerFileError');

const router = express.Router();

const managerMensajes = new Mensajes("Mensajes");

router.get('/',async(req,res)=>{
    logger.info("Ruta api/messages Metodo Get")
    let content = await managerMensajes.leer() //llamo a la funcion leer los mensajes
    if(content.length!=0) res.send(content); //lo informo
    else{
        loggerError.error('no hay Mensajes cargados')
        res.send({error: 'no hay Mensajes cargados'})
    } 
})

router.get('/:email',async (req,res)=>{
    let {email} = req.params; //tomo el email
    logger.info(`Ruta api/messages/${email} Metodo Get`)
    let content = await managerMensajes.leerEmail(email) 
    if(content!=undefined)  res.send(content); // lo informo
    else {
        loggerError.error(`Mensaje con email ${email} no encontrado`)
        res.send({error: 'Email sin mensajes'})
        }   
})

router.post('/',async(req,res)=>{
    logger.info("Ruta api/messages Metodo Post")
    let dt = DateTime.now() 
    await managerMensajes.guardar(req.user.email,'user',req.body.message,dt.toLocaleString(DateTime.DATETIME_SHORT))
    res.render('chat',{email: req.user.email})
})

module.exports = router;