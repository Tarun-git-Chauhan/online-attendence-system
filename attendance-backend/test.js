const bcrypt = require('bcrypt');

const enteredPassword = '2312';
const hashedPassword = '$2b$10$26ppl1p5ED/F0CetVW9yz.jtsEgL95mksw4pjadfGEmtCJuc3uvsO'; 

bcrypt.compare(enteredPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error('Error comparing:', err);
  } else {
    console.log('Password match:', result); // should print true if match
  }
});
