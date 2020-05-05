/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socket = require("./server-socket");

// import Firebase functionality
const admin = require("./firebaseAdmin");

const stream = require("stream"); 


router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/create", (req, res, next) => {
  if (!req.user) {
    // not logged in
    res.redirect("/login");
    return;
  }
  var bucket = admin.storage.bucket();

});

router.get("/art", (req, res, next) => {
  if (req.query.id) {
  }
  else {
    admin.firestore.collection("users").get()
      .then((artSnapshot) => {
          console.log(artSnapshot);
          res.send(artSnapshot);
        }
      );
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
