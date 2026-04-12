import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ 
  //user: 'SousChef', // username of .env username
  host: 'postgres', 
  database: 'appdb', // database name of .env database
  //password: '1234', // password of .env password
  port: 5432,
});

export default pool;