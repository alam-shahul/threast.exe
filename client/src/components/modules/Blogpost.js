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
      <div className="blogContainer">
        { isOwner ?
            (
              <>
                <BlogpostEditor id={props.id} blogpost={props.blogpost}/>
              </>
            ) :
            (
              <>
                <div className="blogHeader">
                  <div className="title">{props.blogpost.title}</div>
                  <div className="tagline">{props.blogpost.tagline}</div>
                  <div className="author">
                    <span>Posted by </span>
                    <Link to={"/people?id=" + props.blogpost.profileId}>
                      {props.blogpost.ownerName}
                    </Link>
                  </div>
                  <FileDisplay type="image" URL={props.blogpost.thumbnailURL}/>
                </div>
                <div className="content">{props.blogpost.content}</div>
              </>
            )
        }
      </div>
    </>
  );
}

export default Blogpost;
