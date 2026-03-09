const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => jwt.sign(
  { id: user._id, username: user.username },
  process.env.JWT_SECRET, { expiresIn: '30d' }
);

const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ $or: [{ email }, { username }] }))
      return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ username, email, password });
    res.status(201).json({ token: signToken(user), user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: signToken(user), user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;
