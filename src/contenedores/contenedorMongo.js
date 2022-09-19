const mongoose = require("mongoose");

class ContenedorMongo{ // contenedor 
    constructor(schema,collection){
        this.schema = schema;
        this.collection = collection;
        this.model = mongoose.model(this.collection, this.schema);
    }

    async  leerMongo(){
        try{    
            let content = await this.model.find({});
            if (!content) return [];
            return content;
        }
        catch (error){
            console.log(error);
        }
    }

    async  leerMongoId(id){
        try{    
            let content = await this.model.find({_id:id});
            if (!content) return [];
            return content;
        }
        catch (error){
            console.log(error);
        }
    }

    async  leerMongoCustom(value,key){
        try{    
            let content = await this.model.find({[key]:value});
            if (!content) return [];
            return content;
        }
        catch (error){
            console.log(error);
        }
    }

    async agregarMongo(content){
        try {
            let response = await this.model.insertMany(content);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async modificarMongo(content,id){
        try {
            let response = await this.model.updateMany({_id: id},content);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async borrarMongo(id){
        try {
            let response = await this.model.deleteMany({_id: id});
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async borrarMongoCustom(value,key){
        try {
            let response = await this.model.deleteMany({[key]: value});
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ContenedorMongo