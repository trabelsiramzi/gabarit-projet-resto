import express from 'express';
const router = express.Router();
import User from '../model/user';


// Login route
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Handle login form submission
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Implement your login logic here
  const user = await User.getUserByEmail(email);

  if (user && user.mot_de_passe === password) {
    // Successful login
    // Implement session handling or token generation here
    res.sendStatus(200);
  } else {
    // Failed login
    res.sendStatus(401);
  }
});

export default router;
