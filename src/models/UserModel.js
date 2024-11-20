// Importación de la conexión a la base de datos
const db = require('../config/database');

// Busca un usuario por nombre de usuario
const findUserByUsername = async (username) => {
  const [users] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
  return users;
};

// Busca un usuario por ID
const findUserById = async (userId) => {
  const [users] = await db.query('SELECT id, username, email FROM usuarios WHERE id = ?', [userId]);
  return users;
};

// Busca duplicados de usuario o email
const checkDuplicateUserOrEmail = async (username, email) => {
  const [existingUsers] = await db.query('SELECT id FROM usuarios WHERE username = ? OR email = ?', [username, email]);
  return existingUsers;
};

// Crea un nuevo usuario
const insertUser = async (username, email, hashedPassword) => {
  const [result] = await db.query(
    'INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
  return result;
};

// Actualiza un usuario por ID
const updateUserById = async (userId, updateFields) => {
  const setClause = Object.keys(updateFields).map((key) => `${key} = ?`).join(', ');
  const values = [...Object.values(updateFields), userId];
  const [result] = await db.query(`UPDATE usuarios SET ${setClause} WHERE id = ?`, values);
  return result;
};

// Elimina un usuario por ID
const deleteUserById = async (userId) => {
  const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [userId]);
  return result;
};

// Obtiene usuarios con paginación
const findUsersWithPagination = async (limit, offset) => {
  const [users] = await db.query(
    'SELECT id, username, email FROM usuarios LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return users;
};

module.exports = {
  findUserByUsername,
  findUserById,
  checkDuplicateUserOrEmail,
  insertUser,
  updateUserById,
  deleteUserById,
  findUsersWithPagination,
};
