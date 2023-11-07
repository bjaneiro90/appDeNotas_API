const sharp = require('sharp');
const {nanoid} = require('nanoid')
const { getConnection } = require('../db/db');
const { showDebug, generateError, createPathIfNotExists } = require('../helpers');
const { newEntrySchema } = require('../validators/notesValidators');
const path = require('path');

const createNote = async (req, res, next) => {
  let connection;
  console.log('createNote, crea una nueva nota');
  try {
    connection = await getConnection();
    await newEntrySchema.validateAsync(req.body);
    
    let imageFileName;

    if(req.files && req.files.image) {
      const uploadsDir = path.join(__dirname, "../uploads")

      await createPathIfNotExists(uploadsDir)

      const image = sharp(req.files.image.data);
      image.resize(1000)

      imageFileName = `${nanoid(24)}.jpg`

      await image.toFile(path.join(uploadsDir, imageFileName))
    }
    const { title, text, image=imageFileName, category_id } = req.body;
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
      'INSERT INTO notes (title, text, image, user_id, category_id, dateCreate) VALUES (?,?,?,?,?, UTC_TIMESTAMP)',

      [title, text, image, id, category_id]
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


