const { getConnection } = require('../db/db');
const { showDebug, generateError } = require('../helpers');
const { newEntrySchema } = require('../validators/notesValidators');

const createNote = async (req, res, next) => {
  let connection;
  console.log('createNote, crea una nueva nota');
  try {
    connection = await getConnection();
    await newEntrySchema.validateAsync(req.body);
    const { title, text, category_id } = req.body;
    const id = req.auth.id;

    const [category] = await connection.query(
      `SELECT * FROM categories where id= ?;
      `,
      [category_id]
    );

    if (!category.length) {
      throw generateError('esta categoría no exite', 400);
    }

    //Ejecutar la query
    const [row] = await connection.query(
      'INSERT INTO notes (title, text,  user_id, category_id, dateCreate) VALUES (?,?,?,?, UTC_TIMESTAMP)',

      [title, text, id, category_id]
    );
    res.send({
      status: 'ok',
      message: `La nota fue introducida correctamente`,
      data: {
        id: row.insertId,
        title,
      },
    });
  } catch (error) {
    showDebug(error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = createNote;


