const Joi = require('joi');
const { generateError } = require('../helpers');

const newUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(
      generateError('El campo email debe existir y ser un email válido', 400)
    ),
  password: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        'El campo password debe existir y ser mayor de 8 caracteres',
        400
      )
    ),
  surname: Joi.string()
    .max(150)
    .error(
      generateError(
        'El campo apellido no debe de tener más de 150 caracteres',
        400
      )
    ),
  name: Joi.string()
    .max(100)
    .error(
      generateError(
        'El campo nombre no debe de tener más de 100 caracteres',
        400
      )
    ),
});

module.exports = {
  newUserSchema,
};
