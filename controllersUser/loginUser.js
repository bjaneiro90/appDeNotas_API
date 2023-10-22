const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function loginUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { email, password } = req.body;

    // Seleccionar el usuario de la base de datos y comprobar que las passwords coinciden
    const [dbUser] = await connection.query(
      `SELECT *
      FROM user
      WHERE email=?`,
      [email]
    );
   

    if (dbUser.length === 0) {
      throw generateError(
        'No hay ningún usuario registrado con ese email o la contraseña es incorrecta',
        401
      );
    }
    // tengo que comparar la password que me pasan (variable password), con la que tengo
    // almacenada en la bbdd (user.password)
    // Si la función compare me da `true` significa que la comparación es correcta
    const passwordsEqual = await bcrypt.compare(password, dbUser[0].password);

    if (!passwordsEqual) {
      res.status(403).send();
      return;
    }

    // Generar token con información del usuario
    const tokenInfo = {
      id: dbUser[0].id,
    };
   
    const token = jwt.sign(tokenInfo, process.env.SECRET, {
      expiresIn: '30d',
    });

    // Devolver el token
    res.send({
      status: 'ok',
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = loginUser;
