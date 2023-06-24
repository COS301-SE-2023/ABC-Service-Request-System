const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('alicepassword', salt);

console.log(hashedPassword); // Outputs the hashed password
