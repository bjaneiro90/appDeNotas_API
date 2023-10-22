const jsonwebtoken = require('jsonwebtoken');
const { getConnection } = require('../db/db');

async function isUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    // Extraer token de los headers de la petición
    const { authorization } = req.headers;

    if (!authorization) {
      const error = new Error('Falta la cabecera de autorización');
      error.httpStatus = 401;
      throw error;
    }

    // Comprobar que el token es válido
    // y decodificar el contenido del token
    let tokenInfo;
    try {
      tokenInfo = jsonwebtoken.verify(authorization, process.env.SECRET);
    } catch (error) {
      const tokenError = new Error('El token no es válido');
      tokenError.httpStatus = 401;
      throw tokenError;
    }

    // Meter ese contenido en el objeto de petición para futuro uso
    req.auth = {}
    req.auth = tokenInfo;
    console.log('hola1', req.auth);

    // Pasar al siguiente middleware
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = isUser;
