import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import VideoThumbnail from 'react-video-thumbnail';
import queryString from 'query-string'

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";
import "../../public/stylesheets/Art.css";
import Gallery from "../modules/Gallery.js";
import Artwork from "../modules/Artwork.js";

import { get, post } from "../../utilities";

function Art(props) {
  const url = useLocation().search;
  const parsed = queryString.parse(url);

  const [id, setId] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [user, setUser] = useState(null);
 
  if (!user) { 
    get("/api/whoami").then((user) => {
      setUser(user);
    });
  }

  // TODO: All of this seems a bit hacky... you have basically implemented a state machine. Is that necessary?
  if (parsed.id) {
    if(!artwork || (parsed.id != id)) {
      firestore.collection("art").doc(parsed.id).get()
        .then((artSnapshot) => {
          //console.log(artSnapshot.data());
          setArtwork(artSnapshot.data());
          setId(parsed.id);
        });
    }
  }
  else {
    if(!gallery || id) {
      console.log(gallery);
      firestore.collection("art").orderBy("lastUpdated").get()
        .then((gallerySnapshot) => {
          //gallerySnapshot.forEach(doc => {
          //  console.log(doc.id, '=>', doc.data().downloadURL);
          //});
          setGallery(gallerySnapshot.docs);
          setId(null);
        });
    }
  }
  return (
    <>
      { id ?
        (artwork ? <Artwork artwork={artwork} id={id} userId={user.uid}/> : <div>Loading...</div>):
        <Gallery gallery={gallery}/> 
      }     
    </>
  );

}

export default Art;
