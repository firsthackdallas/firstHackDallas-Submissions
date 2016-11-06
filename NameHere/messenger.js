'use strict';

require('dotenv').config();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const request = require('request');
const mongoose = require('mongoose');
const Clarifai = require('clarifai');
const replies = require('./replies.json')['photoCompliment'];
const database = require('./database');
const dataServices = require('./data.json');

let Wit = null;
let log = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  log = require('../').log;
} catch (e) {
  Wit = require('node-wit').Wit;
  log = require('node-wit').log;
}

// Webserver parameter
const PORT = process.env.PORT;

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN;

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
if (!FB_PAGE_TOKEN) { throw new Error('missing FB_PAGE_TOKEN') }
const FB_APP_SECRET = process.env.FB_APP_SECRET;
if (!FB_APP_SECRET) { throw new Error('missing FB_APP_SECRET') }

let FB_VERIFY_TOKEN = null;

if (process.env.IS_DEBUGGING) {
  FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
  console.log(`/webhook initialized in debugging mode, and will accept the Verify Token "${FB_VERIFY_TOKEN}"`);
} else {
    crypto.randomBytes(8, (err, buff) => {
    if (err) throw err;
    FB_VERIFY_TOKEN = buff.toString('hex');
    console.log(`/webhook will accept the Verify Token "${FB_VERIFY_TOKEN}"`);
  });  
}

// ----------------------------------------------------------------------------
// Clarifai functions
var clarifaiApp = new Clarifai.App(
  process.env.CLARIFAI_ID,
  process.env.CLARIFAI_SECRET
);



// ----------------------------------------------------------------------------
// Healper functions

const firstEntityValue = (entities, entity) => {
    const val = entities && entities[entity] &&
            Array.isArray(entities[entity]) &&
            entities[entity].length > 0 &&
            entities[entity][0].value
        ;
    if (!val) {
        return null;
    }
    return typeof val === 'object' ? val.value : val;
};

// Tell Messenger's to send stuff to user
const sendUser = (body) => {
  
  console.log(body);

  const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);

  return fetch('https://graph.facebook.com/me/messages?' + qs, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body,
  })
  .then(rsp => rsp.json())
  .then(json => {
    if (json.error && json.error.message) {
      throw new Error(json.error.message);
    }
    return json;
  });

}

const getName = (sender) => {

  // https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=<PAGE_ACCESS_TOKEN>
  return fetch(`https://graph.facebook.com/v2.6/{$sender}?fields=first_name&access_token={$PAGE_ACCESS_TOKEN}`, {
    method: 'GET',
  })
  .then(rsp => rsp.json())
  .then(json => {
    if (json.error && json.error.message) {
      throw new Error(json.error.message);
    }
    return json;
  });

}

// Get name
// if (!(sessionId.localeCompare(process.env.FB_BOT_ID) == 0)) { // if sender is not a bot
//         console.log(sessionId);
//         getName(sessionId)
//         .then(json => {
//           console.log(json);
//           console.log(`> Recevied text from sender: ${sender} with name text: ${text}`);
//         });  
// }

// ----------------------------------------------------------------------------
// Database code

// Connect to database
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL);
var db = mongoose.connection;

// ----------------------------------------------------------------------------
// Messenger API specific code

// Send a message to user
const fbMessage = (id, text) => {

  const body = JSON.stringify({
    recipient: { id },
    message: { text },
  });

  return sendUser(body);

};

// Send a prompt for multiple choices to user
const fbMultipleChoices = (id, text, multipleChoices) => {

  var quickReplies = [];

  for (var choice of multipleChoices) {
    quickReplies.push({
      "content_type": "text",
      "title": choice,
      "payload": ""
    });
  }

  const body = JSON.stringify({
    recipient: { id },
    message: { 
      text,
      "quick_replies": quickReplies
    },
  });

  return sendUser(body);
}

// Ask for user location
const fbPromptLocation = (id) => {
  
  const body = JSON.stringify({
    recipient: { id },
    message: { 
      "text": "Please share your current location",
      "quick_replies": [{"content_type": "location"}]
    },
  });

  return sendUser(body);
}

// ----------------------------------------------------------------------------
// Wit.ai bot specific code

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

// This will contain all current activities by users
// fbid -> { activity: add|update
//           data: data package for the DB}
const activities = {};

const dataForm = {
  id: "",
  name: "",
  ssn: "",
  address: "",
  sex: "",
  martial_status: "",
  education_level: ""
}

const prompts = {
  name: "What is your name?",
  ssn: "What is your ssn?",
  address: "What is your address?",
  sex: "What is your gender?",
  martial_status: "Are you married?",
  education_level: "What is your education level?"
}


const findOrCreateSession = (fbid) => {
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};

const findOrCreateActivity = (fbid) => {

  let activity;

  if (!activities[fbid]) {
    activities[fbid] = {activity: "", data: dataForm}
  }
  activity = activities[fbid];

  return activity;
};

// Our bot actions
const actions = {

  // Send to bot
  send({sessionId}, {text}) {

    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Found user
      return fbMessage(recipientId, text)
      .then(() => null)
      .catch((err) => {
        console.error(
          'Oops! An error occurred while forwarding the response to',
          recipientId,
          ':',
          err.stack || err
        );
      });
    } else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      return Promise.resolve()
    }


  },

  // Execute function on bot side
  getServicesAroundMe({context, entities}) {
    return new Promise( (resolve, reject) => {

      dataServices

      var allServices = "";

      for (var service of dataServices) {

        if (service['service']) {
          let house = service['service'];
          Object.keys(house).forEach(k => {
            allServices += k + ": " + house[k] + "\n";
          });
        }
      }

      console.log(allServices);

      var location = firstEntityValue(entities, "location")
      if (location) {
        context.services = "\n\n" + allServices
      }

      return resolve(context);

    });
  },


  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
};

// Setting up our bot
const wit = new Wit({
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});

// Starting our webserver and putting it all together
const app = express();
app.use(({method, url}, rsp, next) => {
  rsp.on('finish', () => {
    console.log(`${rsp.statusCode} ${method} ${url}`);
  });
  next();
});
app.use(bodyParser.json({ verify: verifyRequestSignature }));

// Webhook setup
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

// Message handler
app.post('/webhook', (req, res) => {
  // Parse the Messenger payload
  // See the Webhook reference
  // https://developers.facebook.com/docs/messenger-platform/webhook-reference
  const data = req.body;

  if (data.object === 'page') {
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && !event.message.is_echo) {
          // Yay! We got a new message!
          // We retrieve the Facebook user ID of the sender
          const sender = event.sender.id;

          // We retrieve the user's current session, or create one if it doesn't exist
          // This is needed for our bot to figure out the conversation history
          const sessionId = findOrCreateSession(sender);

          // We retrieve the message content
          const {text, attachments} = event.message;

          if (attachments) {
            
            console.log("> User sent an image");
            let url = attachments[0]['payload']['url'];

            // send to CLARIFAI
            clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, url).then(
              function(response) {
                let concepts = response['data']['outputs'][0]['data']['concepts'];
                let o1 = concepts[0]['name'];
                let o2 = concepts[1]['name'];
                let o3 = concepts[2]['name'];

                let random = Math.floor((Math.random() * replies.length));
                let reply = replies[random];
                reply = reply.replace("${o1}", o1);
                reply = reply.replace("${o2}", o2);
                reply = reply.replace("${o3}", o3);

                fbMessage(sender, reply);
              },
              function(err) {
                console.error(err);
              }
            );

          } else if (text) {

            // We received a text message
            switch (text.toLowerCase()) {
              case 'show profile':




                // database.getService({}).then(function(response) {

                //     var allServices = "";
                //     let json = response;

                //     for (var service of json) {

                //       if (service['service']) {
                //         let house = service['service'];
                //         Object.keys(house).forEach(k => {
                //           console.log(house[k]);
                //         });
                //       }

                //       // Object.keys(service).forEach(k => {
                //       //   Object.keys(service[k]).forEach(h => {
                //       //     allServices += (h + '\n');
                //       //   });
                //       //   // allServices += (k + '\n'); //  + ": " + service[k] + "\n"
                //       // });
                //     }

                //     console.log(allServices);

                //     // fbMessage(sender, );
                // }, function(error) {

                // });


                

                break;
              case 'create profile':
                console.log('> User creating new profile');

                var activity = findOrCreateActivity(sender);
                activity['activity'] = 'add';
                activity['data'] = dataForm;
                activity['data']['id'] = sender;

                fbMessage(sender, 'What is your name?');

                break;
              case 'help':
                fbMessage(sender, '1. show profile \t\tshow your profile \n2. create profile \t\tcreate a new profile');
                break;

              default:

                // Check to see if the user is in a middle of an activity or not. If yes, continue the activity, else, end to bot
                var activity = findOrCreateActivity(sender);
                if (activity['activity'] == 'add') {
                  console.log("> User is adding");

                  let missingVariable = null;

                  // Get to first empty and edit value

                  Object.keys(activity['data']).forEach(k => {
                    if (missingVariable == null && activity['data'][k] == '') {
                      missingVariable = k;
                    }
                  });

                  activity['data'][missingVariable] = text;
                  console.log(`> Added a field ${missingVariable}: ${text}`);

                  // Prompt next answer

                  let nextMissingVariable = null;

                  Object.keys(activity['data']).forEach(k => {
                    if (nextMissingVariable == null && activity['data'][k] == '') {
                      nextMissingVariable = k;
                    }
                  });

                  switch (nextMissingVariable) {
                    case 'sex':
                      fbMultipleChoices(sender, prompts[nextMissingVariable], ['Male', 'Female']);
                      break;
                    case 'martial_status':
                      fbMultipleChoices(sender, prompts[nextMissingVariable], ['Married', 'Single', 'Dead Husby']);
                      break;
                    default:
                      fbMessage(sender, prompts[nextMissingVariable]);  
                  }

                  if (nextMissingVariable == null) { // cannot find anything next

                    database.addUser(activity['data'])
                    .then((data) => {
                      console.log(`Successfully pushed ${activity['data']['id']} into database`);
                    });

                    activity['activity'] = '' // clear up, finished
                    console.log(activity);
                  }

                } else {

                  // Let's forward the message to the Wit.ai Bot Engine
                  // This will run all actions until our bot has nothing left to do
                  wit.runActions(
                    sessionId, // the user's current session
                    text, // the user's message
                    sessions[sessionId].context // the user's current session state
                    ).then((context) => {
                    // Our bot did everything it has to do.
                    // Now it's waiting for further messages to proceed.
                    console.log('Waiting for next user messages');

                    // Based on the session state, you might want to reset the session.
                    // This depends heavily on the business logic of your bot.
                    // Example:
                    // if (context['done']) {
                    //   delete sessions[sessionId];
                    // }

                    // Updating the user's current session state
                    sessions[sessionId].context = context;
                  })
                    .catch((err) => {
                      console.error('Oops! Got an error from Wit: ', err.stack);
                    })
                  }

                break; // for the default
            }

            
          }
        } else {
          console.log('received event', JSON.stringify(event));
        }
      });
    });
  }
  res.sendStatus(200);
});

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

app.listen(PORT);
console.log('Listening on :' + PORT + '...');
