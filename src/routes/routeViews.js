const express = require('express')
const axios = require('axios');
const passport = require('passport')


const router = express.Router();

let isLogin = (req, res, next)=>{
    try {
        if(req.isAuthenticated()){
            next();
        }else{
            res.redirect("/errorlogin");
        }
    } catch (error) {
        console.log(error);
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
        console.log(error);
    }
}


router.get('/',(req,res)=>{
    //logger.info(" Ruta / Metodo Get")
    res.redirect('/login')  
})

router.get('/login',isNotLogin,(req,res)=>{
    //logger.info(" Ruta /login Metodo Get") 
    res.render('login',{}) 
})

router.get("/errorregister", isNotLogin, (req,res,next)=>{
    //logger.info(" Ruta /errorregister Metodo Get")
    res.render("errorregister",{});
});

router.get("/errorlogin", isNotLogin, (req,res,next)=>{
    //logger.info(" Ruta /errorlogin Metodo Get")
    res.render("errorlogin",{});
});

router.get('/registro',isNotLogin,(req,res)=>{
    //logger.info(" Ruta /registro Metodo Get") 
    res.render('registro',{}) 
})

router.get('/logout',(req,res)=>{
    //logger.info(" Ruta /logout Metodo Get")
    req.session.destroy()
    res.render("logout", { usuario: req.user });
})

router.get('/productos',isLogin,(req,res)=>{
    axios.get('http://localhost:8050/api/products/')
    .then(function (response) {
        let products = response.data
        let email = req.user.email
        res.render('home',{products,email})
  })
  .catch(function (error) {
    console.log(error);
  })
    //logger.info(" Ruta / Metodo Get")   
})

router.get('/productos/categoria/:categoria',isLogin,(req,res)=>{
    let {categoria} = req.params; //tomo la categoria
    axios.get(`http://localhost:8050/api/products/${categoria}`)
    .then(function (response) {

        res.render('home',{products:response.data, email: req.user.email})
  })
  .catch(function (error) {
    console.log(error);
  })
    //logger.info(" Ruta / Metodo Get")   
})

router.get('/productos/:id',isLogin,(req,res)=>{
    let {id} = req.params; //tomo la categoria
    axios.get(`http://localhost:8050/api/products/${id}`)
    .then(function (response) {
        console.log(response.data)
        res.render('product',{product:response.data[0], email: req.user.email})
  })
  .catch(function (error) {
    console.log(error);
  })
    //logger.info(" Ruta / Metodo Get")   
})

router.get('/usuario',isLogin,(req,res)=>{
    //logger.info(" Ruta /registro Metodo Get") 
    res.render('usuario',{email: req.user.email,usuario:req.user}) 
})

router.get('/carrito',isLogin,(req,res)=>{
    //logger.info(" Ruta /registro Metodo Get") 
    res.render('carrito',{email: req.user.email,usuario:req.user,items:req.user}) 
})

router.post("/login", passport.authenticate('login', {failureRedirect:"errorlogin", successRedirect:"/productos"}));

router.post("/registro", passport.authenticate('register', {failureRedirect:"errorregister", successRedirect:"/productos"}));


module.exports = router