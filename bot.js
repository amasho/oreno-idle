var botkit = require('botkit');

var controller = botkit.slackbot({
  debug: false,
  json_file_store: './simple_storage/'
})
.configureSlackApp({
  clientId: process.env.BOTKIT_SLACK_CLIENT_ID,
  clientSecret: process.env.BOTKIT_SLACK_CLIENT_SECRET,
  scopes: ['commands']
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();

bot.api.team.info({}, function(err, res) {
  controller.storage.teams.save(res.team, function(err) {});
});

controller.setupWebserver(process.env.PORT, function(err, webserver) {
  controller.createWebhookEndpoints(controller.webserver);
  controller.createOauthEndpoints(controller.webserver, function(err, req, res) {
    if (err) {
      res.status(500).send('Error: ' + JSON.stringify(err));
    } else {
      res.send('Success');
    }
  });
});

controller.on('slash_command', function(bot, message) {
  switch (message.command) {
    case '/gakky':
      bot.replyPublic(message, 'https://pbs.twimg.com/media/DE8s-vCV0AAR-Z-.jpg');
      break;
    default:
      break;
  }
});
