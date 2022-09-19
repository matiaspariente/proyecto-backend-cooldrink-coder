const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
    const CS = process.env._MONGO_URL
    try {
        await mongoose.connect(CS);
        console.log('MongoDB connected');
    } catch (err) {
        console.log(err.message);
    }
})();

const usersSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    address: {type: String, required: true},
    age: {type: Number, required: true},
    telephone: {type: String, required: true},
    photo: {type: String, required: true},
    cartId:{type: Number, required: true},
});

const productsSchema = new mongoose.Schema({
    category: {type: String, required: true},
    detail: {type: String, required: true},
    pictureUrl: {type: String, required: true},
    price: {type: Number, required: true},
    title: {type: String, required: true},
});

const cartsSchema = new mongoose.Schema({
    cartId: {type: String, required: true},
    date: {type: Date , required: true},
    products: {type: Array, required: true},
});

const ordersSchema = new mongoose.Schema({
    products: {type: Array, required: true},
    order: {type: Number, required: true},
    date: {type: Date , required: true},
    state: {type: String, required: true},
    email: {type: String, required: true},
});

const noOrderSchema = new mongoose.Schema({
    order: {type:Number, required:true}
})

const messageSchema = new mongoose.Schema({
    message: {type: String, required: true},
    date: {type: String , required: true},
    type: {type: String, required: true},
    email: {type: String, required: true},
});

module.exports = {productsSchema,usersSchema,cartsSchema,ordersSchema,noOrderSchema,messageSchema}