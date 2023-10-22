const Joi = require('joi');
const { generateError } = require('../helpers');

// Valida nueva entrada en el diario
const newEntrySchema = Joi.object().keys({
  category_id: Joi.number()
    .min(1)
    .required()
    .error(
      generateError(
        'El campo category debe existir y ser mayor de 2 caracteres',
        400
      )
    ),
  text: Joi.string()
    .min(5)
    .max(10000)
    .required()
    .error(
      generateError(
        'El campo texto debe existir y ser mayor a 5 caracteres',
        400
      )
    ),

  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .error(generateError('El campo title debe existir', 400)),
});

const editEntrySchema = Joi.object()
  .keys({
    text: Joi.string()
      .optional()
      .min(5)
      .max(10000)
      .error(generateError('Valor de text incorrecto', 400)),
    title: Joi.string()
      .optional()
      .min(3)
      .max(100)
      .error(generateError('Valor de title incorrecto', 400)),
    category_id: Joi.number()
      .optional()
      .min(1)
      .error(generateError('Valor de category incorrecto', 400)),
  })
  .min(1);

module.exports = {
  newEntrySchema,
  editEntrySchema,
};
