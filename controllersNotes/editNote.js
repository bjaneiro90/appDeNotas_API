const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');
const { editEntrySchema } = require('../validators/notesValidators');

const editNote = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();

    await editEntrySchema.validateAsync(req.body);

    // Sacamos los datos
    let { title, text, category_id } = req.body;

    const { id } = req.params;
    const user_id = req.auth.id;
    console.log(id);
    //Seleccionar datos actuales de la categoria

    const [[result]] = await connection.query(
      `
    SELECT id, title, text, category_id, user_id
    FROM notes
    WHERE id=?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`La nota no existe en la base de datos`, 404);
    }

    if (user_id !== result.user_id) {
      throw generateError('No tienes permisos para modificar esta nota', 401);
    }

    if (category_id) {
      const [categoryRes] = await connection.query(
        `
    SELECT *
    FROM categories
    WHERE id=?
    `,
        [category_id]
      );
      if (!categoryRes[0]) {
        throw generateError('Esta categoria no existe', 403);
      }
    }

    // Ejecutar la query de edición de la categoria
    await connection.query(
      `
      UPDATE notes SET title=?, text=?, category_id=?
      WHERE id=?`,
      [
        title || result.title,
        text || result.text,
        category_id || result.category_id,
        id,
      ]
    );

    // Devolver resultados
    res.send({
      status: 'ok',
      message: 'Nota editada',
      data: {
        id,
        title,
        text,
        category_id,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editNote;
