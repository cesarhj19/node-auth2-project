/* eslint-disable global-require */
// Modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Routers
const usersRouter = require('../users/users-router');
const authRouter = require('../auth/auth-router');

// Middleware
const restricted = require('../auth/restricted-middleware');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

// Routes
server.use('/api/users', restricted, usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
  res.status(200).json({ message: 'api up and running' });
});

module.exports = server;
