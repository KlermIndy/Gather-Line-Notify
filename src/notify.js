'use strict';

const axios = require('axios');
const qs = require('qs');
const { LINE_NOTIFY_TOKEN, TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = require('./config');

const sendToLine = async (msg) => {
  try {
    const response = await axios.post(
      'https://notify-api.line.me/api/notify',
      qs.stringify({ message: msg }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: LINE_NOTIFY_TOKEN,
        },
      }
    );
    console.log('[LINE]', JSON.stringify(response.data));
  } catch (error) {
    console.error('[LINE] Error:', error.message);
  }
};

const sendToTelegram = async (msg) => {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      { chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: 'Markdown' }
    );
    console.log('[Telegram]', JSON.stringify(response.data));
  } catch (error) {
    console.error('[Telegram] Error:', error.message);
  }
};

module.exports = { sendToLine, sendToTelegram };
