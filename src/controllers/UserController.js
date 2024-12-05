// Importación de dependencias y modelo
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginRateLimiter, validateSchema, createUserSchema, updateUserSchema } = require('../utils/validators');
const UserModel = require('../models/UserModel');

// Login de usuario
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await UserModel.findUserByUsername(username);

    if (users.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Credenciales no válidas' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Credenciales no válidas' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ status: 'success', message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al iniciar sesión', error: error.message });
  }
};

// Creación de un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { username, email, password } = createUserSchema.parse(req.body);
    const existingUsers = await UserModel.checkDuplicateUserOrEmail(username, email);

    if (existingUsers.length > 0) {
      return res.status(400).json({ status: 'error', message: 'El usuario o email ya están registrados' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await UserModel.insertUser(username, email, hashedPassword);

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

    if (updateFields.password) {
      updateFields.password_hash = await bcrypt.hash(updateFields.password, 10);
      delete updateFields.password;
    }

    const result = await UserModel.updateUserById(userId, updateFields);

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
    const result = await UserModel.deleteUserById(userId);

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
    const { limit = 10, page = 1 } = req.body;
    const offset = ((parseInt(page, 10) - 1) * parseInt(limit, 10));
    const users = await UserModel.findUsersWithPagination(limit, offset);
    res.json({status:'success', message: 'Usuarios obtenidos con exito', data: users});
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener usuarios', error: error.message });
  }
};

// Obtención de usuario por ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await UserModel.findUserById(userId);

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

module.exports = {
  login: [loginRateLimiter, login],
  createUser: [validateSchema(createUserSchema), createUser],
  updateUser: [validateSchema(updateUserSchema), updateUser],
  deleteUser,
  getAllUsers,
  getUserById,
};
