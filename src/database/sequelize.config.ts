import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // models: [__dirname + '/../models/**/*.model.ts'],
  models: [
    User
  ],
  logging: true,
});
