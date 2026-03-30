const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Parse DATABASE_URL into connection options for the MariaDB adapter
function parseDatabaseUrl(url) {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 3306,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.replace(/^\//, ''),
    };
  } catch (e) {
    throw new Error(`Invalid DATABASE_URL: ${e.message}`);
  }
}

const connectionOptions = parseDatabaseUrl(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb(connectionOptions);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
