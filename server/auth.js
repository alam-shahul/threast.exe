// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs

const admin = require("./firebaseAdmin");

const socket = require("./server-socket");

// gets user from DB, or makes a new account if it doesn't exist yet
function getOrCreateUser(userQuery) {
  console.log("Get or create user")
  // the "sub" field means "subject", which is a unique identifier for each user
  console.log(userQuery);
  let userRef = admin.firestore.collection("users").doc(userQuery.uid);
  let user = userRef.get()
    .then(userSnapshot => {
      if (userSnapshot.exists) {
        console.log("User exists");
        return userSnapshot.data();
      }
      else {
        let newUser = admin.firestore.collection("profiles").where("email", "==", userQuery.email).get()
          .then((profileSnapshot) => {
            console.log(profileSnapshot.docs[0].id);
            let data = {
              uid: userQuery.uid,
              email: userQuery.email,
              displayName: userQuery.displayName,
              profileId: profileSnapshot.docs[0].id
            };
            let newUser = userRef.set(data).then(() => {
              return data;
            });
            return newUser;
          });
        return newUser;
      }
    });
  return user;
}

function login(req, res) {
  // First, check if user is whitelisted in Firebase (could also have local list of whitelisted users
  admin.firestore.collection("whitelist").doc(req.body.email).get()
    .then((whitelistEntry) => {
      let isWhitelisted = whitelistEntry.exists;
      if (isWhitelisted) {
        admin.auth.verifyIdToken(req.body.token)
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
     else throw "User is not whitelisted!";
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
