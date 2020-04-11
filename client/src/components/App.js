import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";

import { firebase } from '@firebase/app';
import "firebase/auth";
import "firebase/firestore";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */

class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    var firebaseConfig = {
        apiKey: "AIzaSyAvZsDdDGOyMaCHQcXsUDx-85yr9akOhgw",
        authDomain: "threast-website.firebaseapp.com",
        databaseURL: "https://threast-website.firebaseio.com",
        projectId: "threast-website",
        storageBucket: "threast-website.appspot.com",
        messagingSenderId: "933380237825",
        appId: "1:933380237825:web:3e4ccd069e65d4b8"
    };
    this.state = {
      userId: undefined,
      firebaseApp: firebase.initializeApp(firebaseConfig)
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (res) => {
    //console.log(`Logged in as ${res.displayName}`);
    console.log(res);
    res.token.then((userToken) => {
      post("/api/login", { token: userToken, displayName: res.displayName, email: res.email }).then((user) => {
        this.setState({ userId: user.uid });
        console.log(this.state.userId);
        post("/api/initsocket", { socketid: socket.id });
      });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
        <Router>
          <Skeleton
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
            firebaseApp={this.state.firebaseApp}
          />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
