import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NotFound from "./pages/NotFound.js";
import Homepage from "./pages/Homepage.js";
import Art from "./pages/Art.js";
import Create from "./pages/Create.js";
import People from "./pages/People.js";
import Profile from "./pages/Profile.js";
import SignIn from "./pages/SignIn.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import { auth, firestore } from "../firebaseClient";

/**
 * Define the "App" component as a class.
 */

function App(props) {

  const [userId, setUserId] = useState(undefined);
  //const [firebaseApp, setFirebaseApp] = useState();

  //var firebaseConfig = {
  //  apiKey: "AIzaSyAvZsDdDGOyMaCHQcXsUDx-85yr9akOhgw",
  //  authDomain: "threast-website.firebaseapp.com",
  //  databaseURL: "https://threast-website.firebaseio.com",
  //  projectId: "threast-website",
  //  storageBucket: "threast-website.appspot.com",
  //  messagingSenderId: "933380237825",
  //  appId: "1:933380237825:web:3e4ccd069e65d4b8"
  //};

  //if(!firebase.apps.length) {
  //  var firebaseInit = firebase.initializeApp(firebaseConfig);
  //  setFirebaseApp(firebaseInit);
  //}

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
      post("/api/login", { token: res.token, displayName: res.displayName, email: res.email }).then((user) => {
        setUserId(user.uid);
        // console.log(userId);
        post("/api/initsocket", { socketid: socket.id });
    });
  };

  var handleLogout = () => {
    post("/api/logout").then(() => {
      setUserId(null);
    });
  };

  return (
	<>
	  <BrowserRouter>
	    <Switch>
          <Route exact path="/">
            <Homepage
	          handleLogin={handleLogin}
	          handleLogout={handleLogout}
	          userId={userId}
	        />
          </Route>
          <Route path="/art">
            <Art 
	          userId={userId}
            />
          </Route>
          <Route path="/create">
            <Create
	          userId={userId}
            />
          </Route>
          <Route path="/people">
            <People 
	          userId={userId}
            />
          </Route>
          <Route path="/profile">
            <Profile 
	          userId={userId}
            />
          </Route>
          <Route path="/signin">
            <SignIn 
	          userId={userId}
            />
          </Route>
	      <NotFound default />
        </Switch> 
	  </BrowserRouter>
	</>
  );
}

export default App;
