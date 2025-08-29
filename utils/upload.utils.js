// Importar multer para manejar uploads de archivos
import multer from 'multer';
// Importar path para manejar rutas de archivos
import path from 'path';
// Importar función para convertir URL a ruta de archivo
import { fileURLToPath } from 'url';

// Obtener el nombre del archivo actual
const __filename = fileURLToPath(import.meta.url);
// Obtener el directorio del archivo actual
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  // Definir directorio de destino para los archivos subidos
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Los archivos se guardarán en la carpeta 'uploads/'
  },
  // Definir nombre único para los archivos subidos
  filename: (req, file, cb) => {
    // Crear sufijo único usando timestamp y número aleatorio
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Construir nombre del archivo: campo-original-sufijo.extensión
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrar por tipo de archivo (solo permitir imágenes)
const fileFilter = (req, file, cb) => {
  // Verificar si el tipo MIME comienza con 'image/'
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Aceptar archivo
  } else {
    cb(new Error('Solo se permiten imágenes'), false); // Rechazar archivo
  }
};

// Configurar instancia de multer con opciones
const upload = multer({
  storage: storage, // Usar configuración de almacenamiento definida
  fileFilter: fileFilter, // Aplicar filtro de tipos de archivo
  limits: {
    fileSize: 5 * 1024 * 1024 // Establecer límite de tamaño de archivo (5MB)
  }
});

// Exportar la configuración de upload para su uso en otros archivos
export default upload;