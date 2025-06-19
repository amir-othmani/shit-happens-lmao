import sqlite from 'sqlite3';
// open the database
const db = new sqlite.Database('src/db/stuff_db.sqlite', (err) => {
  if (err) throw err;
});

export default db;