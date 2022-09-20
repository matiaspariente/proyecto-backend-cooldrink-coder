const ContenedorMongo = require ('../contenedores/contenedorMongo.js');
const {productsSchema} = require ('../config.js');

class Productos extends ContenedorMongo{ 
    constructor() {
        super(productsSchema,'products'); // se carga la informacion de productos desde Mongo
    }
    async guardar (category,detail,pictureUrl,price,title){
            const productoActual = { //tomo los valores ingresados
                category: category,
                detail: detail,
                pictureUrl: pictureUrl,
                price : price,
                title : title   
            }   
            let id = await this.agregarMongo(productoActual);// los agrego a productos
            return id //retorno id
    }

    async leer (){
        let productos = await this.leerMongo()
        return productos //retorno Json de productos
    }

    async leerId(pid) {
        let content = await this.leerMongoId(pid) 
        return content
    }

    async leerCategory(category) {
        let content = await this.leerMongoCustom(category,'category')
        return content
    }

    async borrar (id){
        await this.borrarMongo(id)
    }

    async modificar(category,detail,pictureUrl,price,title,id){
        const productoActual = { // guardo el producto con los nuevos valores
            category: category,
            detail: detail,
            pictureUrl: pictureUrl,
            price : price,
            title : title 
        }
        await this.modificarMongo(productoActual,id);
    }
}

module.exports = Productos