const express = require('express')
const minimist = require('minimist')
const apiProductosRouter = require('./routes/routeProducts.js')
const apiCartsRouter = require('./routes/routeCarts.js')
const apiMessagesRouter = require('./routes/routeMessages.js')
const infoRouter = require('./routes/routeInfo.js')
const viewsRouter = require('./routes/routeViews.js')
const dotenv = require('dotenv')
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const expressSession = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const {usersSchema} = require('./config.js');
const bcrypt = require('bcrypt-nodejs')
const transport = require('./libs/nodemailer.js')
const log4js = require('./libs/log4js.js');
const {Server} = require('socket.io')
const { isKeyObject } = require('util/types')

// ------------------------ Loggers-----------------------------------
const loggerWarning = log4js.getLogger('loggerFileWarning');
const loggerError = log4js.getLogger('loggerFileError');

// ------------------------ Schema Mongoose-----------------------------------
const model = mongoose.model('users', usersSchema)

// ------------------------ Argumentos-----------------------------------
let args = process.argv.slice(2);
let options = {
    default:{
        port: process.env.PORT || 8050,
    },
}
let argv = minimist(args,options)
const PORT = argv.port


const app = express()
server = app.listen(PORT,()=>console.log(`listening on ${PORT}`))

dotenv.config()

// ------------------------ EJS Config-----------------------------------
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// ------------------------WEB SOCKET-----------------------------------

const io = new Server(server);

// ------------------------ PASSPORT-----------------------------------

passport.use('login', new LocalStrategy(async(username, password, done)=>{
    try {
        let user = await model.find({email: username});
        //let user = usuarios.find(user => user.username == username);
        if(!user.length)return done(null, false);
        bcrypt.compare(password,user[0].password,(err,sonIguales)=>{
            if(err){
                return done(null, false); 
            }
            if(sonIguales) return done(null, user[0]);
            return done(null, false);
        })
    } catch (error) {
        console.log(error);
    }
}));

const mailRegistro = async (user)=>{
    try{
        const opts = {
            from: "Pedidos Cool Drink",
            to: process.env._EMAIL_PEDIDOS,
            subject: "Nuevo registro",
            html: `<h1>Nuevo Registro</h1>
                 <p>Email: ${user.email}</p>
                 <p>Nombre: ${user.name}</p>
                 <p>Direccion: ${user.address}</p>
                 <p>Edad: ${user.age}</p>
                 <p>Telefono: ${user.telephone}</p>`    
        }
        await transport.sendMail(opts)
    } catch (error){
        loggerError.error(error);
    }
} 


passport.use('register', new LocalStrategy({
    passReqToCallback: true
},async(req, username, password, done)=>{
    try {
        let usuario = await model.find({email: username});
        if(usuario.length) return done(null,false)
        const user = {
            email: username,
            password: password,
            name: req.body.name,
            address: req.body.address,
            age: parseInt(req.body.age),
            telephone: req.body.telephone,
            photo: req.body.photo,
            cartId: 0,
        }
        bcrypt.genSalt(10, (err,salt) => {
            if(err) {
                return done("password ERROR")
            }
            bcrypt.hash(user.password,salt, null, async(err,hash) => {
                if(err){
                    return done("password ERROR")
                }
                user.password = hash;
                await model.insertMany(user)
                await mailRegistro(user)
                return done(null, user);
            })
        })
    } catch (error) {
        loggerError.error(error);
    }
}));

passport.serializeUser((user, done)=>{
    done(null, user.email);
});

passport.deserializeUser(async(email, done)=>{
    let usuario = await model.find({email: email});
    done(null, usuario[0]);
});

const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

//-------Persistencia Sesion--------
app.use(expressSession({ // se persiste SESSIONS en Mongo
    store: MongoStore.create({
        mongoUrl: process.env._MONGO_URL,
        mongoOptions: advancedOptions
    }),
    secret: process.env._SESSION_SECRET,
    resave: true,
    cookie: { maxAge: 1000 *60 * 10 },
    saveUninitialized:true
})) 


//-------Middlewares--------
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname,'/public')))

//-------Routes--------
app.use('/',viewsRouter)
app.use('/info',infoRouter)
app.use('/api/products/',apiProductosRouter)
app.use('/api/carts/',apiCartsRouter)
app.use('/api/messages/',apiMessagesRouter)
app.use('*',(req,res)=>{
    loggerWarning.warn(`Ruta: ${req.originalUrl} No permitida`)
    res.render('rutaErronea',{ruta:req.originalUrl})
})

io.on('connection', socket =>{
    console.log('cliente conectado')
    socket.on('mensaje', data=>{
        console.log("recibo Mensaje Cliente")
        io.sockets.emit('chat',data)
    });
})



module.exports = io;