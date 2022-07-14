const express = require('express')
const minimist = require('minimist')
const cpus = require('os')
const apiProductosRouter = require('./routes/routeProducts.js')
const apiCartsRouter = require('./routes/routeCarts.js')
const viewsRouter = require('./routes/routeViews.js')
const dotenv = require('dotenv')
const path = require('path')

let args = process.argv.slice(2);

let options = {
    default:{
        port: process.env.PORT || 8050,
        modo:"fork"
    },
}

let argv = minimist(args,options)

const app = express()
const PORT = argv.port
//const MODO = argv.modo
//const numCPUs = cpus.cpus().length

const server = app.listen(PORT,()=>console.log(`listening on ${PORT}`))

dotenv.config()

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname,'/public')))
app.use('/',viewsRouter)
//app.use('/info',infoRouter)
app.use('/api/products/',apiProductosRouter)
app.use('/api/carts/',apiCartsRouter)
//app.use('/api/productos-test/',apiProductosTestRouter)
//app.use('/api/random',apiRandomRouter)
app.use('*',(req,res)=>{
    //logger.warn(`Ruta: ${req.originalUrl} No permitida`)
    res.send("Ruta No permitida")
})