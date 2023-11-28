// Importamos la biblioteca Mongoose para interactuar con MongoDB desde Node.js
import mongoose from "mongoose";

// Creamos una función asíncrona llamada conectarDB que manejará la conexión a la base de datos MongoDB
const conectarDB = async () => {
    try {
        // Utilizamos mongoose.connect para establecer la conexión con la base de datos. La cadena de conexión se toma de la variable de entorno MONGO_URI.
        const connection = await mongoose.connect(process.env.MONGO_URI);

        // Si la conexión es exitosa, obtenemos la información sobre la conexión, como el host y el puerto, y lo almacenamos en la variable url.
        const url = `${connection.connection.host}:${connection.connection.host.port}`;

        // Imprimimos un mensaje en la consola indicando que la conexión a MongoDB se realizó con éxito, mostrando la URL de la base de datos.
        console.log(`MongoDb Conectado en: ${url}`);
    } catch (error) {
        // Si hay algún error durante la conexión, capturamos el error, mostramos un mensaje de error en la consola y salimos del proceso con el código 1.
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
};

// Exportamos la función conectarDB para que pueda ser utilizada en otros archivos de la aplicación.
export default conectarDB;
