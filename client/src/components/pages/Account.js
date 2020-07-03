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
import "../../public/stylesheets/Create.css";
import "../../utilities.css";

function Account(props) {
  const [profile, setProfile] = useState(null);
  const [artworks, setArtworks] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  let mockProfile = null;

  if (profile) {
    mockProfile = {
      displayName: profile.displayName,
      blurb: profile.blurb,
      photoURL: profile.photoURL,
      class: profile.class
    }
  }
  let isWhitelisted = (!!props.user);

  useEffect(() => {
    var unregisterAuthObserver = auth.onAuthStateChanged((user) => {
        setIsAuthenticated(!!user);
      });
    return unregisterAuthObserver;
  });

  if (props.user && !profile) {
    console.log(props.user);
    console.log(props.user.profileId);
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
        let token = currentUser.getIdToken(true);
        token.then((idToken) => {
          let displayName = currentUser.displayName;
          let email = currentUser.email;
          let loginResponse = {"token": idToken, "displayName": displayName, "email": email}
          props.handleLogin(loginResponse).then((whitelistResult) => {
          });
        });
        return false;
      }
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <div className="accountContainer">
          <div className="editorContainer">
            <div className="authenticationMessage">
              { (isWhitelisted) ?
                  `Welcome ${auth.currentUser.displayName}! You are now signed-in!`
                :
                  `You are currently not signed in as a whitelisted user. Please reauthenticate with a whitelisted account.`
              }
            </div>
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
        </div>
      </>
    );
  }
  else {
    return (
      <div className="accountContainer">
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
      </div>
    )
  }
}

export default Account;
