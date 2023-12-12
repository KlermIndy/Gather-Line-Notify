const axios = require('axios');
const qs = require('qs');
const express = require('express');

const { Game } = require("@gathertown/gather-game-client");
global.WebSocket = require("isomorphic-ws");

/**** setup ****/

const app = express();
const PORT = process.env.PORT || 3000;

// Gather
const API_KEY = "gBy23gweuIrpIInM";
const SPACE_ID = "xBP58fLWr9drozxs\\ThaiBev_IT";
// Line Notify
const LINE_NOTIFY_TOKEN = "Bearer mCB4ti6jBFRqcyU6bso7ntk2jRPVWBbig66q7MXSGcU";

// what's going on here is better explained in the docs:
// https://gathertown.notion.site/Gather-Websocket-API-bf2d5d4526db412590c3579c36141063
const game = new Game(SPACE_ID, () => Promise.resolve({ apiKey: API_KEY }));
// replace with your spaceId of choice ^^^^^^^^^^^
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
  // console.log(data);
  // console.log(context);
  // console.log(context.target);
  

  // data.playerChats.senderId me : y06Wp4JXwOUCUIhasFA5f0vYikx2


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


app.get('/', async (req, res) => {
  res.status(200).send("Gather Line Notify api running");
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})