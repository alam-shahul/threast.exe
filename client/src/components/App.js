import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NotFound from "./pages/NotFound.js";
import Homepage from "./pages/Homepage.js";
import Art from "./pages/Art.js";
import Create from "./pages/Create.js";
import People from "./pages/People.js";
import Account from "./pages/Account.js";
import Navbar from "./Navbar.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import { auth, firestore } from "../firebaseClient";

/**
 * Define the "App" component as a class.
 */

function App(props) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    get("/api/whoami").then((user) => {
        // they are registed in the database, and currently logged in.
        if (!user) {
          setUser(user);
        }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  var handleLogin = (res) => {
  //console.log(`Logged in as ${res.displayName}`);
    var whitelistResult = post("/api/login", { token: res.token, displayName: res.displayName, email: res.email }).then((user) => {
      setUser(user);
      post("/api/initsocket", { socketid: socket.id });
      return true;
    }).catch((err) => {
      console.log(err);
      return false;
    });
    return whitelistResult;
  };

  var handleLogout = () => {
    post("/api/logout").then(() => {
      setUser(null);
    });
  };

  return (
	<>
      <BrowserRouter>
	    <Navbar 
          user={user}
        />
	    <Switch >
          <Route exact path="/">
            <Homepage 
	          user={user}
	        />
          </Route>
          <Route path="/art">
            <Art 
	          user={user}
            />
          </Route>
          <Route path="/create">
            <Create
	          user={user}
            />
          </Route>
          <Route path="/people">
            <People 
	          user={user}
            />
          </Route>
          <Route path="/account">
            <Account
	          handleLogin={handleLogin}
	          handleLogout={handleLogout}
	          user={user}
            />
          </Route>
	      <NotFound default />
        </Switch> 
	  </BrowserRouter>
	</>
  );
}

export default App;
