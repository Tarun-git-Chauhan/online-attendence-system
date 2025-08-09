const bcrypt = require('bcryptjs');

const password = '2312';

bcrypt.hash(password, 10).then(hash => {
  console.log('Hashed password:', hash);
}).catch(err => {
  console.error('Error hashing password:', err);
});
