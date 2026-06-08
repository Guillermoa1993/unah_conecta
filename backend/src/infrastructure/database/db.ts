// @ts-ignore: pg module declaration files are not installed
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://unahcu:Tt6khZa6eLgcAarLqJXBU13h0V66eYum@dpg-d8f4rregvqtc738td3og-a.virginia-postgres.render.com/puma_conecta?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;