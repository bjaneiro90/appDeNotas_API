const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');

const getUserById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT id, email, name, surname, registrationDate FROM user WHERE id = ?
    `,
      [id]
    );
   

    if (result.length === 0) {
      throw generateError('No hay ningún usuario con esa id', 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getUserController = async (req, res, next) => {
  try {
    const id = req.auth.id;

    const user = await getUserById(id);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserController;
