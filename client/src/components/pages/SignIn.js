import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link } from "react-router-dom";

import { firebase } from '@firebase/app';
import "firebase/auth";

import { auth, firestore } from "../../firebaseClient";
import "../../utilities.css";

function SignIn(props) {

  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    var unregisterAuthObserver = auth.onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
      });
    return unregisterAuthObserver;
  });

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: (authResult) => {
        let currentUser = auth.currentUser;
        console.log(currentUser);
        let token = currentUser.getIdToken(true);
        console.log(auth);
        token.then((idToken) => {
          let displayName = currentUser.displayName;
          let email = currentUser.email;
          let loginResponse = {"token": idToken, "displayName": displayName, "email": email}
          props.handleLogin(loginResponse);
        });
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
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
        </div>
      )
      :
      // TODO: Is this the right place to call handleLogout?
      // Also TODO: handleLogin/handleLogout seem to want to persist user information in req.session
      // But I don't think we actually use this state, since we call /api/whoami everytime we load the
      // page anyways. So maybe we should actually use the persisted state?
      (
        <div>
          <p>Welcome {auth.currentUser.displayName}! You are now signed-in!</p>
          <a onClick={() => {auth.signOut(); props.handleLogout()}}>Sign-out</a>
        </div>
      )
      }
      <Link to = "/profile"> Go to profile </Link>
    </>
  );

}

export default SignIn;
