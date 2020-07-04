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
  const pageSize = 10;

  const [nextAvailable, setNextAvailable] = useState(false);
 
  const [currentPage, setCurrentPage] = useState(0);
  const [id, setId] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [gallery, setGallery] = useState(null);

  // TODO: All of this seems a bit hacky... you have basically implemented a state machine. Is that necessary?
  // Perhaps you just need to use the useEffect hook?

  function populateNext() {
    fetchGallery("next").then((gallerySnapshot) => {
      if (gallerySnapshot.docs.length > 0) {
        setGallery(gallerySnapshot.docs);
        setId(null);
        setCurrentPage(currentPage+1);

        let lastVisible = gallerySnapshot.docs[gallerySnapshot.docs.length - 1];
        isNextAvailable(lastVisible);
      }
    });
  }

  function populatePrevious() {
    fetchGallery("previous").then((gallerySnapshot) => {
      if (gallerySnapshot.docs.length > 0) {
        setGallery(gallerySnapshot.docs);
        setId(null);
        setCurrentPage(currentPage-1);

        setNextAvailable(true);
      }
    });
  }

  function isNextAvailable(lastVisible) {
    let query = (props.user) ?
      firestore.collection("art").orderBy("lastUpdated", "desc")
      :     
      firestore.collection("art").orderBy("lastUpdated", "desc").where("visibility", "==", "public");
    
    query
      .startAfter(lastVisible)
      .get().then((gallerySnapshot) => {
        let nextStatus = (gallerySnapshot.docs.length > 0);
        setNextAvailable(nextStatus);
      });
  }

  function fetchGallery(type = "initial") {
    let query = (props.user) ?
      firestore.collection("art").orderBy("lastUpdated", "desc")
      :     
      firestore.collection("art").orderBy("lastUpdated", "desc").where("visibility", "==", "public");

    if (type === "initial") {
      query = query.limit(pageSize);
    }
    else if (type === "previous") {
      let firstVisible = gallery[0];
      query = query
        .endBefore(firstVisible)
        .limitToLast(pageSize);
    }
    else if (type === "next") {
      let lastVisible = gallery[gallery.length-1];
      query = query
        .startAfter(lastVisible)
        .limit(pageSize);
    }
    
    return query.get()
  }

  if (parsed.id) {
    if(!artwork || (parsed.id != id)) {
      firestore.collection("art").doc(parsed.id).get()
        .then((artSnapshot) => {
          setArtwork(artSnapshot.data());
          setId(parsed.id);
        });
    }
  }
  else {
    if(!gallery || id) {
      console.log(gallery);
      console.log(props.user);
    
      fetchGallery().then((gallerySnapshot) => {
        isNextAvailable(gallerySnapshot.docs[gallerySnapshot.docs.length - 1]);
        setGallery(gallerySnapshot.docs);
        setId(null);
        setCurrentPage(0);
      });
    }
  }
  return (
    <>
      { id ?
        (artwork ? <Artwork artwork={artwork} id={id} user={props.user}/> : <div>Loading...</div>):
        <>
          <Gallery gallery={gallery} title={"3E Community Art"}/>
          { (currentPage != 0) ?
            <button onClick={e => populatePrevious()}>Previous Page</button>
            :
            <></>
          }
          { (nextAvailable) ?
            <button onClick={e => populateNext()}>Next Page</button>
            :
            <></>
          }
        </> 
      }     
    </>
  );

}

export default Art;
