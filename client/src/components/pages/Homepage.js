import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { firebase } from '@firebase/app';
import "firebase/auth";

import "../../utilities.css";
import "../../public/stylesheets/Homepage.css";

import { auth, firestore } from "../../firebaseClient";

function Homepage(props) {
  // TODO: perhaps replace this with a THREE.js animation eventually?
  // In the long term, will definitely want to replace this animation,
  // since it is actually so CPU-intensive
  return (
    <>
      <div className="homepage_container">
        <div id = "cloud_container">
          <div className="x1 "><div className="cloud"></div></div>
          <div className="x2 "><div className="cloud"></div></div>
          <div className="x3 "><div className="cloud"></div></div>
          <div className="x4 "><div className="cloud"></div></div>
          <div className="x5 "><div className="cloud"></div></div>
          <div className="x6 "><div className="cloud"></div></div>
          <div className="x8 "><div className="cloud"></div></div>
          <div className="x9 "><div className="cloud"></div></div>
          <div className="x10"><div className="cloud"></div></div>
        </div>
        <div id="text_container">
          <div id="title">
            <div>Danger</div>
            <div>Third</div>
            <div>Rail</div>
          </div>
        </div>
      </div>
    </>
  );

}

export default Homepage;
