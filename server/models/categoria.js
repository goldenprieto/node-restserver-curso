

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre:{
        type        :   String,
        unique      :   true,
        required    :   [ true , 'El nombre es necesario']
    },
    descripcion:{
        type: String,
        
    },
    estado:{
        type        : Boolean,
        default     : true

    }
    
    
});
categoriaSchema.methods.toJSON = function(){
    let user= this;
    let userObject = user.toObject();
    delete userObject._id;

    return userObject;
}


categoriaSchema.plugin( uniqueValidator,{message:'{PATH} No debe repetir en las CATEGORIAS'});
module.exports=mongoose.model('Categoria',categoriaSchema);