import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().uri().default('mongodb://localhost:27017/prueba_itau'),
  JWT_SECRET: Joi.string().min(16).default('change-me'),
  JWT_EXPIRES_IN: Joi.number().positive().default(3600),
});
