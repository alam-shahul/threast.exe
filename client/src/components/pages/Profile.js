import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { firebase } from '@firebase/app';
import "firebase/auth";

import "../../utilities.css";

function Profile(props) {

  return (
    <>
      <p>profile</p>
    </>
  );

}

export default Profile;