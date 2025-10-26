import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  console.log('Testing database queries...\n');
  
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    // Test 1: Basic query
    console.log('Test 1: SELECT NOW()');
    const result1 = await sql`SELECT NOW()`;
    console.log('✅ Success:', result1);
    
    // Test 2: Check if tables exist
    console.log('\nTest 2: Check tables');
    const result2 = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✅ Tables:', result2);
    
    // Test 3: Query categories table
    console.log('\nTest 3: Query categories');
    const result3 = await sql`SELECT * FROM categories LIMIT 5`;
    console.log('✅ Categories:', result3);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Full error:', err);
  }
}

test();