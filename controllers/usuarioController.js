// Importar el modelo de Usuario y funciones de ayuda
import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"

// Función para registrar un nuevo usuario
const registrar = async (req, res) => {
    // Evitar registros duplicados verificando el email
    const { email } = req.body
    const existeUsuario = await Usuario.findOne({ email })

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message})
    }

    try {
        // Crear un nuevo usuario con los datos proporcionados
        const usuario = new Usuario(req.body) 

        // Generar un token único para el usuario
        usuario.token = generarId()

        // Almacenar el usuario en la base de datos
        const usuarioAlmacenado = await usuario.save()
       
        res.json({usuarioAlmacenado})
    } catch (error) {
        console.log(error)
    }
}

// Función para autenticar a un usuario
const autenticar = async (req, res) => {
    const { email, password} = req.body

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email })
    
    if (!usuario) {
        const error = new Error("El Usuario no existe")
        return res.status(404).json({ msg: error.message })
    }

    // Comprobar si el usuario está confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({ msg: error.message })
    }

    // Comprobar si la contraseña es válida
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })        
    } else {
        const error = new Error("El password es incorrecto")
        return res.status(403).json({ msg: error.message })
    }
}

// Función para confirmar la cuenta de un usuario
const confirmar = async  (req, res) => { 
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({token})

    if (!usuarioConfirmar) {
        const error = new Error("Token no válido")
        return res.status(403).json({ msg: error.message })
    }

    try {
        // Confirmar la cuenta y limpiar el token
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save()

        res.json({ msg: 'Usuario confirmado correctamente' })

    } catch (error) {
        console.log(error)
    }
}

// Función para solicitar un restablecimiento de contraseña
const olvidePassword = async (req, res) => {
    const { email } = req.body

    const usuario = await Usuario.findOne({ email })
    
    if (!usuario) {
        const error = new Error("El Usuario no existe")
        return res.status(404).json({ msg: error.message })
    }
    try {
        // Generar un nuevo token y guardarlo en el usuario
        usuario.token = generarId()
        await usuario.save()

        res.json({ msg: "Hemos enviado un email con las instrucciones" })
    } catch (error) {
        console.log(error)
    }
}

// Función para comprobar la validez de un token
const comprobarToken = async (req, res) => {
    const { token } = req.params

    const tokenValido = await Usuario.findOne({ token })

    if (tokenValido) {
        res.json({ msg: "Token válido y el Usuario existe" })
    } else {
        const error = new Error('Token no válido')
        return res.status(404).json({ msg: error.message })
    }
}

// Función para establecer una nueva contraseña
const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const usuario = await Usuario.findOne({ token })

    if (usuario) {
        // Establecer la nueva contraseña y limpiar el token
        usuario.password = password  
        usuario.token = ''       
        try {
            await usuario.save()
            res.json({ msg: "Password modificado correctamente" })    
        } catch (error) {
            console.log(error)
        }   
    } else {
        const error = new Error('Token no válido')
        return res.status(404).json({ msg: error.message })
    }
}

// Función para obtener el perfil de un usuario autenticado
const perfil = async (req, res) => {
    const { usuario } = req

    res.json(usuario)
}

// Exportar todas las funciones para su uso en otros archivos
export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
} 
