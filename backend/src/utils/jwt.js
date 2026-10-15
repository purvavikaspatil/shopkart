const jwt = require('jsonwebtoken');

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    "my-secret-key",
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, "my-secret-key");
};

module.exports = { signToken, verifyToken };