import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import VideoThumbnail from 'react-video-thumbnail';

import queryString from 'query-string'

import { firebase } from '@firebase/app';
import { auth, firestore, storage } from "../../firebaseClient";

import "../../utilities.css";
import "../../public/stylesheets/Blog.css";
import BlogGallery from "../modules/BlogGallery.js";
import Blogpost from "../modules/Blogpost.js";
import Loading from "../modules/Loading.js";

import { get, post } from "../../utilities";

function Blog(props) {
  const url = useLocation().search;
  const parsed = queryString.parse(url);

  const [id, setId] = useState(null);
  const [blogpost, setBlogpost] = useState(null);

  // TODO: All of this seems a bit hacky... you have basically implemented a state machine. Is that necessary?
  // Perhaps you just need to use the useEffect hook?
  if (parsed.id) {
    if(!blogpost || (parsed.id != id)) {
      firestore.collection("blogs").doc(parsed.id).get()
        .then((blogSnapshot) => {
          setBlogpost(blogSnapshot.data());
          setId(parsed.id);
        });
    }
  }

  else if (id) {
    setBlogpost(null);
    setId(null);
  }

  let startQuery = (props.user) ?
    firestore.collection("blogs").orderBy("lastUpdated", "desc")
    :     
    firestore.collection("blogs").orderBy("lastUpdated", "desc").where("visibility", "==", "public");

  return (
    <>
      { id ?
        (blogpost ? <Blogpost blogpost={blogpost} id={id} user={props.user}/> : <Loading/>):
        <>
          <BlogGallery startQuery={startQuery} title={"Words of Wisdom? Sentences of Smartness?"}/>
        </> 
      }     
    </>
  );

}

export default Blog;