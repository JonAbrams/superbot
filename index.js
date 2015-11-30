'use strict';

require('dotenv').load();

const express = require('express');
const slackAPI = require('slackbotapi');

const app = express();
const bot = new slackAPI({
    token: process.env.SLACK_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token here
    name: 'Super Bot',
    autoreconnect: true,
    logging: process.env.NODE_ENV !== 'PROD'
});

const port = process.env.PORT || 3000;

bot.on('message', function (msg) {
  if (msg.type !== 'message') return;

  let karmaRegex = /<@\w+>\+{2}/g;
  let karmaTargets = msg.text.match(karmaRegex) || [];
  let users = karmaTargets.map(m => m.match(/^<@(\w+)>\+{2}$/)[1]);

  users.forEach(user => {
    let name = bot.getUser(user).name;

    if (name) {
      if (msg.user === user) {
        bot.sendMsg(msg.channel, `@${name}: Self-confidence is good, but giving yourself karma wouldn't be fair`);
      } else {
        bot.sendMsg(msg.channel, `@${name} just done good`);
      }
    }
  });
});

app.listen(port, () => console.log("Listening on port", port));
