const jsonwebtoken = require('jsonwebtoken');

const { getConnection } = require('../db/db');
const { showDebug, generateError } = require('../helpers');

const getNote = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();
    const { id } = req.params;
    console.log(id);
    /*     const user_id = req.auth.id; */

    const [result] = await connection.query(
      `SELECT n.user_id, n.id, title, text, image, dateCreate,
      category_id, private, c.category FROM notes n LEFT JOIN categories c on n.category_id = c.id WHERE n.id= ?;
      `,
      [id]
    );

    if (result.length === 0) {
      throw generateError('esta nota no exite', 400);
    }

    let [nota] = result;

    let loggedUser;

    const { authorization } = req.headers;

    if (authorization) {
      let tokenInfo;
      try {
        tokenInfo = jsonwebtoken.verify(authorization, process.env.SECRET);
      } catch (error) {
        const tokenError = new Error('El token no es válido');
        tokenError.httpStatus = 401;
        throw tokenError;
      }

      loggedUser = tokenInfo.id;
    }
    console.log(nota.private);

    if (loggedUser !== nota.user_id && nota.private) {
      throw generateError('No tienes permisos para ver esta nota', 401);
    }

    res.send({
      status: 'ok',
      data: result,
    });
  } catch (error) {
    showDebug(error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getNote;
