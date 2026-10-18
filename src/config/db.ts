import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false, // Neon cloud database ke secure connection ke liye zaroori hai
  },
});

pool.connect()
  .then(() => console.log('PostgreSQL Database Connected Successfully!'))
  .catch((err) => console.error('Database connection error:', err.stack));

export default pool;