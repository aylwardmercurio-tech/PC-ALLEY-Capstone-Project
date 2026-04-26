const mysql = require('mysql2/promise');

async function checkDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
    });
    const [rows] = await connection.query('SHOW DATABASES LIKE "pc_alley_db"');
    if (rows.length > 0) {
      console.log('DATABASE_EXISTS');
    } else {
      console.log('DATABASE_MISSING');
    }
    await connection.end();
  } catch (err) {
    console.error('CONNECTION_ERROR', err.message);
  }
}

checkDB();
