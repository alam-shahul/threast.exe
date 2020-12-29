import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import { firebase } from '@firebase/app';
import { auth, firestore, storage} from "../../firebaseClient";

import "../../utilities.css";
import { deleteMediaByURL, uploadToFirestore } from "../../utilities";
import "../../public/stylesheets/Art.css";
import { FileDisplay, FileProcessor } from "./FileProcessor.js";
import BlogpostEditor from "./BlogpostEditor.js";
import LinkButton from "./LinkButton.js";

function Blogpost(props) {
  
  const isOwner = (props.user && props.blogpost.ownerId === props.user.uid); 

  return (
    <>
      <div className="artworkContainer">
        { isOwner ?
            (
              <>
                <BlogpostEditor id={props.user.uid} blogpost={props.blogpost}/>
              </>
            ) :
            (
              <>
                <div className="artworkText">
                  <div className="title">{props.blogpost.title}</div>
                  <div className="description">{props.blogpost.content}</div>
                  <div className="author">
                    <span>Posted by </span>
                    <Link to={"/people?id=" + props.blogpost.profileId}>
                      {props.blogpost.ownerName}
                    </Link>
                  </div>
                </div>
                <FileDisplay type={props.blogpost.thumbnailType} URL={props.blogpost.thumbnailURL}/>
              </>
            )
        }
      </div>
    </>
  );
}

export default Blogpost;