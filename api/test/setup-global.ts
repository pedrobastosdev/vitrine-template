import { execSync } from 'node:child_process';
import { DATABASE_URL_TEST } from './db-url.js';

/** Aplica as migrations no banco de teste antes de rodar os e2e. */
export default function setup() {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: DATABASE_URL_TEST },
  });
}
