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

const game = new Game(SPACE_ID, () => Promise.resolve({ apiKey: API_KEY }));
game.connect();
game.subscribeToConnection((connected) => console.log("connected?", connected));

/**** the good stuff ****/

// game.subscribeToEvent("playerMoves", (data, context) => {
//   console.log(
//     context?.player?.name ?? context.playerId,
//     "moved in direction",
//     data.playerMoves.direction,
//     // "in map id",
//     // data.playerMoves.mapId
//   );
//   console.log(data);
// });

game.subscribeToEvent("playerChats", (data, context) => {
  console.log(
    context?.player?.name ?? context.playerId,
    "message to you :",
    data.playerChats.contents
  );

  const playerName = context?.player?.name ?? context.playerId
  const dataQs = qs.stringify({
    'message': `${playerName} message to you : ${data.playerChats.contents}`
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://notify-api.line.me/api/notify',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization': LINE_NOTIFY_TOKEN
    },
    data : dataQs
  };

  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });



});

const app = express();
app.get('/', async (req, res) => {
  res.status(200).send("Gather Line Notify api running");
});
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})