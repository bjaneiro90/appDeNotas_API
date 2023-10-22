require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const app = express();
const port = process.env.PORT;

// Notes controllers
const listNote = require('./controllersNotes/listNotes');
const getNote = require('./controllersNotes/getNote');
const createNote = require('./controllersNotes/createNote');
const editNote = require('./controllersNotes/editNote');
const deleteNote = require('./controllersNotes/deleteNote');
const publicNote = require('./controllersNotes/publicNote');

// Category controllers
const getCategory = require('./controllersCategory/getCategory');

// User controllers
const newUser = require('./controllersUser/newUser');
const loginUser = require('./controllersUser/loginUser');

const isUser = require('./middleware/isUser');
const getUserController = require('./controllersUser/getUser');

// Middlewares iniciales

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('uploads'));

/*
  ENDPOINTS DE NOTAS
*/

// Listar todas las notas del usuario - solo titulos
// GET - /notes
// Privado
app.get('/notes', isUser, listNote);

// Mostrar una sola nota
// GET - /notes/:id
// Privado
app.get('/notes/:id', getNote);

// Crear una nueva Nota
// POST - /notes
// Sólo usuarios registrados
app.post('/notes', isUser, createNote);

// Editar una nota
// PUT - /notes/:id
// Sólo usuario que creó esta nota
app.put('/notes/:id', isUser, editNote);

// marca una nota como pública
// POST - /note/public/:id
// Sólo usuarios registrados
app.put('/notes/public/:id', isUser, publicNote);

// Borrar una nota
// DELETE - /notes/:id
// Sólo usuario que creó esta nota
app.delete('/notes/:id', isUser, deleteNote);

/*
  ENDPOINTS DE CATEGORIAS  
*/

//listar categorias
// get - /category
app.get('/category', getCategory);

/*
  ENDPOINTS DE USUARIO
*/

// Registro de usuarios
// POST - /users
app.post('/users', newUser);

// Login de usuarios
// POST - /users/login
app.post('/users/login', loginUser);

// Get de usuarios
// GET - /users/login
app.get('/users/user', isUser, getUserController);

// Middlewares finales

// Error middleware
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

// Not found
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port} `);
});
