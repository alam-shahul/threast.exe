// Add the Firebase products that you want to use
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://threast-website.firebaseio.com'
});

var firestore = admin.firestore();
var auth = admin.auth();
var storage = admin.storage();

module.exports.firestore = firestore;
module.exports.storage = storage;
module.exports.auth = auth;
