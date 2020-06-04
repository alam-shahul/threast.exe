import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link } from "react-router-dom";

import { firebase } from '@firebase/app';
import "firebase/auth";

import { auth, firestore } from "../../firebaseClient";
import ProfileEditor from "../modules/ProfileEditor.js";
import "../../utilities.css";

function Account(props) {
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  let isWhitelisted = (!!props.user);

  useEffect(() => {
    var unregisterAuthObserver = auth.onAuthStateChanged((user) => {
        setIsAuthenticated(!!user);
      });
    return unregisterAuthObserver;
  });

  if (props.user && !profile) {
    console.log(props.user.profileId);
    firestore.collection("profiles").doc(props.user.profileId).get()
      .then((profileSnapshot) => {
        let profileData = profileSnapshot.data();
        console.log(profileData);
        setProfile(profileData);
      });
  }

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Email/Password as auth providers.
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
          props.handleLogin(loginResponse).then((whitelistResult) => {
            console.log(whitelistResult);
          });
        });
        return false;
      }
    }
  };

  if (isAuthenticated) {
    console.log(props.user);
    return (
      <>
        { (isWhitelisted) ?
          (
            <div>
              <p>Welcome {auth.currentUser.displayName}! You are now signed-in!</p>
            </div>
          )
          :
          (
            <div>
              <p>You are currently not signed in as a whitelisted user. Please reauthenticate with a whitelisted account.</p>
            </div>
          )
        }
        <a onClick={() => {setProfile(null); auth.signOut(); props.handleLogout()}}>Sign-out</a>
        { (profile) ?
            <ProfileEditor uid={props.user.uid} profileId={props.user.profileId} profile={profile}/>
          :
            <></>
        }
      </>
    );
  }
  else {
    return (
      <div>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
      </div>
    )
  }
}

export default Account;
