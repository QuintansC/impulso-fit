import { execSync } from 'child_process';
import path from 'path';

export default async function globalSetup() {
  const dbPath = path.join(__dirname, 'prisma', 'test.db');
  execSync('npx prisma db push --force-reset --skip-generate', {
    cwd: __dirname,
    env: { ...process.env, DATABASE_URL: `file:${dbPath}` },
    stdio: 'pipe',
  });
}
