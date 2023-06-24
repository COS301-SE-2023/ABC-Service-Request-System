const jwt = require('jsonwebtoken');

// Generate a JWT token
const generateToken = (user) => {
  const secretKey = 'your-secret-key'; // Replace with your own secret key
  const token = jwt.sign({ userId: user.emailAddress }, secretKey, { expiresIn: '1h' });
  return token;
};

// Usage example
const user = {
  name: 'Alice',
  surname: 'Smith',
  profilePhoto: 'http://example.com/img/alice.jpg',
  emailAddress: 'alice@example.com',
  password: 'alicepassword',
  roles: ['Manager'],
  groups: ['group1']
};

const token = generateToken(user);
console.log('Generated token:', token);
