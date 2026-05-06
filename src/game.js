'use strict';

const { Game } = require('@gathertown/gather-game-client');
global.WebSocket = require('isomorphic-ws');

const { API_KEY, SPACE_ID, MAP_ID, MAP_X, MAP_Y } = require('./config');
const { sendToTelegram } = require('./notify');

const initGame = () => {
  const game = new Game(SPACE_ID, () => Promise.resolve({ apiKey: API_KEY }));

  game.connect();
  game.subscribeToConnection((connected) => console.log('[Gather] Connected:', connected));

  game.subscribeToEvent('playerChats', (data, context) => {
    console.log('[Gather] playerChats:', data);
    // sendToTelegram(`${context.player.name} message: ${data.playerChats.contents}`);
  });

  game.subscribeToEvent('playerActivelySpeaks', (data, context) => {
    if (context.player.map === MAP_ID && MAP_X.includes(context.player.x) && MAP_Y.includes(context.player.y)) {
      console.log('[Gather] playerActivelySpeaks:', data);
      // sendToTelegram(`${context.player.name} voice to you`);
    }
  });

  game.subscribeToEvent('playerMoves', (data, context) => {
    if (context.player.map === MAP_ID && MAP_X.includes(data.playerMoves.x) && MAP_Y.includes(data.playerMoves.y)) {
      console.log('[Gather] playerMoves:', data);
      // sendToTelegram(`${context.player.name} move to you`);
    }
  });

  return game;
};

module.exports = { initGame };
