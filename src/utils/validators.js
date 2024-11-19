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

const createUserSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    email: z.string().email('Formato de correo electrónico no válido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

const updateUserSchema = z.object({
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
});

module.exports = {
    validateSchema,
    loginRateLimiter,
    createUserSchema,
    updateUserSchema
};