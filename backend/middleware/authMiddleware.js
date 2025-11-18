const jwt = require('jsonwebtoken');

// Este middleware verifica si el token es válido
const verifyToken = (req, res, next) => {
  // 'Bearer TOKEN123...'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Obtiene solo el token

  if (token == null) return res.sendStatus(401); // No hay token

  jwt.verify(token, process.env.JWT_SECRET || 'miclavesecreta123', (err, user) => {
    if (err) return res.sendStatus(403); // Token inválido
    
    // Si es válido, guardamos los datos del usuario en la request
    req.user = user; 
    next(); // Pasa al siguiente middleware o al endpoint
  });
};

// Este middleware verifica si el usuario es Admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Acceso denegado. Se requiere rol de administrador.');
  }
  next();
};

module.exports = { verifyToken, isAdmin };