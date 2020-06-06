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

  // TODO: All of this seems a bit hacky... you have basically implemented a state machine. Is that necessary?
  // Perhaps you just need to use the useEffect hook?

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
      console.log(props.user);
     
      let query = (props.user) ?
        firestore.collection("art").orderBy("lastUpdated")
        :     
        firestore.collection("art").orderBy("lastUpdated").where("visibility", "==", "public");

      query.get()
        .then((gallerySnapshot) => {
          setGallery(gallerySnapshot.docs.reverse());
          setId(null);
        });
    }
  }
  return (
    <>
      { id ?
        (artwork ? <Artwork artwork={artwork} id={id} user={props.user}/> : <div>Loading...</div>):
        <Gallery gallery={gallery}/> 
      }     
    </>
  );

}

export default Art;
