
// Importación de dependencias necesarias
const bcrypt = require('bcrypt'); // Manejo de contraseñas (hash y comparación)
const { createUserSchema, updateUserSchema,loginRateLimiter, validateSchema  } = require('../utils/validators'); // Validación de datos
const db = require('../config/database'); // Configuración de la base de datos
const jwt = require('jsonwebtoken'); // Generación de tokens JWT

// Login de usuario
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Busca al usuario por nombre de usuario
    const [users] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);

    if (users.length === 0) {
      // Respuesta genérica para evitar enumeración de usuarios
      return res.status(401).json({ status: 'error', message: 'Credenciales no válidas' });
    }

    const user = users[0];

    // Comparación de la contraseña ingresada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Credenciales no válidas' });
    }

    // Generación del token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ status: 'success', message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al iniciar sesión', error: error.message });
  }
};

// Creación de un nuevo usuario
const createUser = async (req, res) => {
  try {
    // Validación de entrada
    const { username, email, password } = createUserSchema.parse(req.body);

    // Verifica duplicados antes de crear el usuario
    const [existingUsers] = await db.query('SELECT id FROM usuarios WHERE username = ? OR email = ?', [
      username,
      email,
    ]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ status: 'error', message: 'El usuario o email ya están registrados' });
    }

    // Cifrado de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserción del nuevo usuario
    const [result] = await db.query(
      'INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ status: 'success', message: 'El usuario se registró con éxito', userId: result.insertId });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Error al registrar usuario', error: error.message });
  }
};

// Actualización de usuario
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateFields = updateUserSchema.parse(req.body);
    
    // Si hay una contraseña nueva, cifrarla antes de guardar
    if (updateFields.password) {
      updateFields.password_hash = await bcrypt.hash(updateFields.password, 10);
      delete updateFields.password; // Evita guardar la contraseña sin cifrar
    }

    // Construcción dinámica del query para actualización
    const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateFields), userId];

    const [result] = await db.query(`UPDATE usuarios SET ${setClause} WHERE id = ?`, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', message: 'El usuario se ha actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al actualizar el usuario', error: error.message });
  }
};

// Eliminación de usuario
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Elimina el usuario por ID
    const [result] = await db.query(
      'DELETE FROM usuarios WHERE id = ?',
      [userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar un usuario', error: error.message });
  }
};

// Obtención de usuarios con paginación
const getAllUsers = async (req, res) => {
  try {
    // Obtiene limit y page desde los parámetros de la query, con valores predeterminados
    const { limit = 10, page = 1 } = req.query;
    
    // Asegura que limit y page son números enteros
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calcula el offset basado en el número de página
    const offset = (pageNumber - 1) * limitNumber;

    // Verifica si limit y page son números válidos
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ status: 'error', message: 'Los parámetros limit y page deben ser números enteros' });
    }

    // Recupera los usuarios según la paginación
    const [users] = await db.query(
      'SELECT id, username, email FROM usuarios LIMIT ? OFFSET ?',
      [limitNumber, offset]
    );

    // Enviar la respuesta con los usuarios
    res.json({ status: 'success', data: users });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ status: 'error', message: 'Error al obtener usuarios', error: error.message });
  }
};


// Obtención de un usuario por ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Busca al usuario por ID
    const [users] = await db.query(
      'SELECT id, username, email FROM usuarios WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};


// Exportación de las funciones del controlador
module.exports = {
  login: [loginRateLimiter, login],
  createUser: [validateSchema(createUserSchema), createUser],
  updateUser: [validateSchema(updateUserSchema), updateUser],
  deleteUser,
  getAllUsers,
  getUserById,
};