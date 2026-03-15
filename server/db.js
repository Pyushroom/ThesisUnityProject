import mysql from "mysql2";
import { createPool } from 'mysql2/promise';

//database connection settings
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'websitedb'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to MySQL.');
});

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

export { db, pool };