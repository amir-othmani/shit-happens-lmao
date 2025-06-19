import db from '../db/stuff_db.mjs';
import crypto from 'crypto';


export const getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) { 
        // Database error
        reject(err); 
      }
      else if (row === undefined) { 
        // User not found
        resolve(false); 
      }
      else {        
        const salt = row.salt;
        const db_hashedPassword = row.salted_password;
        const user = {id: row.user_id, username: row.username};
        
        // password hashing
        crypto.scrypt(password, salt, 32, function(err, hashedPassword) {
          if (err) reject(err);
          
          if(!crypto.timingSafeEqual(Buffer.from(db_hashedPassword, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};