import { execSync } from 'node:child_process';
import { config } from 'dotenv';

// Applies every migration to the test database (creating its tables the first time).
export default function setup(): void {
  const { parsed } = config({ path: '.env.test', processEnv: {}, quiet: true });
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, ...parsed },
    stdio: 'inherit',
  });
}
