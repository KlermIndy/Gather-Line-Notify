const axios = require('axios');
const qs = require('qs');
const express = require('express');
require('dotenv').config();

const { Game } = require("@gathertown/gather-game-client");
global.WebSocket = require("isomorphic-ws");


// Express
const PORT = process.env.PORT || 3000;
// Gather
const API_KEY = process.env.API_KEY;
const SPACE_ID = process.env.SPACE_ID;
const MAP_ID = process.env.MAP_ID;
// Line Notify
const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN;
// Gather Map OTH1_F(O)
const mapX = [5, 6, 7];
const mapY = [23, 24];
// Talegram Bot Notify
const TELEGRAM_KLERM_GATHER_TOKEN = process.env.TELEGRAM_KLERM_GATHER_TOKEN;
const TELEGRAM_KLERM_GATHER_CHAT_ID = process.env.TELEGRAM_KLERM_GATHER_CHAT_ID;

const game = new Game(SPACE_ID, () => Promise.resolve({ apiKey: API_KEY }));
game.connect();
game.subscribeToConnection((connected) => console.log("connected?", connected));

game.subscribeToEvent("playerChats", (data, context) => {
  console.log(data);
  sentToTelegram(`${context.player.name} message to you : ${data.playerChats.contents}`);
});

game.subscribeToEvent("playerActivelySpeaks", (data, context) => {
  if(context.player.map == MAP_ID && mapX.includes(context.player.x) && mapY.includes(context.player.y)) {
    sentToTelegram(`${context.player.name} voice to you`);
  }
});

game.subscribeToEvent("playerMoves", (data, context) => {
  if(context.player.map == MAP_ID && mapX.includes(data.playerMoves.x) && mapY.includes(data.playerMoves.y)) {
    sentToTelegram(`${context.player.name} move to you`);
  }
});

const sentToLine = (msg) => {
  console.log(msg);

  const data = qs.stringify({
    'message': msg
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://notify-api.line.me/api/notify',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization': LINE_NOTIFY_TOKEN
    },
    data : data
  };

  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
};

const sentToTelegram = (msg) => {

  const data = {
    'chat_id': TELEGRAM_KLERM_GATHER_CHAT_ID,
    'text': msg,
    'parse_mode': 'Markdown'
  };

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.telegram.org/bot' + TELEGRAM_KLERM_GATHER_TOKEN + '/sendMessage',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify(data)
  };

  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
};

const app = express();
app.get('/', async (req, res) => {
  res.status(200).send("Gather Line Notify api running");
});
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})