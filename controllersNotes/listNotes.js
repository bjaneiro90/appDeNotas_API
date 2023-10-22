const { getConnection } = require('../db/db');
const { showDebug, generateError } = require('../helpers');

const listNote = async (req, res, next) => {
  let connection;
  try {
    connection = await getConnection();
    const user_id = req.auth.id;
    
    const [results] = await connection.query(
      `SELECT title, id, category_id, user_id
      FROM notes 
      WHERE user_id=? ORDER BY dateCreate DESC`,
      [user_id]
    );

    if (results.lenght === 0) {
      throw generateError(`El usuario ${user_id} no tiene notas.`);
    }
    showDebug(results);
    res.send({
      status: 'ok',
      data: results,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listNote;
