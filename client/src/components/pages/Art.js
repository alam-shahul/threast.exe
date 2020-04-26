import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { firebase } from '@firebase/app';
import "firebase/auth";

import "../../utilities.css";

import { get, post } from "../../utilities";

function Art(props) {
  get("/api/whoami").then((user) => {
    console.log(user);
  });

  return (
    <>
      
    </>
  );

}

export default Art;
