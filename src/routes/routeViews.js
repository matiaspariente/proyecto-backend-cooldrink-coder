const express = require('express')
const axios = require('axios');

const router = express.Router();


router.get('/',(req,res)=>{
    //logger.info(" Ruta / Metodo Get")
    res.redirect('/productos')  
})

router.get('/productos',(req,res)=>{
    axios.get('http://localhost:8050/api/products/')
    .then(function (response) {
        let products = response.data
        res.render('home',{products})
  })
  .catch(function (error) {
    console.log(error);
  })
    //logger.info(" Ruta / Metodo Get")   
})

router.get('/productos/categoria/:categoria',(req,res)=>{
    let {categoria} = req.params; //tomo la categoria
    axios.get(`http://localhost:8050/api/products/${categoria}`)
    .then(function (response) {
        let products = response.data
        res.render('home',{products})
  })
  .catch(function (error) {
    console.log(error);
  })
    //logger.info(" Ruta / Metodo Get")   
})

module.exports = router