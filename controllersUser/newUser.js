const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');
const { newUserSchema } = require('../validators/userValidators');
const bcrypt = require('bcrypt');

const newUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();

    await newUserSchema.validateAsync(req.body);

    const { email, password, name, surname } = req.body;

    // comprobar que no existe un usuario con ese mismo email en la base de datos
    const [existingUser] = await connection.query(
      `
      SELECT id 
      FROM user
      WHERE email=?`,
      [email]
    );

    if (existingUser.length > 0) {
      throw generateError(
        'There is already a user in the database with that email',
        409
      );
    }

    // cifrar la password antes de meterla en la bbdd
    const cryptPassword = await bcrypt.hash(password, 10);

    // meter el nuevo usuario en la base de datos sin activar
    const [dbUser] = await connection.query(
      `
      INSERT INTO user(registrationDate, email, password, name, surname)
      VALUES(UTC_TIMESTAMP,"${email}", "${cryptPassword}", "${name}", "${surname}"
      )
    `,
      [email, cryptPassword, name, surname]
    );

    const user_id = dbUser.insertId;

    res.send({
      status: 'ok',
      message: 'Usuario registrado con id: ' + user_id,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
//esto es un cambio para el push de prueba
