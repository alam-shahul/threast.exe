import React, { useState, useEffect } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import queryString from 'query-string'

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";
import Profile from "../modules/Profile.js";
import PeopleGallery from "../modules/PeopleGallery.js";
import Loading from "../modules/Loading.js";
import { get, post } from "../../utilities";

function People(props) {
  const url = useLocation().search;
  const parsed = queryString.parse(url);

  const [id, setId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [peopleGallery, setPeopleGallery] = useState(null);

  if (parsed.id) {
    if (!profile || parsed.id != id) {
      firestore.collection("profiles").doc(parsed.id).get()
        .then((profileSnapshot) => {
          let profileData = profileSnapshot.data();
          setProfile(profileData);
          setId(parsed.id);
      });
    }
  }
  else {
    if(!peopleGallery || id) {
      console.log(props.user);
    
      // Alphabetical order 
      let query = firestore.collection("profiles").orderBy("displayName");

      query.get()
        .then((peopleGallerySnapshot) => {
          // Update people gallery
          setPeopleGallery(peopleGallerySnapshot.docs);
          setId(null);
        });
    }
  }
  
  if (id) {
    let artStartQuery = firestore.collection("art")
      .orderBy("lastUpdated", "desc")
      .where("profileId", "==", id);

    let blogStartQuery = firestore.collection("blogs")
      .orderBy("lastUpdated", "desc")
      .where("profileId", "==", id);

    if (!props.user) {
      artStartQuery = artStartQuery.where("visibility", "==", "public");
      blogStartQuery = blogStartQuery.where("visibility", "==", "public");
    }

    return ( <Profile profile={profile} artStartQuery={artStartQuery} blogStartQuery={blogStartQuery} /> );
  }
  else
    if (peopleGallery)
      return ( <PeopleGallery peopleGallery={peopleGallery}/> );
    else
      return ( <Loading/> );
}

export default People;
