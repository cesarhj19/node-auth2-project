const router = require('express').Router();

const Users = require('./users-model');

router.get('/', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send({
      error: 'error getting users from database',
      message: err.message,
    }));
});

module.exports = router;
