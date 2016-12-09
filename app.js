/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
//end Boilerplate code
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var url = appEnv.getServiceURL("BunchNRDemo-cloudantNoSQLDB");
var cloudant = require('cloudant')(url);

app.post('/twilio', function(req, res) {

  var xerox_db = cloudant.db.use('xerox');

  var body = "You sent: " + req.body.messageId;

  xerox_db.insert({"payload": body});

//require the Twilio module and create a REST client
var client = require('twilio')(process.env.TwilioAcctSID, process.env.TwilioToken);


client.messages.create({
    to: process.env.ToSMS,
    from: process.env.FromSMS,
    body: body,
}, function (err, message) {
    console.log(message.sid);
});

res.status(200).send('Message sent!');

});

app.get('/twilio', function(req, res) {
  var html = "<html><head><title>BunchNRDemo</title></head><body><h2>Twilio service</h2><p>You need to use POST for this service.</p></body></html>";

  res.set('Content-Type', 'text/html');
  res.status(200).send(html);


});
