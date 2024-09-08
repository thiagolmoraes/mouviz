const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "You need login first." });

  // deepcode ignore HardcodedSecret: ignore for testing purposes
  jwt.verify(token, 'keep_secret', (err, user) => {
    if (token == null) return res.status(401).json({ error: "Unauthorized" });

    if (err) {
      console.log("Token verification error: ", err);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(403).json({ error: "You are not authorized to access this resource." });
    }
    req.user = user;
    console.log("User authenticated:", user);
    next();
  });
}

module.exports = authenticateToken;