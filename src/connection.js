import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const {Pool}  = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '5432'),
});


export default pool;
