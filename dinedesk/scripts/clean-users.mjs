import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dinedesk';

try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const match = envFile.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
    if (match) mongoUri = match[1];
  }
} catch {
  // Use default
}

async function run() {
  let totalDeleted = 0;

  try {
    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;
    if (db) {
      const res = await db.collection('users').deleteMany({});
      totalDeleted += res.deletedCount;
    }
  } catch {
    // Continue
  } finally {
    try {
      await mongoose.disconnect();
    } catch {
      // Ignore
    }
  }

  try {
    const out = execSync(
      `docker exec dinedesk-mongodb mongosh dinedesk --quiet --eval "JSON.stringify(db.users.deleteMany({}))"`,
      { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf8' }
    );
    const parsed = JSON.parse(out.trim());
    if (parsed.deletedCount) {
      totalDeleted += parsed.deletedCount;
    }
  } catch {
    // Docker not running
  }

  console.log(`🧹 Removed ${totalDeleted} user(s) from database.`);
}

run();
