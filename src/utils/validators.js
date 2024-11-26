const rateLimiter = require('express-rate-limit'); // Límite de solicitudes
const { z } = require('zod');
// Middleware para validar datos de entrada
const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body); // Valida los datos usando Zod
        next();
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Entrada no válida', error: error.errors });
    }
};

// Configuración del limitador de solicitudes para rutas sensibles
const loginRateLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Máximo de 10 intentos en el periodo
    message: { status: 'error', message: 'Demasiados intentos de inicio de sesión. Intente más tarde.' },
  });

// Esquema de validación para la creación de un usuario
const createUserSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    email: z.string().email('Formato de correo electrónico no válido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

// Esquema de validación para la actualización de un usuario
const updateUserSchema = createUserSchema.partial(); // Todos los campos son opcionales, pero siguen las mismas validaciones

// Esquema de validación para la creación de una película
const createMovieSchema = z.object({
    titulo: z.string().min(1, "Se requiere título"), // Título obligatorio
    titulo_original: z.string().optional(), // Título original es opcional
    director: z.string().min(1, "Se requiere director"), // Director obligatorio
    anio: z.number().int().min(1900, "El año debe ser posterior a 1900").max(new Date().getFullYear(), `Year can't be in the future`), // Año debe ser un número entre 1900 y el año actual
    sinopsis: z.string().min(10, "La sinopsis debe tener al menos 10 caracteres"), // Sinopsis debe tener al menos 10 caracteres
    imagen_url: z.string().url("URL no válida para la imagen"), // URL de la imagen válida
    duracion: z.number().int().positive("La duración debe ser un número positivo"), // Duración positiva en minutos
    pais: z.string().min(1, "Se requiere el país"), // País obligatorio
    trailer_url: z.string().url("URL no válida para el tráiler"), // URL válida para el tráiler
    fecha_estreno: z.string().refine(date => !isNaN(Date.parse(date)), "Fecha de lanzamiento no válida"), // Fecha de estreno válida
    usuario_id: z.number().int().positive("El ID de usuario debe ser un número positivo").min(1, "Se requiere se asocie a un usario") // ID de usuario positivo
  });
  
  // Esquema de validación para la actualización de una película
  const updateMovieSchema = createMovieSchema.partial(); // Todos los campos son opcionales, pero siguen las mismas validaciones

module.exports = {
    validateSchema,
    loginRateLimiter,
    createUserSchema,
    updateUserSchema,
    createMovieSchema,
    updateMovieSchema
};