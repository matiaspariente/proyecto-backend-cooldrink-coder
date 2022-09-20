const ContenedorMongo = require ('../contenedores/contenedorMongo.js');
const {messageSchema} = require ('../config.js');

class Mensajes extends ContenedorMongo{ 
    constructor() {
        super(messageSchema,'messages'); // se carga la informacion de mensajes desde Mongo
    }
    async guardar (email,type,message,date){
            const mensajeActual = { //tomo los valores ingresados
                email: email,
                type: type,
                message: message,
                date : date,
            }   
            let id = await this.agregarMongo(mensajeActual);// los agrego a mensajes
            return id 
    }

    async leer (){
        let mensajes = await this.leerMongo()
        return mensajes //retorno Json de productos
    }

    async leerEmail(email) {
        let content = await this.leerMongoCustom(email,'email')
        return content
    }
}

module.exports = Mensajes