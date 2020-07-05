import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link } from "react-router-dom";

import { firebase } from '@firebase/app';
import "firebase/auth";

import { auth, firestore } from "../../firebaseClient";
import ProfileEditor from "../modules/ProfileEditor.js";
import ProfileThumbnail from "../modules/ProfileThumbnail.js";
import Gallery from "../modules/Gallery.js";
import "../../public/stylesheets/Account.css";
import "../../utilities.css";

function Account(props) {
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  let allClear = (isAuthenticated && props.isVerified && props.isWhitelisted);
  let mockProfile = null;

  if (profile) {
    mockProfile = {
      displayName: profile.displayName,
      blurb: profile.blurb,
      photoURL: profile.photoURL,
      class: profile.class
    }
  }

  useEffect(() => {
    var unregisterAuthObserver = auth.onAuthStateChanged((user) => {
        setIsAuthenticated(!!user);
      });
    return unregisterAuthObserver;
  });

  useEffect(() => {
    if (allClear) {
      if (props.user) {
        firestore.collection("profiles").doc(props.user.profileId).get()
          .then((profileSnapshot) => {
            let newProfile = profileSnapshot.data();
            if (!profile || (profile.email != newProfile.email)) { 
              setProfile(newProfile);
            }
          });
      }
    }
  });

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
        console.log("signin success!");
        let currentUser = auth.currentUser;
        let token = currentUser.getIdToken(true);
        if (!currentUser.emailVerified) {
          console.log("not verified");
          currentUser.sendEmailVerification();
        }
        token.then((idToken) => {
          let displayName = currentUser.displayName;
          let email = currentUser.email;
          let loginResponse = {"token": idToken, "displayName": displayName, "email": email}
          console.log("logging in");
          props.handleLogin(loginResponse);
        });
        return false;
      }
    }
  };

  function AuthenticationMessage() {
    let message;
    if(!isAuthenticated)
      message = "Please sign-in:"; 
    else if (!props.isWhitelisted)
      message = "You are not signed in as a whitelisted user. Please reauthenticate with a whitelisted account."
    else if (!props.isVerified)
      message = "Your account is currently unverified. Please check your email for a verification link, and reauthenticate here after clicking the link."
    else
      message = `Welcome ${auth.currentUser.displayName}! You are now signed-in!`;
    
    return (
      <div className="authenticationMessage">
        {message}
      </div>
    )
  }

  let startQuery;
  if (props.user) {
    startQuery = firestore.collection("art")
      .orderBy("lastUpdated", "desc")
      .where("profileId", "==", props.user.profileId);
  }

  return (
    <>
      <div className="accountContainer">
        <AuthenticationMessage/>
        { (isAuthenticated) ?
            <>
              <span className="signoutButton" onClick={() => {setProfile(null); auth.signOut(); props.handleLogout()}}>Sign Out</span>
              { (profile && props.user && allClear) ?
                <>
                  <ProfileEditor uid={props.user.uid} profileId={props.user.profileId} profile={profile} updateParent={setProfile}/>
                  <div className="profilePreview">
                    <div className="u-bold">Thumbnail Preview</div>
                    <ProfileThumbnail profile={mockProfile}/>
                  </div>
                  <Gallery startQuery={startQuery} title={"Your Art"}/>
                </>
                :
                <></>
              }
            </>
          :
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
        }
      </div>
    </>
  );
}

export default Account;
