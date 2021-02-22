import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import VideoThumbnail from 'react-video-thumbnail';

import queryString from 'query-string'

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";
import "../../public/stylesheets/Game.css";
import GameGallery from "../modules/GameGallery.js";
import Game from "../modules/Game.js";
import Loading from "../modules/Loading.js";

import { get, post } from "../../utilities";

function Play(props) {
  const url = useLocation().search;
  const parsed = queryString.parse(url);

  const [id, setId] = useState(null);
  const [game, setGame] = useState(null);

  // TODO: All of this seems a bit hacky... you have basically implemented a state machine. Is that necessary?
  // Perhaps you just need to use the useEffect hook?
  if (parsed.id) {
    if(!game || (parsed.id != id)) {
      firestore.collection("games").doc(parsed.id).get()
        .then((gameSnapshot) => {
          setGame(gameSnapshot.data());
          setId(parsed.id);
        });
    }
  }
  else if (id) {
    setGame(null);
    setId(null);
  }

  let startQuery = (props.user) ?
    firestore.collection("games").orderBy("title", "asc")
    :     
    firestore.collection("games").orderBy("title", "asc").where("visibility", "==", "public");

  return (
    <>
      { id ?
        (game ? <Game game={game} id={id} user={props.user}/> : <Loading/>):
        <>
          <GameGallery startQuery={startQuery} title={"Games"}/>
        </> 
      }     
    </>
  );

}

export default Play;
