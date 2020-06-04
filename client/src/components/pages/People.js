import React, { useState, useEffect } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import queryString from 'query-string'

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";
import Gallery from "../modules/Gallery.js";
import PeopleGallery from "../modules/PeopleGallery.js";
import { get, post } from "../../utilities";

function People(props) {
  const url = useLocation().search;
  const parsed = queryString.parse(url);

  const [id, setId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [artworks, setArtworks] = useState(null);
  const [peopleGallery, setPeopleGallery] = useState(null);

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
            .where("profileId", "==", id)
            .get()
              .then((artworksSnapshot) => {
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
      console.log(peopleGallery);
      console.log(props.user);
     
      let query = firestore.collection("profiles");

      query.get()
        .then((peopleGallerySnapshot) => {
          setPeopleGallery(peopleGallerySnapshot.docs);
          console.log(peopleGallerySnapshot.docs);
          setId(null);
        });
    }
  }

  return (
    <>
      { id ?
          (
            <>
              { profile ? 
                <>
                  <p>profile</p>
                  <div>{profile.email}</div>
                  <div>{profile.displayName}</div>
                  <div>{profile.blurb}</div>
                  <img src={profile.photoURL}></img>
                </>
                :
                <div>Not a valid profile!</div>
              }
              { artworks ?
                <Gallery gallery={artworks}/>      
                :
                <></>
              }
            </>
          )
        :
        <PeopleGallery peopleGallery={peopleGallery}/>
      }
    </>
  );

}

export default People;
