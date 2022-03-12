import * as mongoose from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

let rolesUsuario = {
    values: ['ADMIN', 'USUARIO'],
    message: '{VALUE} no es un role valido'
}

export interface IUsuario extends mongoose.Document {
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombre: string;
    role: string;
    usuario: string;
    password: string;
}

let UsuarioSchema = new Schema({
    apellidoPaterno : {
        type: String,
        required: true
    },
    apellidoMaterno: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    role : {
        type: String,
        required: true,
        enum: rolesUsuario
    },
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UsuarioSchema.methods.toJSON = function() {
    let usuario = this;
    let usuarioObject = usuario.toObject();
    delete usuarioObject['password'];
    return usuarioObject;
}

UsuarioSchema.plugin(uniqueValidator, {message: '{PATH} ya fue registrado'});

const Usuario = mongoose.model<IUsuario>("Usuario", UsuarioSchema);
export default Usuario;