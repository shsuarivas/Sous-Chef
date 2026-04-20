import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

// Function to start a database connection and execute a provided function with the client
export async function StartDatabaseConnection(fn) 
{
  const client = await pool.connect();

  try 
  {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  }

  catch (err) 
  {
    await client.query('ROLLBACK');
    console.error('Error:', err.message);
    throw err;
  }

  finally 
  {
    client.release();
  }
}

export async function DisconnectPool() 
{
  await pool.end();
}