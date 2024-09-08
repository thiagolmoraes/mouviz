const AuthService = require('../services/AuthService');


class AuthController {
  static async register(req, res) {
    console.log('Register attempt:', req.body.email);
    const { email, password, name  } = req.body;
    try {
      const user = await AuthService.register(email, password, name);
      if (!user) {
        console.log('Registration failed for:', email);
        return res.status(400).json({ error: 'Registration failed' });
      }
      console.log('User registered successfully:', email);
      res.json({"message": "User registered successfully"});
    } catch (err) {
      console.log('Error during registration: ',err);
      res.status(400).json({ error: "Failed to register user" });
    }
  }
  static async login(req, res) {
    console.log('Login attempt:', req.body.email);

    const { email, password } = req.body;
    
    try {
    
      const { token, user } = await AuthService.login(email, password);

      if (!token) {
        console.log('Login failed for:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      console.log('User logged in successfully:', email);
      res.json({ token, name: user.name, email: user.email });
    
    } catch (err) {
    
      console.error('Error during login: ',err);
      res.status(400).json({ "error": "Failed to login user" });
    
    }
  }}

module.exports = AuthController;

