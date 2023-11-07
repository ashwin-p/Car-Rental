const express = require('express');
const passport = require('../passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
    if (user) {
      return res.status(400).json({ message: 'Email is already in use.' });
    } else {
      const newUser = new User({
        username,
        email,
      });

      newUser.setPassword(password);

      newUser.save((err) => {
        if (err) {
          return res.status(500).json({ message: 'An error occurred. Please try again.' });
        }
        return res.status(201).json({ message: 'User registered successfully.' });
      });
    }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    if (!user.validPassword(password)) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign({ sub: user._id }, '661412c5eabb48b2197d23031af286f276ea93c87cc2b30145c6cd1aa67a6954', { expiresIn: '1h' });

    return res.status(200).json({ token, message: 'Login successful.' });
  });
});

module.exports = router;
