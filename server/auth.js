// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs

// Add the Firebase products that you want to use
//require("firebase/auth");
//require("firebase/firestore");
const admin = require('firebase-admin');

var app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://threast-website.firebaseio.com'
});

//console.log(app.projectId);

const { OAuth2Client } = require("google-auth-library");
const User = require("./models/user");
const socket = require("./server-socket");


//// create a new OAuth client used to verify google sign-in
//    TODO: replace with your own CLIENT_ID
const CLIENT_ID = "933380237825-i4bbrsc26ho30qpkt4nhbht1q2vu8ne8.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// accepts a login token from the frontend, and verifies that it's legit
function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());
}

// gets user from DB, or makes a new account if it doesn't exist yet
function getOrCreateUser(userQuery) {
  // the "sub" field means "subject", which is a unique identifier for each user
  let user = admin.auth().getUser(userQuery.uid)
    .then((existingUser) => {
      console.log('Successfully found existing user:', existingUser.uid);
      return existingUser;
    })
    // TODO: Fix this to check the right error code.
    .catch(function(error) {
      admin.auth().createUser({
        uid: userQuery.uid,
        email: userQuery.email,
        displayName: userQuery.displayName
      })
      .then(function(newUser) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', newUser.uid);
        return newUser;
      })
      .catch(function(error) {
        console.log('Error creating new user:', error);
      });
    });

  return user
}

function login(req, res) {
  admin.auth().verifyIdToken(req.body.token)
    .then((decodedToken) => {
     // console.log(decodedToken);
     // TODO: this seems jank, and stems from earlier jankiness. In particula,
     // this is the third time that I'm copying "email" and "displayName"...
     let userQuery ={"uid": decodedToken.uid, "email": req.body.email, "displayName": req.body.displayName};
     return getOrCreateUser(userQuery);
    })
    .then((user) => {
      // persist user in the session
      //console.log(user);
      req.session.user = user;
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to log in: ${err}`);
      res.status(401).send({ err });
    });
}

function logout(req, res) {
  req.session.user = null;
  res.send({});
}

function populateCurrentUser(req, res, next) {
  // simply populate "req.user" for convenience
  req.user = req.session.user;
  next();
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "not logged in" });
  }

  next();
}

module.exports = {
  login,
  logout,
  populateCurrentUser,
  ensureLoggedIn,
};
