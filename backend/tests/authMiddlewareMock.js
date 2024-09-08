module.exports = (req, res, next) => {
    req.user = { id: 1 }; // Mock user ID
    next();
  };