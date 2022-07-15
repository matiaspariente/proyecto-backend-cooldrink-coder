const ContenedorMongo = require ('../contenedores/contenedorMongo.js');
const {productsSchema} = require ('../config.js');

class Productos extends ContenedorMongo{ 
    constructor() {
        super(productsSchema,'products');
    }
    async guardar (category,detail,pictureUrl,price,title){
            //let id = 0;
            //if(this.productos.length) id=this.productos[this.productos.length-1].id; // Se asigna id 1 si no hay productos
            const productoActual = { //tomo los valores ingresados
                //id:++id,
                category: category,
                detail: detail,
                pictureUrl: pictureUrl,
                price : price,
                title : title   
            }   
            //this.productos.push(productoActual);// los agrego a productos
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
        let content = await this.leerMongoCategory(category)
        return content
    }

    async borrar (id){
        await this.borrarMongo(id)
        //this.productos = this.productos.filter((productos)=>productos.id != id) // elimino el producto con el id recibido
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
        //this.productos.push(productoActual); // lo agrego a productos
        //this.productos.sort((a,b)=>a.id-b.id) // los ordeno por ID
    }
}

module.exports = Productos