require('dotenv').config();
const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    // Conseguir conexión a la base de datos
    connection = await getConnection();

    // Borrar las tablas si existen

    console.log('Borrando tablas');

    await connection.query('DROP TABLE IF EXISTS notes');
    await connection.query('DROP TABLE IF EXISTS categories');
    await connection.query('DROP TABLE IF EXISTS user');

    // Crear las tablas de nuevo
    console.log('Creando tablas');

    await connection.query(`
        CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            registrationDate DATETIME,
            email VARCHAR(100) UNIQUE NOT NULL,
            password varchar (150) NOT NULL,
            name varchar (100), 
            surname varchar (150)
            )
            `);

    await connection.query(`
            CREATE TABLE categories (
          id INTEGER PRIMARY KEY AUTO_INCREMENT,
          category varchar (150)
          )
          `);

    await connection.query(`
          CREATE TABLE notes (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            dateCreate DATETIME,
            title varchar (150),
            text text(50000),
            private BOOLEAN default true, 
            user_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) references user (id),
            FOREIGN KEY (category_id) references categories (id)
            )
            `);

    await connection.query(
      `
                      INSERT INTO categories (category)
                      VALUES ("Tecnología"), ("Actualidad"), ("Gastronomía"), ("Viajes"), ("Animales"), ("Música"), ("Cine"), ("Internacional"), ("Cultura"), ("Recordatorios"), ("Varios")
                      `
    );
  } catch (error) {
    console.error(error);
  } finally {
    console.log('Todo hecho, liberando conexión');
    if (connection) connection.release();
    process.exit();
  }
}

main();
