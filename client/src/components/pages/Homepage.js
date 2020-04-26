import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { firebase } from '@firebase/app';
import "firebase/auth";

import "../../utilities.css";
import "./Homepage.css";

function Homepage(props) {

  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    var unregisterAuthObserver = props.firebaseApp.auth().onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
      });
    return unregisterAuthObserver;
  });

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: (authResult) => {
        let currentUser = firebase.auth().currentUser;
        console.log(currentUser);
        let token = currentUser.getIdToken(true);
        let displayName = currentUser.displayName;
        let email = currentUser.email;
        let loginResponse = {"token": token, "displayName": displayName, "email": email}
        props.handleLogin(loginResponse);
        return false;
      }
    }
  };

  return (
    <>
      {(!isSignedIn) ?
      (
        <div>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      )
      :
      // TODO: Is this the right place to call handleLogout?
      (
        <div>
          <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
          <a onClick={() => {firebase.auth().signOut(); props.handleLogout()}}>Sign-out</a>
        </div>
      )
      }
      <h1>Good luck on your project :)</h1>
      <h2> What we provide in this skeleton</h2>
      <ul>
        <li>Google Auth (Skeleton.js & auth.js)</li>
        <li>Socket Infrastructure (client-socket.js & server-socket.js)</li>
        <li>User Model (auth.js & user.js)</li>
      </ul>
      <h2> What you need to change</h2>
      <ul>
        <li>Change the font in utilities.css</li>
        <li>Change the Frontend CLIENT_ID for Google Auth (Skeleton.js)</li>
        <li>Change the Server CLIENT_ID for Google Auth (auth.js)</li>
        <li>Change the Database SRV for Atlas (server.js)</li>
        <li>Change the Database Name for MongoDB (server.js)</li>
        <li>Add a favicon to your website at the path client/dist/favicon.ico</li>
        <li>Update website title in client/dist/index.html</li>
      </ul>
    </>
  );

}

export default Homepage;
