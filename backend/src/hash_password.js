const bcrypt = require('bcryptjs');

const plainTextPassword = 'admin123';
const saltRounds = 10;

const hashedPassword = bcrypt.hashSync(plainTextPassword, saltRounds);
// or for asynchronous hashing
// bcrypt.hash(plainTextPassword, saltRounds, function(err, hashedPassword) {
//   // Handle the hashed password here
// });

console.log('Hashed password:', hashedPassword);
