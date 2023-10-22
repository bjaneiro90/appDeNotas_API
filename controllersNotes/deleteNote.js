const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');

const getNoteById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT * FROM notes WHERE id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`La nota con id ${id} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const deteleNoteById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
      DELETE FROM notes WHERE id = ?
    `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notes = await getNoteById(id);

    if (req.auth.id !== notes.user_id) {
      throw generateError(`No tienes permisos para borrar esta nota`, 403);
    }

    await deteleNoteById(id);

    // Devolver resultados
    res.send({
      status: 'ok',
      message: `La nota fue borrada`,
    });
  } catch (error) {
    console.log('Error al borrar la nota:', error);
    next(error);
  }
};

module.exports = deleteNote;
