'use strict';

const express = require('express');
const { PORT } = require('./config');

const createServer = () => {
  const app = express();

  app.get('/', (req, res) => {
    res.status(200).send('Gather Line Notify api running');
  });

  app.listen(PORT, () => {
    console.log(`[Server] Listening on port ${PORT}`);
  });

  return app;
};

module.exports = { createServer };
