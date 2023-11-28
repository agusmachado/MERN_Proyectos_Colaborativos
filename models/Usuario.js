// Importamos la biblioteca Mongoose para definir y trabajar con modelos MongoDB en Node.js
import mongoose from "mongoose";
import bcrypt from "bcrypt"

// Definimos el esquema (schema) para el modelo de usuario utilizando la función Schema de Mongoose
const usuarioSchema = mongoose.Schema({
    // Campo 'nombre' de tipo String, obligatorio, y se eliminan espacios en blanco alrededor
    nombre:{
        type:String,
        required: true,
        trim: true
    },
    // Campo 'password' de tipo String, obligatorio, y se eliminan espacios en blanco alrededor
    password:{
        type:String,
        required: true,
        trim: true
    },
    // Campo 'email' de tipo String, obligatorio, único y se eliminan espacios en blanco alrededor
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    // Campo 'token' de tipo String, opcional
    token:{
        type: String
    },
    // Campo 'confirmado' de tipo Boolean, con valor predeterminado false
    confirmado:{
        type: Boolean,
        default: false
    }
},
    {
        // Opciones adicionales del esquema: añade marcas de tiempo (timestamps) para createdAt y updatedAt
        timestamps: true
    });

usuarioSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
       next() 
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

// Creamos un modelo llamado 'Usuario' basado en el esquema definido anteriormente
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Exportamos el modelo 'Usuario' para que pueda ser utilizado en otros archivos de la aplicación
export default Usuario;
