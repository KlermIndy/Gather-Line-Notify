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
// Line Notify
const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN;
// Gather Map OTH1_F(O)
const mapX = [5, 6, 7];
const mapY = [23, 24];

const game = new Game(SPACE_ID, () => Promise.resolve({ apiKey: API_KEY }));
game.connect();
game.subscribeToConnection((connected) => console.log("connected?", connected));

game.subscribeToEvent("playerChats", (data, context) => {
  const playerName = context?.player?.name ?? context.playerId
  const msg = `${playerName} message to you : ${data.playerChats.contents}`;

  console.log(msg);
  sentToLine(msg);
});

game.subscribeToEvent("playerActivelySpeaks", (data, context) => {
  if(mapX.includes(context.player.x) && mapY.includes(context.player.y)) {
    const msg = `${context.player.name} voice to you`;

    console.log(msg);
    sentToLine(msg);
  }
});

game.subscribeToEvent("playerMoves", (data, context) => {
  if(mapX.includes(data.playerMoves.x) && mapY.includes(data.playerMoves.y)) {
    const msg = `${context.player.name} move to you`;

    console.log(msg);
    sentToLine(msg);
  }
});

const sentToLine = (msg) => {
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

const app = express();
app.get('/', async (req, res) => {
  res.status(200).send("Gather Line Notify api running");
});
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})