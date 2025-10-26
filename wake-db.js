import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function wake() {
  const url = process.env.DATABASE_URL;
  
  console.log('DATABASE_URL exists:', !!url);
  console.log('DATABASE_URL format:', url ? url.substring(0, 30) + '...' : 'MISSING');
  
  if (!url) {
    console.error('❌ DATABASE_URL is not set in .env.local');
    return;
  }

  console.log('Attempting connection...');
  const sql = neon(url);
  
  try {
    const result = await sql`SELECT NOW() as time`;
    console.log('✅ Database connected!', result);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Full error:', err);
  }
}

wake();