import React, { useState, useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link, navigate } from "@reach/router";

import { firebase } from '@firebase/app';
import "firebase/auth";

import "../../utilities.css";

function SignIn(props) {

  return (
    <>
      <Link to = "/profile"> Go to profile </Link>
    </>
  );

}

export default SignIn;