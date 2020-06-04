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
          <div className="cloud x1"></div>
          <div className="cloud x2"></div>
          <div className="cloud x3"></div>
          <div className="cloud x4"></div>
          <div className="cloud x5"></div>
          <div className="cloud x6"></div>
          <div className="cloud x8"></div>
          <div className="cloud x9"></div>
          <div className="cloud x10"></div>
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
