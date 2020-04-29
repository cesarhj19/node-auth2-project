const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secrets = require('../config/secrets');

const Users = require('../users/users-model');

function genToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
  };
  const options = { expiresIn: '1h' };
  const token = jwt.sign(payload, secrets.jwtSecret, options);
  return token;
}

router.post('/register', (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then((saved) => {
      const token = genToken(saved);
      res.status(201).json({ created_user: saved, token });
    })
    .catch((err) => res.status(500).json({
      error: 'error while registering user',
      message: err.message,
    }));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = genToken(user);
        res.status(200).json({ username: user.username, token });
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch((err) => res.status(500).json({
      error: 'error while loging into database',
      message: err.message,
    }));
});

module.exports = router;
