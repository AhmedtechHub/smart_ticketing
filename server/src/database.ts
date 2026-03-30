import 'dotenv/config';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Parse DATABASE_URL into connection options for the MariaDB adapter
function parseDatabaseUrl(url) {
  if (!url) throw new Error('DATABASE_URL environment variable is not set.');
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

const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const connectionOptions = parseDatabaseUrl(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb(connectionOptions);
const prisma = new PrismaClient({ adapter });

export default prisma;
