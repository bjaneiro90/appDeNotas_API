const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');

const publicNote = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();

    // Sacamos los datos
    const { private } = req.body;
    const { id } = req.params;

    //Seleccionar datos actuales de la nota
    const [result] = await connection.query(
      `
    SELECT *
    FROM notes
    WHERE id=?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`La nota que quieres modificar no existe`, 404);
    }
    if (result[0].user_id !== req.auth.id) {
      throw generateError(
        'No tienes permisos para cambiar la visibilidad de esta nota',
        403
      );
    }
    connection = await getConnection();

    // Ejecutar la query de hacer publica la nota
    await connection.query(
      `
    UPDATE notes SET private=? 
    WHERE id=?
    `,
      [private, id]
    );
    // Devolver resultados
    if (private) {
      res.send({
        status: 'ok',
        message: 'Nota hecha privada',
      });
    } else {
      res.send({
        status: 'ok',
        message: 'Nota hecha pública',
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = publicNote;
