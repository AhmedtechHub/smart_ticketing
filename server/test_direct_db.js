const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({ 
  host: '127.0.0.1', 
  port: 3306,
  user: 'root', 
  password: 'root',
  database: 'Event_Ticketing'
});

async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Database connection successful!");
    const rows = await conn.query("SHOW TABLES");
    console.log("Tables:", rows);
  } catch (err) {
    console.error("Database connection failed:", err.message);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

testConnection();
