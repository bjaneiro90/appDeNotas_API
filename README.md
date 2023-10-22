# Notas de texto API - notasBBDD

DESCRIPCIÓN

API que permite publicar notas de texto y categorizarlas.

Por defecto las notas son privadas: solo las puede ver el creador.

La API permite convertir una nota a pública, de forma que cualquiera que tenga el enlace la puede visualizar.

## Puesta en marcha

Pasos iniciales para su puesta en marcha:

- Crear la base de datos.
  -Configurar el archivo .env (se incluye ejemplo en .env.example).
- Iniciar la base de datos ejecutando "node db/initDB.js" en el terminal.
- Inciar la API con "npm start".

En la colección de PostMan (carpeta docs) se encuentran todos los endpoints con ejemplos de su contenido para empezar a trabajar con ella.

## Endpoints

### Los campos marcados con un asterisco son obligatorios

- NOTAS

  - GET /notes

    - Muestra todas las notas del usuario

  - GET/notes/:id

    - Muestra la nota indicada. Si es privada solo puede acceder el autor.

  - POST /notes

    - Crea una nueva nota
    - Body:
      - title\*
      - text\*
      - category_id\*

  - PUT /notes/:id
    - Modifica la nota indicada
    - Body:
      - title
      - text
      - category_id
  - PUT /note/:id/public

    - Cambia la visibilidad de una nota (de pública a privada y viceversa)
      -Body:
      - Private\* (booleano -> true convierte a privada y false a pública)

  - DELETE /notes/:id
    - Borra la nota indicada (solo el autor)

- ENDPOINTS DE CATEGORIAS

  - GET /category
    - Devuelve el listado de categorías

- ENDPOINTS DE USUARIO

  - POST /users

    - Crear un nuevo usuario (registro)
    - Body:
      - email\*
      - password\*
      - name
      - surname

  - APP /users/login
    - Devuelve el token del usuario (login)
      -Body:
      - email\*
      - password\*
