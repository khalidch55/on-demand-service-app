import { Sequelize } from 'sequelize-typescript';
import { env } from './env';
import { User } from '../models/User';
import { ServiceCategory } from '../models/ServiceCategory';
import { Service } from '../models/Service';
import { Booking } from '../models/Booking';
import { ProviderAvailability } from '../models/ProviderAvailability';

const sequelize = new Sequelize({
  database: env.DB_NAME,
  dialect: 'mysql',
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  models: [User, ServiceCategory, Service, Booking, ProviderAvailability],
  logging: false,
});

export default sequelize;