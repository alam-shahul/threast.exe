import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import "../../utilities.css";
import { deleteMediaByURL, uploadToFirestore } from "../../utilities";
import { FileDisplay, FileProcessor } from "./FileProcessor.js";
import BlogpostEditor from "./BlogpostEditor.js";
import BlogpostViewer from "./BlogpostViewer.js";

function Blogpost(props) {
  const isOwner = (props.user && props.blogpost.ownerId === props.user.uid); 
  const [comments, setComments] = useState(null);

  return (
    <>
      { isOwner ?
          (
            <BlogpostEditor id={props.id} user={props.user} blogpost={props.blogpost}/>
          ) :
          (
            <BlogpostViewer id={props.id} user={props.user} blogpost={props.blogpost}/>
          )
      }
    </>
  );
}

export default Blogpost;
