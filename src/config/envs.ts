import 'dotenv/config';
import * as joi from 'joi';

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    PRODUCTS_MS_URL: joi.string().required(),
    PRODUCTS_MS_PORT: joi.number().required(),
    ORDERS_MS_URL: joi.string().required(),
    ORDERS_MS_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);
if (error) {
  throw new Error(`Env Vars error ${error.message}`);
}

const envValues: {
  PORT: number;
  DATABASE_URL: string;
  PRODUCTS_MS_URL: string;
  PRODUCTS_MS_PORT: number;
  ORDERS_MS_URL: string;
  ORDERS_MS_PORT: number;
} = value;

export const envs = {
  port: envValues.PORT,
  DATABASE_URL: envValues.DATABASE_URL,
  PRODUCTS_MS_URL: envValues.PRODUCTS_MS_URL,
  PRODUCTS_MS_PORT: envValues.PRODUCTS_MS_PORT,
  ORDERS_MS_URL: envValues.ORDERS_MS_URL,
  ORDERS_MS_PORT: envValues.ORDERS_MS_PORT,
};
