const jwt = require('jsonwebtoken');

const authenticateToken  = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Sin token, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agrega datos del usuario al objeto de solicitud
    next();
  } catch (err) {
    res.status(401).json({ message: 'El token no es válido' });
  }
};

module.exports = {
  authenticateToken
} ;