import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { firebase } from '@firebase/app';
import "firebase/auth";

import "../../utilities.css";
import "./Skeleton.css";

class Skeleton extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      isSignedIn: false
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    this.unregisterAuthObserver = this.props.firebaseApp.auth().onAuthStateChanged((user) => {
      this.setState({isSignedIn: !!user});
    });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  uiConfig = {
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
        // console.log(currentUser);
        let token = currentUser.getIdToken(true);
        let displayName = currentUser.displayName;
        let email = currentUser.email;
        let loginResponse = {"token": token, "displayName": displayName, "email": email}
        this.props.handleLogin(loginResponse);
        return false;
      }
    }
  };


  render() {
    return (
      <>
        {(!this.state.isSignedIn) ?
        (
          <div>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
          </div>
        )
        :
        // TODO: Is handleLogout working properly here? Also, is this the right place to be doing it?
        (
          <div>
            <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
            <a onClick={() => {firebase.auth().signOut(); this.props.handleLogout}}>Sign-out</a>
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
}

export default Skeleton;
