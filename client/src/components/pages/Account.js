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
  const [artworks, setArtworks] = useState(null);
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

  console.log(allClear);
  console.log(profile);
  if (allClear) {
    if (props.user && !profile) {
      firestore.collection("profiles").doc(props.user.profileId).get()
        .then((profileSnapshot) => {
          let profileData = profileSnapshot.data();
          setProfile(profileData);
        });
    }

    if (props.user && !artworks) {
      firestore.collection("art")
        .orderBy("lastUpdated")
        .where("profileId", "==", props.user.profileId)
        .get()
          .then((artworksSnapshot) => {
            console.log(artworksSnapshot.docs);
            if (artworksSnapshot.docs) {
              setArtworks(artworksSnapshot.docs);
            }
          });
    }
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

  return (
    <>
      <div className="accountContainer">
        <AuthenticationMessage/>
        { (isAuthenticated) ?
            <>
              <div className="editorContainer">
                <button onClick={() => {setProfile(null); auth.signOut(); props.handleLogout()}}>Sign-out</button>
                { (profile && props.user) ?
                    <>
                      <ProfileEditor uid={props.user.uid} profileId={props.user.profileId} profile={profile} updateParent={setProfile}/>
                      <div className="profilePreview">
                        <div>Thumbnail Preview</div>
                        <ProfileThumbnail profile={mockProfile}/>
                      </div>
                    </>
                  :
                    <></>
                }
              </div>
              { artworks ?
                <Gallery gallery={artworks} title={"Your Art"}/>
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
