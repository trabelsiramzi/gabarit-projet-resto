import express from 'express';
const router = express.Router();
import User from '../model/user';

// Signup route
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Signup' });
});

// Handle signup form submission
router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Implement your signup logic here
  const userId = await User.createUser({ email, password, firstName, lastName });

  // You may want to handle successful signup differently
  res.sendStatus(userId ? 201 : 400);
});

export default router;
