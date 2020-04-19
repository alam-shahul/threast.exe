import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Homepage from "./pages/Homepage.js";

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
    setUserId(undefined);
    post("/api/logout");
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
		    <NotFound default />
		  </Router>
	  </>
  );
}


// class App extends Component {
  // makes props available in this component
  // constructor(props) {
  //   super(props);
  //   var firebaseConfig = {
  //   apiKey: "AIzaSyAvZsDdDGOyMaCHQcXsUDx-85yr9akOhgw",
  //   authDomain: "threast-website.firebaseapp.com",
  //   databaseURL: "https://threast-website.firebaseio.com",
  //   projectId: "threast-website",
  //   storageBucket: "threast-website.appspot.com",
  //   messagingSenderId: "933380237825",
  //   appId: "1:933380237825:web:874189b6c93cdefd"
  //   };
  //   this.state = {
  //   userId: undefined,
  //   firebaseApp: firebase.initializeApp(firebaseConfig)
  //   };
  // }

  // componentDidMount() {
  //   get("/api/whoami").then((user) => {
  //   if (user._id) {
  //   // they are registed in the database, and currently logged in.
  //   this.setState({ userId: user._id });
  //   }
  //   });
  // }



//   render() {
//   return (
//   <>
//   <Router>
//     <Homepage
//     path="/"
//     handleLogin={this.handleLogin}
//     handleLogout={this.handleLogout}
//     userId={this.state.userId}
//     firebaseApp={this.state.firebaseApp}
//     />
//     <NotFound default />
//   </Router>
//   </>
//   );
//   }
// }

export default App;
