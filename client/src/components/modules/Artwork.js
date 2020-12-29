import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import { firebase } from '@firebase/app';
import { auth, firestore, storage} from "../../firebaseClient";

import "../../utilities.css";
import { deleteMediaByURL, uploadToFirestore } from "../../utilities";
import "../../public/stylesheets/Art.css";
import { FileDisplay, FileProcessor } from "./FileProcessor.js";
import ArtworkEditor from "./ArtworkEditor.js";
import LinkButton from "./LinkButton.js";

function Artwork(props) {
  
  const isOwner = (props.user && props.artwork.ownerId === props.user.uid); 

  return (
    <>
      <div className="artworkContainer">
        { isOwner ?
            (
              <>
                <ArtworkEditor id={props.user.uid} artwork={props.artwork}/>
              </>
            ) :
            (
              <>
                <div className="artworkText">
                  <div className="title">{props.artwork.title}</div>
                  <div className="description">{props.artwork.description}</div>
                  <div className="author">
                    <span>Posted by </span>
                    <Link to={"/people?id=" + props.artwork.profileId}>
                      {props.artwork.ownerName}
                    </Link>
                  </div>
                </div>
                <FileDisplay type={props.artwork.type} URL={props.artwork.downloadURL}/>
              </>
            )
        }
      </div>
    </>
  );
}

export default Artwork;
