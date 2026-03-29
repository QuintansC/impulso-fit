import fs from 'fs';
import path from 'path';

export default async function globalTeardown() {
  const files = ['test.db', 'test.db-shm', 'test.db-wal'];
  for (const f of files) {
    const p = path.join(__dirname, 'prisma', f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
}
