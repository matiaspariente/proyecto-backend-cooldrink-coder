const ContenedorMongo = require('../contenedores/contenedorMongo.js');
const {cartsSchema} = require ('../config.js');

class Carritos extends ContenedorMongo { 
    constructor() {
        super(cartsSchema,'carts');; // se carga la informacion de carritos desde filesystem
    }

    async crear(){
        let cartId = 0;
        let carts = await this.leerMongo()
        if(carts.length) cartId=carts[carts.length-1].cartId; // Se asigna id 1 si no hay carritos
        const cartActual = { //se toma los valores ingresados
            cartId:++cartId,
            date: new Date(),
            products: [],
        }
        await this.agregarMongo(cartActual)
        return cartId //se retorna id
    }

    async guardar(cid,pid,quantity,price){
            let carts = await this.leerMongoCustom(cid,'cartId')
            //let content=carts.find(carts=>carts.cartId == cid) // se agrega producto con pid al carrito cid
            let cart = carts[0]
            if(cart==undefined)  return {status:'error', message: 'carrito inexistente'} // si da error es por que no hay carrito
            //let indexCart = carts.findIndex(carts=>carts.id == cid)
            let content = cart.products
            if(content.length!=0){
                let indexProduct = content.findIndex(content=>content.id == pid)
                if(indexProduct!=-1){
                    cart.products[indexProduct].quantity+=quantity // si ya existia el producto en el carrito se suma cantidad
                    await this.modificarMongo(cart,cart.id);
                    return {status:'success', message: `se agrego producto con ID:${pid} en carrito con ID:${cid}`}
                }
            } 
            content={
                id : pid,
                quantity: quantity,
                price : price, 
            }
            cart.products.push(content) // se guarda en carrito el producto correspondiente
            await this.modificarMongo(cart,cart.id);
            return {status:'success', message:`se agrego producto con ID:${pid} en carrito con ID:${cid}`}  
    }

    async leer(id) {
        let content = await this.leerMongoCustom(id,'cartId')
        return content[0] // se retorna Json del carrito pedido
    }

    async leerTodo (){
        let content = await this.leerMongo()
        return content //se retorna Json del carrito
    }

    async borrar(id){
        await this.borrarMongoCustom(id,'cartId')
    }

    async borrarProducto(cid,pid){
        let cart = await this.leerMongoCustom(cid,'cartId')
        let content = cart.products.findIndex(products=>products.id == pid) 
        cart.products= cart.products.filter(products=>products.id != pid)
        await this.modificarMongo(cart,cart.id);
        return content
    }
}

module.exports = Carritos