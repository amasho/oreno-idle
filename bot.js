var botkit = require('botkit');

var slackBot = botkit.slackbot({
  debug: false,
  json_file_store: './simple_storage/'
})
.configureSlackApp({
  clientId: process.env.BOTKIT_SLACK_CLIENT_ID,
  clientSecret: process.env.BOTKIT_SLACK_CLIENT_SECRET,
  scopes: ['commands']
});

var bot = slackBot.spawn({ token: process.env.token }).startRTM();

bot.api.team.info({}, function(err, res) {
  slackBot.storage.teams.save(res.team, function(err) {});
});

slackBot.setupWebserver(process.env.PORT, function(err, webserver) {
  slackBot.createWebhookEndpoints(slackBot.webserver);
  slackBot.createOauthEndpoints(slackBot.webserver, function(err, req, res) {
    if (err) {
      res.status(500).send('Error: ' + JSON.stringify(err));
    } else {
      res.send('Success');
    }
  });
});

slackBot.on('slash_command', function(bot, message) {
  switch (message.command) {
    case '/gakky':
      bot.replyPublic(message, 'https://pbs.twimg.com/media/DE8s-vCV0AAR-Z-.jpg');
      break;
    case '/yoshioka-riho':
      bot.replyPublic(message, 'http://file.auditiontd.blog.shinobi.jp/dodonbei10.jpg');
      break;
    default:
      break;
  }
});
