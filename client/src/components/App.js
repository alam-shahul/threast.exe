import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Homepage from "./pages/Homepage.js";
import Art from "./pages/Art.js";
import Create from "./pages/Create.js";
import People from "./pages/People.js";
import Profile from "./pages/Profile.js";
import SignIn from "./pages/SignIn.js";

import { firebase } from '@firebase/app';
import "firebase/auth";
import "firebase/firestore";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */

function App(props) {
  var firebaseConfig = {
    apiKey: "AIzaSyAvZsDdDGOyMaCHQcXsUDx-85yr9akOhgw",
    authDomain: "threast-website.firebaseapp.com",
    databaseURL: "https://threast-website.firebaseio.com",
    projectId: "threast-website",
    storageBucket: "threast-website.appspot.com",
    messagingSenderId: "933380237825",
    appId: "1:933380237825:web:874189b6c93cdefd"
  };

  if(!firebase.apps.length) {
    var firebaseInit = firebase.initializeApp(firebaseConfig);
  }

  const [userId, setUserId] = useState(undefined);
  const [firebaseApp, setFirebaseApp] = useState(firebaseInit);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  });

  var handleLogin = (res) => {
 //console.log(`Logged in as ${res.displayName}`);
    console.log(res);
    res.token.then((userToken) => {
      post("/api/login", { token: userToken, displayName: res.displayName, email: res.email }).then((user) => {
        setUserId(user.uid);
        // console.log(userId);
        post("/api/initsocket", { socketid: socket.id });
      });
    });
  };

  var handleLogout = () => {
    post("/api/logout").then(() => {
      setUserId(null);
    });
  };

  return (
	  <>
		  <Router>
		    <Homepage
			    path="/"
			    handleLogin={handleLogin}
			    handleLogout={handleLogout}
			    userId={userId}
			    firebaseApp={firebaseApp}
		    />
        <Art 
          path = "/art"
        />
        <Create
          path = "/create"
        />
        <People 
          path = "/people"
        />
        <Profile 
          path = "/profile"
        />
        <SignIn 
          path = "/signin"
        />
		    <NotFound default />
		  </Router>
	  </>
  );
}

export default App;
