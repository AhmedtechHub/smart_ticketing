const mariadb = require('mariadb');
require('dotenv').config();

// Extract config from DATABASE_URL
const url = new URL(process.env.DATABASE_URL);
const pool = mariadb.createPool({ 
  host: url.hostname, 
  port: parseInt(url.port) || 3306,
  user: url.username, 
  password: url.password,
  database: url.pathname.replace(/^\//, '')
});

async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SHOW TABLES");
    console.log("Full List of Tables:", rows.map(r => Object.values(r)[0]));
  } catch (err) {
    console.error("Database check failed:", err.message);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

testConnection();
