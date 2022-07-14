const mongoose = require("mongoose");

class ContenedorMongo{ // contenedor Archivos
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

    async  leerMongoCategory(category){
        try{    
            let content = await this.model.find({category:category});
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


}

module.exports = ContenedorMongo