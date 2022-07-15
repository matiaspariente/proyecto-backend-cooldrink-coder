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
    cartid:{type: Number, required: true},
});

const productsSchema = new mongoose.Schema({
    category: {type: String, required: true},
    detail: {type: String, required: true},
    pictureUrl: {type: String, required: true},
    price: {type: Number, required: true},
    title: {type: String, required: true},
});

module.exports = {productsSchema,usersSchema}