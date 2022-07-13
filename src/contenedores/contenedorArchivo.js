const fs = require('fs')
const path = require('path')

class ContenedorArchivo{ // contenedor Archivos
    constructor(archivo){
        this.archivo = archivo;
    }

    async  leerArchivo(){
        try{
            if(fs.existsSync(path.normalize(__dirname+this.archivo))){
                let content = JSON.parse(fs.readFileSync(path.normalize(__dirname+this.archivo),'utf-8'));
                return content;
            }
            else{
                return[];
            }
        } catch (error){
            console.log(error);
        }
    }

    async guardarArchivo(content){
        try {
            fs.writeFileSync(path.normalize(__dirname+this.archivo),JSON.stringify(content),'utf-8');
            return true;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ContenedorArchivo