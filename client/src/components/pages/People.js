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
import { get, post } from "../../utilities";

function People(props) {
  const url = useLocation().search;
  const parsed = queryString.parse(url);

  const [id, setId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [artworks, setArtworks] = useState(null);
  const [peopleGallery, setPeopleGallery] = useState(null);

  console.log(id);
  if (parsed.id) {
    if(!profile || !artworks || (parsed.id != id)) {
      firestore.collection("profiles").doc(parsed.id).get()
        .then((profileSnapshot) => {
          let profileData = profileSnapshot.data();
          setProfile(profileData);
          setId(parsed.id);
          firestore.collection("art")
            .orderBy("lastUpdated")
            .where("visibility", "==", "public")
            .where("profileId", "==", parsed.id)
            .get()
              .then((artworksSnapshot) => {
                console.log(profile);
                console.log(parsed.id);
                console.log(artworksSnapshot.docs);
                if (artworksSnapshot.docs) {
                  setArtworks(artworksSnapshot.docs);
                }
              });
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

  if (id)
    return ( <Profile profile={profile} artworks={artworks}/> );
  else
    if (peopleGallery)
      return ( <PeopleGallery peopleGallery={peopleGallery}/> );
    else
      return ( <>Loading...</> );
}

export default People;
