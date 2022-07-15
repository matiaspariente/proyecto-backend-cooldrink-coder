const express = require('express')
const minimist = require('minimist')
const cpus = require('os')
const apiProductosRouter = require('./routes/routeProducts.js')
const apiCartsRouter = require('./routes/routeCarts.js')
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
const upload = require('./libs/storage.js')

let args = process.argv.slice(2);

let options = {
    default:{
        port: process.env.PORT || 8050,
        modo:"fork"
    },
}

let argv = minimist(args,options)

const model = mongoose.model('users', usersSchema)

const app = express()
const PORT = argv.port
//const MODO = argv.modo
//const numCPUs = cpus.cpus().length

const server = app.listen(PORT,()=>console.log(`listening on ${PORT}`))

dotenv.config()

const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

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


passport.use('register', new LocalStrategy({
    passReqToCallback: true
},async(req, username, password, done)=>{
    try {
        let usuario = await model.find({email: username});
        //let usuario = usuarios.find(user => user.username == username);
        if(usuario.length) return done(null,false)
        const user = {
            email: username,
            password: password,
            name: req.body.name,
            address: req.body.address,
            age: parseInt(req.body.age),
            telephone: req.body.telephone,
            cartid: 0,
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
                return done(null, user);
            })
        })
    } catch (error) {
        console.log(error);
    }
}));

passport.serializeUser((user, done)=>{
    done(null, user.email);
});

passport.deserializeUser(async(email, done)=>{
    let usuario = await model.find({email: email});
    done(null, usuario[0]);
});

//app.use(upload.single('photo'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

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

app.use(passport.initialize());
app.use(passport.session());

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