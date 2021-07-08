import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NotFound from "./pages/NotFound.js";
import Homepage from "./pages/Homepage.js";
import Art from "./pages/Art.js";
import Create from "./pages/Create.js";
import People from "./pages/People.js";
import Account from "./pages/Account.js";
import Navbar from "./Navbar.js";
import Blog from "./pages/Blog.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import { auth, firestore } from "../firebaseClient";

/**
 * Define the "App" component as a class.
 */

function App(props) {
  const storedUser = localStorage.getItem("user");
  const storedVerificationStatus = localStorage.getItem("isVerified");
  const storedWhitelistStatus = localStorage.getItem("isWhitelisted");

  console.log(storedUser);
  console.log(storedVerificationStatus);
  console.log(storedWhitelistStatus);

  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [isVerified, setIsVerified] = useState(storedVerificationStatus ? JSON.parse(storedVerificationStatus) : null);
  const [isWhitelisted, setIsWhitelisted] = useState(storedWhitelistStatus ? JSON.parse(storedVerificationStatus) : null);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("isVerified", JSON.stringify(isVerified));
  }, [isVerified]);

  useEffect(() => {
    localStorage.setItem("isWhitelisted", JSON.stringify(isWhitelisted));
  }, [isWhitelisted]);

  var handleLogin = (res) => {
  //console.log(`Logged in as ${res.displayName}`);
    var whitelistResult = post("/api/login", { token: res.token, displayName: res.displayName, email: res.email }).then((user) => {
      setUser(user);
      setIsVerified(auth.currentUser.emailVerified);
      post("/api/initsocket", { socketid: socket.id });
      return true;
    }).catch((err) => {
      console.log(err);
      return false;
    });

    setIsWhitelisted(whitelistResult);
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
	      isVerified={isVerified}
	      isWhitelisted={isWhitelisted}
        />
        <div className="masterContainer">
	    <Switch>
          <Route exact path="/">
            <Homepage 
	          user={user}
	          isVerified={isVerified}
	          isWhitelisted={isWhitelisted}
	        />
          </Route>
          <Route path="/art">
            <Art 
	          user={user}
	          isVerified={isVerified}
	          isWhitelisted={isWhitelisted}
            />
          </Route>
          <Route path="/create">
            <Create
	          user={user}
	          isVerified={isVerified}
	          isWhitelisted={isWhitelisted}
            />
          </Route>
          <Route path="/people">
            <People 
	          user={user}
	          isVerified={isVerified}
	          isWhitelisted={isWhitelisted}
            />
          </Route>
          <Route path="/account">
            <Account
	          handleLogin={handleLogin}
	          handleLogout={handleLogout}
	          user={user}
	          isVerified={isVerified}
	          isWhitelisted={isWhitelisted}
            />
          </Route>
          <Route path="/blog">
            <Blog
            user={user}
            isVerified={isVerified}
            isWhitelisted={isWhitelisted}
            />
          </Route>
	      <NotFound default />
        </Switch>
        </div>
	  </BrowserRouter>
	</>
  );
}

export default App;
