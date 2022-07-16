const express = require('express')
const axios = require('axios');
const passport = require('passport')
const mongoose = require('mongoose')
const {usersSchema} = require('../config.js');
const transport = require('../libs/nodemailer.js')
const client = require('../libs/twilio.js')
const log4js = require('../libs/log4js.js')
const upload = require('../libs/storage.js')
const fs = require('fs')


const logger = log4js.getLogger();
const loggerError = log4js.getLogger('loggerFileError');

const router = express.Router();

const model = mongoose.model('users', usersSchema)

let isLogin = (req, res, next)=>{
    try {
        if(req.isAuthenticated()){
            next();
        }else{
            res.redirect("/errorlogin");
        }
    } catch (error) {
        loggerError.error(error);
    }
}

let isNotLogin = (req, res, next)=>{
    try {
        if(!req.isAuthenticated()){
            next();
        }else{
            res.redirect("/productos");
        }
    } catch (error) {
        loggerError.error(error);
    }
}

let isCartId = async (req,res,next)=>{
    let user= await model.find({_id:req.user.id})
    if(user[0].cartId==0){
        let cartID = 0
        await axios.post(`http://${req.headers.host}/api/carts/`)
        .then(function (response) { 
            cartID = response.data.cartId
        })
        await model.updateOne({_id:req.user.id}, {$set:{cartId: cartID}})
        next();
    }
    else{
    next() 
    }
}


router.get('/',(req,res)=>{
    logger.info(" Ruta / Metodo Get")
    res.redirect('/login')  
})

router.get('/login',isNotLogin,(req,res)=>{
    logger.info(" Ruta /login Metodo Get") 
    res.render('login',{}) 
})

router.get("/errorregister", isNotLogin, (req,res,next)=>{
    logger.info(" Ruta /errorregister Metodo Get")
    res.render("errorregister",{});
});

router.get("/errorlogin", isNotLogin, (req,res,next)=>{
    logger.info(" Ruta /errorlogin Metodo Get")
    res.render("errorlogin",{});
});

router.get('/registro',isNotLogin,(req,res)=>{
    logger.info(" Ruta /registro Metodo Get") 
    res.render('registro',{}) 
})

router.get('/logout',(req,res)=>{
    logger.info(" Ruta /logout Metodo Get")
    req.session.destroy()
    res.render("logout", { usuario: req.user });
})

router.get('/productos',isLogin,(req,res)=>{
    logger.info(" Ruta /productos Metodo Get")
    axios.get(`http://${req.headers.host}/api/products/`)
    .then(function (response) {
        let products = response.data
        let email = req.user.email
        res.render('home',{products,email})
  })
  .catch(function (error) {
    loggerError.error(error);
  })  
})

router.get('/productos/categoria/:categoria',isLogin,(req,res)=>{
    let {categoria} = req.params; //tomo la categoria
    logger.info(` Ruta /productos/categoria/${categoria} Metodo Get`)
    axios.get(`http://${req.headers.host}/api/products/${categoria}`)
    .then(function (response) {

        res.render('home',{products:response.data, email: req.user.email})
  })
  .catch(function (error) {
    loggerError.error(error);
  })   
})

router.get('/productos/:id',isLogin,isCartId,async(req,res)=>{
    let {id} = req.params; //tomo la categoria
    let user= await model.find({_id:req.user.id})
    logger.info(` Ruta /productos/${id} Metodo Get`)
    axios.get(`http://${req.headers.host}/api/products/${id}`)
    .then(function (response) {
        res.render('product',{product:response.data[0], email: req.user.email,cartId: user[0].cartId})
  })
  .catch(function (error) {
    loggerError.error(error);
  })  
})

router.get('/usuario',isLogin,(req,res)=>{
    logger.info(" Ruta /usuario Metodo Get") 
    res.render('usuario',{email: req.user.email,usuario:req.user}) 
})

router.get('/carrito',isLogin,async(req,res)=>{
    logger.info(` Ruta /carrito Metodo Get`)
    let user= await model.find({_id:req.user.id})
    axios.get(`http://${req.headers.host}/api/carts/${user[0].cartId}/products`)
    .then(function (response) {
        let total = 0
        res.render('carrito',{email: req.user.email,usuario:req.user,items:response.data.products,total: total})
  })
  .catch(function (error) {
    let total = 0
    res.render('carrito',{email: req.user.email,usuario:req.user,items:[],total: total})
  }) 
})


const mailPedido = async (user,items)=>{
    let tabla="<h1>Nuevo Pedido</h1><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Total</th></thead>"
    let total = 0
    for (const elementCart of items){
            tabla +=`<tr><td>${elementCart.id}</td><td>${elementCart.quantity}</td>
            <td>$${elementCart.price}</td><td>$${elementCart.price*elementCart.quantity}</tr></td>`
            total += elementCart.price*elementCart.quantity
        }
    tabla += `<tr><td>Total</td><td></td><td></td><td>$${total}</tr></td>`   
    try{
        const opts = {
            from: "Pedidos Cool Drink",
            to: process.env._EMAIL_PEDIDOS,
            subject: `Nuevo Pedido de ${user.name} <${user.email}>`,
            html: tabla    
        }
        await transport.sendMail(opts)
    } catch (error){
        loggerError.error(error);
    }
}

const waPedido = async(user)=>{
    try{
        await client.messages.create({
            body: `Nuevo Pedido de ${user.name} <${user.email}>`,
            from: process.env._TWILIO_CEL_WA,
            to: `whatsapp:${process.env._ADMIN_CEL}`
        })
    } catch (error){
        loggerError.error(error);
    }
}

const smsPedido = async(user)=>{
    try{
        await client.messages.create({
            body: `Hola ${user.name} Hemos recibido tu orden y la estamos procesando. CoolDrink`,
            from: process.env._TWILIO_CEL,
            to: user.telephone
        })
    } catch (error){
        loggerError.error(error);
    }
}

router.get('/order',isLogin,async(req,res)=>{
    logger.info(` Ruta /order Metodo Get`)
    let user= await model.find({_id:req.user.id})
    let flag = 1
    await axios.get(`http://${req.headers.host}/api/carts/${user[0].cartId}/products`)
    .then(function (response) {
        flag = 1
        let total = 0
        mailPedido(req.user,response.data.products)
        smsPedido(req.user)
        waPedido(req.user)
        res.render('order',{email: req.user.email,usuario:req.user,items:response.data.products,total: total})
  })
  .catch(function (error) {
    flag = 0
    let total = 0
    res.render('order',{email: req.user.email,usuario:req.user,items:[],total: total})
  })
    if(flag){
        await axios.delete(`http://${req.headers.host}/api/carts/${user[0].cartId}`)
        await model.updateOne({_id:req.user.id}, {$set:{cartId: 0}})
    }     
})

router.post("/login", passport.authenticate('login', {failureRedirect:"errorlogin", successRedirect:"/productos"}));

router.post("/registro",upload.single('photo'),(req,res,next)=>{
    req.body.photo = req.file.path + '.' + req.file.mimetype.split('/')[1]
    fs.renameSync(req.file.path,req.body.photo)
    next()
}, passport.authenticate('register', {failureRedirect:"errorregister", successRedirect:"/productos"}));

module.exports = router