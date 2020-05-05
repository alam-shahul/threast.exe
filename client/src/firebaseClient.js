import { firebase } from '@firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyAvZsDdDGOyMaCHQcXsUDx-85yr9akOhgw",
  authDomain: "threast-website.firebaseapp.com",
  databaseURL: "https://threast-website.firebaseio.com",
  projectId: "threast-website",
  storageBucket: "threast-website.appspot.com",
  messagingSenderId: "933380237825",
  appId: "1:933380237825:web:3e4ccd069e65d4b8"
};

if(!firebase.apps.length) {
  var firebaseInit = firebase.initializeApp(firebaseConfig);
}

export var auth = firebase.auth();
export var firestore = firebase.firestore();
export var storage = firebase.storage();

