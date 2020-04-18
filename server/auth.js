// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs

// Add the Firebase products that you want to use
//require("firebase/auth");
//require("firebase/firestore");
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://threast-website.firebaseio.com'
});

var db = admin.firestore();

//console.log(app.projectId);

const { OAuth2Client } = require("google-auth-library");
// const User = require("./models/user");
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
  console.log("Get or create user")
  // the "sub" field means "subject", which is a unique identifier for each user
  let userRef = db.collection("users").doc(userQuery.uid);
  let user = userRef.get()
    .then(userSnapshot => {
      if (userSnapshot.exists) {
        console.log("User exists");
        return userSnapshot.data();
      }
      else {
        let data = {
          uid: userQuery.uid,
          email: userQuery.email,
          displayName: userQuery.displayName
        };
        let setUser = userRef.set(data)
          .then((newUser) => newUser);
        console.log("User Created");
        return setUser;
      }
    });
  return user;
}

function login(req, res) {
  admin.auth().verifyIdToken(req.body.token)
    .then((decodedToken) => {
     // console.log(decodedToken);
     // TODO: this seems jank, and stems from earlier jankiness. In particular,
     // this is the third time that I'm copying "email" and "displayName"...
     // REVISION: It's probably fine; can delete this TODO
     let userQuery ={"uid": decodedToken.uid, "email": req.body.email, "displayName": req.body.displayName};
     return getOrCreateUser(userQuery);
    })
    .then((user) => {
      // persist user in the session
      console.log(user);
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
