import { body } from 'express-validator';

export const destinationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('O nome do destino é obrigatório')
    .isLength({ min: 2, max: 255 })
    .withMessage('O nome deve ter entre 2 e 255 caracteres'),
  body('latitude')
    .notEmpty()
    .withMessage('Latitude é obrigatória')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude deve estar entre -90 e 90'),
  body('longitude')
    .notEmpty()
    .withMessage('Longitude é obrigatória')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude deve estar entre -180 e 180'),
];
