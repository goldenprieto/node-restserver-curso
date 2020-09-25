const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values      :   ['ADMIN_ROLE','USER_ROLE'],
    message     :   '{VALUE} no role Valido'

}



let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [ true , 'El nombre es necesario']
    },
    email:{
        type: String,
        unique: true,
        required: [ true, 'El E-Mail es necesario']
    },
    password:{
        type: String,
        required: [ true, 'El password es necesario']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        required: true,
        enum: rolesValidos

    },
    estado:{
        type: Boolean,
        default: true

    },
    google:{
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin( uniqueValidator,{message:'{PATH} debe ser Único validador'});
module.exports=mongoose.model('Usuario',usuarioSchema);