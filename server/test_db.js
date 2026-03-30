require('dotenv').config();
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('@prisma/client');

function parseDatabaseUrl(url) {
  if (!url) throw new Error('DATABASE_URL environment variable is not set.');
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace(/^\//, ''),
  };
}

async function testConnection() {
  try {
    const connectionOptions = parseDatabaseUrl(process.env.DATABASE_URL);
    const adapter = new PrismaMariaDb(connectionOptions);
    const prisma = new PrismaClient({ adapter });
    console.log('Adapter created with options');
    await prisma.$connect();
    console.log('Connected');
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
