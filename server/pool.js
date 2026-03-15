import { createPool } from 'mysql2/promise';
const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'websitedb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  // Test the connection pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL as ID', connection.threadId);
    connection.release();
  });

  export default pool;