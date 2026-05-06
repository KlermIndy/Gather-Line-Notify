'use strict';

module.exports = {
  PORT: process.env.PORT || 3000,

  // Gather
  API_KEY: process.env.API_KEY,
  SPACE_ID: process.env.SPACE_ID,
  MAP_ID: process.env.MAP_ID,

  // Line Notify
  LINE_NOTIFY_TOKEN: process.env.LINE_NOTIFY_TOKEN,

  // Telegram Bot
  TELEGRAM_TOKEN: process.env.TELEGRAM_KLERM_GATHER_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_KLERM_GATHER_CHAT_ID,

  // Your own Gather player ID (used to detect waves/notifications directed at you)
  ME_ID: process.env.ME_ID,

  // Gather Map OTH1_F(O) target coordinates
  MAP_X: [5, 6, 7],
  MAP_Y: [23, 24],
};
