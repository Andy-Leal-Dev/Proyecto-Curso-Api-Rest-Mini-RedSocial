// Importar mongoose para conexión con MongoDB
import mongoose from 'mongoose';

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    // Conectar a MongoDB usando URI de variable de entorno o local por defecto
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini_red_social', );
    console.log('Conectado a MongoDB'); // Log de éxito
  } catch (error) {
    console.error('Error conectando a MongoDB:', error); // Log de error
    process.exit(1); // Salir del proceso con código de error
  }
};

// Exportar función de conexión a la base de datos
export default connectDB;