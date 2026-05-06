'use strict';

require('dotenv').config();

const { createServer } = require('./src/server');
const { initGame } = require('./src/game');

createServer();
initGame();