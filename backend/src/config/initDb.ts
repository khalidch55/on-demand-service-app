import mysql from 'mysql2/promise';
import { env } from './env';

export async function ensureDatabaseExists() {
  try {
    const connection = await mysql.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\`;`);
    console.log(`Database "${env.DB_NAME}" verified or created.`);
    await connection.end();
  } catch (error) {
    console.error('Database pre-creation check failed:', error);
  }
}
